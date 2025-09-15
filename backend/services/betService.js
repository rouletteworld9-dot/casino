const User = require("../models/User");
const Bet = require("../models/Bet");
const {
  validateBet,
  VALID_BET_TYPES,
  validateMultipleBets,
} = require("../game/betValidator");
const { GAME_CONFIG } = require("../config/constants");
const winnersService = require("./winnersService");

function calculateTotalBetAmount(bets) {
  return bets.reduce((total, bet) => total + bet.amount, 0);
}

function processUserBets(bets, roundId, socketId, userId) {
  return bets.map((bet) => ({
    ...bet,
    userId,
    socketId,
    roundId,
    betId: `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }));
}

async function validateUserBalance(userId, totalAmount) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const realDeduction = Math.round(
    totalAmount * GAME_CONFIG.REAL_BALANCE_RATIO
  );
  const tokenDeduction = Math.round(
    totalAmount * GAME_CONFIG.TOKEN_BALANCE_RATIO
  );

  if (user.realBalance < realDeduction || user.playTokens < tokenDeduction) {
    throw new Error("Insufficient balance");
  }

  return { user, realDeduction, tokenDeduction };
}

async function deductUserBalance(user, realAmount, tokenAmount) {
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: user._id,
      realBalance: { $gte: realAmount },
      playTokens: { $gte: tokenAmount },
    },
    {
      $inc: { realBalance: -realAmount, playTokens: -tokenAmount },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Insufficient balance");
  }
  
  return updatedUser;
}

// Helper function to safely emit to socket
function safeEmitToSocket(io, socketId, event, data) {
  try {
    // Check if socket exists and is connected
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.connected) {
      socket.emit(event, data);
      return true;
    } else {
      console.log(`Socket ${socketId} not found or disconnected`);
      return false;
    }
  } catch (error) {
    console.error(`Error emitting to socket ${socketId}:`, error.message);
    return false;
  }
}

// Helper function to emit to user by userId (fallback method)
function emitToUserById(io, userId, event, data) {
  try {
    // Find all sockets for this user
    const userSockets = [];
    for (const [, socket] of io.sockets.sockets) {
      if (socket.userId === userId && socket.connected) {
        userSockets.push(socket);
      }
    }
    
    if (userSockets.length > 0) {
      userSockets.forEach(socket => {
        try {
          socket.emit(event, data);
        } catch (err) {
          console.error(`Error emitting to user socket:`, err.message);
        }
      });
      return true;
    }
    
    console.log(`No connected sockets found for user ${userId}`);
    return false;
  } catch (error) {
    console.error(`Error finding sockets for user ${userId}:`, error.message);
    return false;
  }
}

async function settleBets(bets, winningNumber, io) {
  console.log(`Starting bet settlement for ${bets.length} bets with winning number ${winningNumber}`);
  
  let updatedWinners = await winnersService.getRecentWinners();
  
  if (!bets || bets.length === 0) {
    // No bets placed, add a fake winner
    updatedWinners = await winnersService.addWinner(
      "fake",
      winnersService.getRandomFakeName(),
      Math.floor(Math.random() * 15000),
      "fake"
    );
    return updatedWinners;
  }

  // Group bets by userId to process them more efficiently
  const betsByUser = {};
  bets.forEach(bet => {
    if (!betsByUser[bet.userId]) {
      betsByUser[bet.userId] = [];
    }
    betsByUser[bet.userId].push(bet);
  });

  console.log(`Processing bets for ${Object.keys(betsByUser).length} unique users`);

  // Process each user's bets
  for (const [userId, userBets] of Object.entries(betsByUser)) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.error(`User ${userId} not found during settlement`);
        continue;
      }

      let totalWinAmount = 0;
      let totalRealCredit = 0;
      let totalTokenCredit = 0;
      const winningBets = [];
      const losingBets = [];

      // Check each bet for this user
      for (const bet of userBets) {
        const isWin = validateBet(bet, winningNumber);
        
        if (isWin) {
          const payout = bet.amount * VALID_BET_TYPES[bet.type].payout + bet.amount;
          const realCredit = Math.round(payout * GAME_CONFIG.REAL_BALANCE_RATIO);
          const tokenCredit = Math.round(payout * GAME_CONFIG.TOKEN_BALANCE_RATIO);
          
          totalWinAmount += payout;
          totalRealCredit += realCredit;
          totalTokenCredit += tokenCredit;
          
          winningBets.push({
            ...bet,
            payout,
            realCredit,
            tokenCredit
          });
        } else {
          losingBets.push(bet);
        }

        // Save bet to database
        try {
          const dbBet = new Bet({
            user: bet.userId,
            type: bet.type,
            numbers: bet.numbers,
            amount: bet.amount,
            roundId: bet.roundId,
            status: isWin ? "won" : "lost",
            payout: isWin ? (bet.amount * VALID_BET_TYPES[bet.type].payout + bet.amount) : 0,
          });
          await dbBet.save();
        } catch (dbError) {
          console.error(`Error saving bet to database:`, dbError.message);
        }
      }

      // Update user balance if there are winnings
      if (totalWinAmount > 0) {
        try {
          user.realBalance += totalRealCredit;
          user.playTokens += totalTokenCredit;
          await user.save();

          // Add to winners service
          updatedWinners = await winnersService.addWinner(
            userId,
            user.name,
            totalWinAmount,
            winningBets.length > 1 ? "multiple" : winningBets[0].type
          );

          console.log(`User ${user.name} won total: ${totalWinAmount} from ${winningBets.length} bets`);
        } catch (balanceError) {
          console.error(`Error updating balance for user ${userId}:`, balanceError.message);
        }
      }

      // Notify user about results - try multiple approaches
      const updatedBalances = {
        realBalance: user.realBalance,
        playTokens: user.playTokens,
      };

      // Send individual results for each bet
      for (const bet of winningBets) {
        const resultData = {
          betId: bet.betId,
          win: true,
          payout: bet.payout,
          credited: { realBalance: bet.realCredit, playTokens: bet.tokenCredit },
          balances: updatedBalances,
          message: `Congratulations! You won ${bet.payout} on ${bet.type} bet!`,
          winningNumber,
          roundId: bet.roundId
        };

        // Try to emit to original socket first
        let emitted = safeEmitToSocket(io, bet.socketId, "betResult", resultData);
        
        // If original socket failed, try to find user by userId
        if (!emitted) {
          emitted = emitToUserById(io, userId, "betResult", resultData);
        }

        // Also broadcast to all connected sockets for this user (additional safety)
        if (!emitted) {
          console.log(`Failed to notify user ${userId} about winning bet ${bet.betId}`);
          // As a last resort, you could store the notification in database
          // or use a different notification system
        }
      }

      for (const bet of losingBets) {
        const resultData = {
          betId: bet.betId,
          win: false,
          balances: updatedBalances,
          message: `Better luck next time! Your ${bet.type} bet didn't win.`,
          winningNumber,
          roundId: bet.roundId
        };

        // Try to emit to original socket first
        let emitted = safeEmitToSocket(io, bet.socketId, "betResult", resultData);
        
        // If original socket failed, try to find user by userId
        if (!emitted) {
          emitToUserById(io, userId, "betResult", resultData);
        }
      }

    } catch (error) {
      console.error(`Error processing bets for user ${userId}:`, error.message);
    }
  }

  console.log(`Bet settlement completed. Total winners: ${Object.keys(betsByUser).filter(userId => 
    betsByUser[userId].some(bet => validateBet(bet, winningNumber))
  ).length}`);

  return updatedWinners;
}

async function placeBets(socket, data) {
  if (!data.bets || !Array.isArray(data.bets) || data.bets.length === 0) {
    throw new Error("Invalid bet data");
  }

  const validation = validateMultipleBets(data.bets);
  if (!validation.isValid) {
    throw new Error(`Invalid bet data: ${validation.errors.join(", ")}`);
  }

  const totalBetAmount = calculateTotalBetAmount(data.bets);
  const { user, realDeduction, tokenDeduction } = await validateUserBalance(
    data.userId,
    totalBetAmount
  );

  const deductedBalance = await deductUserBalance(user, realDeduction, tokenDeduction);

  // Store userId in socket for later reference
  socket.userId = data.userId;

  return {
    processedBets: processUserBets(
      data.bets,
      data.roundId,
      socket.id,
      data.userId
    ),
    totalAmount: totalBetAmount,
    userBalance: {
      realBalance: deductedBalance.realBalance,
      playTokens: deductedBalance.playTokens,
    },
  };
}

module.exports = {
  placeBets,
  settleBets,
  calculateTotalBetAmount,
};