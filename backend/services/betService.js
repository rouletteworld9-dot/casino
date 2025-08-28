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

async function settleBets(bets, winningNumber, io) {
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

  for (const bet of bets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    const isWin = validateBet(bet, winningNumber);
    let payout = 0;


    if (isWin) {
      payout = bet.amount * VALID_BET_TYPES[bet.type].payout + bet.amount;

      const realCredit = Math.round(payout * GAME_CONFIG.REAL_BALANCE_RATIO);
      const tokenCredit = Math.round(payout * GAME_CONFIG.TOKEN_BALANCE_RATIO);

      user.realBalance += realCredit;
      user.playTokens += tokenCredit;
      await user.save();

      updatedWinners = await winnersService.addWinner(
        bet.userId,
        user.name,
        payout,
        bet.type
      );

      io.to(bet.socketId).emit("betResult", {
        betId: bet.betId,
        win: true,
        payout,
        credited: { realBalance: realCredit, playTokens: tokenCredit },
        balances: {
          realBalance: user.realBalance,
          playTokens: user.playTokens,
        },
        message: `Congratulations! You won ${payout} on ${bet.type} bet!`,
      });
    } else {
      io.to(bet.socketId).emit("betResult", {
        betId: bet.betId,
        win: false,
        balances: {
          realBalance: user.realBalance,
          playTokens: user.playTokens,
        },
        message: `Better luck next time! Your ${bet.type} bet didn't win.`,
      });
    }

    // Save bet to database
    const dbBet = new Bet({
      user: bet.userId,
      type: bet.type,
      numbers: bet.numbers,
      amount: bet.amount,
      roundId: bet.roundId,
      status: isWin ? "won" : "lost",
      payout: payout,
    });
    await dbBet.save();
  }

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
