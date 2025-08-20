const User = require("../models/User");
const Bet = require("../models/Bet");
const { validateBet, VALID_BET_TYPES } = require("./betValidator");

let gameState = {
  phase: "waiting", // betting, spinning, result
  roundId: null,
  bets: [],
  winningNumber: null,
  nextWinningNumber: null, // Admin override
  lastResults: [], // store last 5 numbers
  isGameRunning: false, // ✅ Add flag to prevent multiple games
};

// ✅ Store timer references for cleanup
let gameTimers = {
  bettingTimer: null,
  resultTimer: null,
  nextRoundTimer: null,
};

function clearAllTimers() {
  Object.values(gameTimers).forEach((timer) => {
    if (timer) clearTimeout(timer);
  });
  gameTimers = {
    bettingTimer: null,
    resultTimer: null,
    nextRoundTimer: null,
  };
}

function startGame(io) {
  // Add to gameManager.js
  console.log(
    `🎮 Phase: ${gameState.phase}, Round: ${gameState.roundId}, Time: ${new Date().toISOString()}`
  );
  // ✅ Prevent multiple games from running
  if (gameState.isGameRunning) {
    console.log("Game already running, skipping start");
    return;
  }

  // ✅ Clear any existing timers first
  clearAllTimers();

  gameState.isGameRunning = true;
  gameState.roundId = Date.now().toString();
  gameState.bets = [];
  gameState.phase = "betting";

  console.log(`🎮 Starting new game round: ${gameState.roundId}`);
  io.emit("gameStarted", { roundId: gameState.roundId, phase: "betting" });

  // BETTING PHASE (0–15s)
  gameTimers.bettingTimer = setTimeout(() => {
    gameState.phase = "spinning";
    io.emit("bettingClosed");

    // Choose winning number
    if (gameState.nextWinningNumber !== null) {
      gameState.winningNumber = gameState.nextWinningNumber;
      gameState.nextWinningNumber = null;
    } else if (gameState.bets.length > 0) {
      // Find number with least bets
      const betCounts = {};
      gameState.bets.forEach((bet) => {
        bet.numbers.forEach((num) => {
          betCounts[num] = (betCounts[num] || 0) + bet.amount;
        });
      });

      let minCount = Infinity;
      let candidate = null;
      for (const [num, count] of Object.entries(betCounts)) {
        if (count < minCount) {
          minCount = count;
          candidate = parseInt(num, 10);
        }
      }
      gameState.winningNumber = candidate;
    } else {
      // no bets → random
      gameState.winningNumber = Math.floor(Math.random() * 37);
    }

    io.emit("spinning", { winningNumber: gameState.winningNumber });
  }, 15000);

  // RESULT PHASE (25–30s)
  gameTimers.resultTimer = setTimeout(async () => {
    gameState.phase = "result";
    await settleBets(io);

    // Push to lastResults (max length = 5)
    gameState.lastResults.unshift(gameState.winningNumber);
    if (gameState.lastResults.length > 5) {
      gameState.lastResults.pop();
    }

    io.emit("roundResult", {
      winningNumber: gameState.winningNumber,
      lastResults: gameState.lastResults,
    });

    // ✅ Reset flag before starting next round
    gameState.isGameRunning = false;

    // Start next round
    gameTimers.nextRoundTimer = setTimeout(() => startGame(io), 5000);
  }, 25000);
}

async function settleBets(io) {
  for (const bet of gameState.bets) {
    const user = await User.findById(bet.user);
    if (!user) continue;

    const isWin = validateBet(bet, gameState.winningNumber);
    let payout = 0;

    if (isWin) {
      payout = bet.amount * VALID_BET_TYPES[bet.type].payout + bet.amount;

      const realCredit = Math.round(payout * 0.9);
      const tokenCredit = Math.round(payout * 0.1);

      user.realBalance += realCredit;
      user.playTokens += tokenCredit;
      await user.save();

      io.to(bet.socketId).emit("betResult", {
        win: true,
        payout,
        credited: { realBalance: realCredit, playTokens: tokenCredit },
        balances: {
          realBalance: user.realBalance,
          playTokens: user.playTokens,
        },
      });
    } else {
      io.to(bet.socketId).emit("betResult", {
        win: false,
        balances: {
          realBalance: user.realBalance,
          playTokens: user.playTokens,
        },
      });
    }

    // ✅ Save finalized bet in DB
    const dbBet = new Bet({
      user: bet.userId,
      type: bet.type,
      numbers: bet.numbers,
      amount: bet.amount,
      roundId: bet.roundId,
      status: isWin ? "win" : "lose",
      payout: payout,
    });
    await dbBet.save();
  }

  // ✅ Clear bets after settling
  gameState.bets = [];
}

async function placeBet(socket, data) {
  if (gameState.phase !== "betting") {
    return socket.emit("error", { message: "Betting closed" });
  }

  const user = await User.findById(data.userId);
  if (!user) return;

  const betAmount = data.amount;
  const realDeduction = Math.round(betAmount * 0.9);
  const tokenDeduction = Math.round(betAmount * 0.1);

  if (user.realBalance < realDeduction || user.playTokens < tokenDeduction) {
    return socket.emit("error", { msg: "Insufficient balance" });
  }

  user.realBalance -= realDeduction;
  user.playTokens -= tokenDeduction;
  await user.save();

  const bet = {
    ...data,
    socketId: socket.id,
    roundId: gameState.roundId,
  };

  gameState.bets.push(bet);

  socket.emit("betPlaced", {
    success: true,
    balances: {
      realBalance: user.realBalance,
      playTokens: user.playTokens,
    },
  });
}

function forceResult(num) {
  gameState.nextWinningNumber = num;
}

// ✅ Add function to stop game (useful for graceful shutdown)
function stopGame() {
  clearAllTimers();
  gameState.isGameRunning = false;
  gameState.phase = "waiting";
}

module.exports = { startGame, placeBet, forceResult, gameState, stopGame };
