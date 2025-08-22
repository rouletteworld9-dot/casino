const User = require("../models/User");
const Bet = require("../models/Bet");
const { validateBet, VALID_BET_TYPES } = require("./betValidator");
const { createClient } = require("redis");

// ✅ Redis client for game state (separate from Socket.IO)
let redisClient = null;
const GAME_STATE_KEY = "roulette:gameState";

// ✅ Initialize Redis client for game state
async function initRedisGameState() {
  
  if (!process.env.REDIS_URL) {
    console.log(
      "⚠️ No REDIS_URL - using local memory (will have scaling issues)"
    );
    return false;
  }

  try {
    redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();
    console.log("✅ Redis game state client connected");

    // Initialize game state in Redis if not exists
    const exists = await redisClient.exists(GAME_STATE_KEY);
    if (!exists) {
      await setGameState({
        phase: "waiting",
        roundId: null,
        bets: [],
        winningNumber: null,
        nextWinningNumber: null,
        lastResults: [],
        isGameRunning: false,
      });
      console.log("🎮 Initialized fresh game state in Redis");
    }

    return true;
  } catch (error) {
    console.error("❌ Redis game state connection failed:", error);
    return false;
  }
}

// ✅ Get game state from Redis (or fallback to local)
async function getGameState() {
  if (redisClient) {
    try {
      const data = await redisClient.get(GAME_STATE_KEY);
      return data ? JSON.parse(data) : getDefaultGameState();
    } catch (error) {
      console.error("❌ Error getting game state from Redis:", error);
      return getDefaultGameState();
    }
  }

  // Fallback to local memory if no Redis
  return localGameState;
}

// ✅ Set game state in Redis (or fallback to local)
async function setGameState(newState) {
  if (redisClient) {
    try {
      await redisClient.set(GAME_STATE_KEY, JSON.stringify(newState));
      return true;
    } catch (error) {
      console.error("❌ Error setting game state in Redis:", error);
      localGameState = newState; // Fallback to local
      return false;
    }
  }

  // Fallback to local memory if no Redis
  localGameState = newState;
  return true;
}

// ✅ Default game state
function getDefaultGameState() {
  return {
    phase: "waiting",
    roundId: null,
    bets: [],
    winningNumber: null,
    nextWinningNumber: null,
    lastResults: [],
    isGameRunning: false,
  };
}

// ✅ Local fallback (for when Redis is not available)
let localGameState = getDefaultGameState();

// ✅ Timer management (still local per instance)
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

// ✅ Modified startGame function
async function startGame(io) {
  const gameState = await getGameState();

  // Prevent multiple games from different instances
  if (gameState.isGameRunning) {
    console.log(
      `⚠️ Game already running (Round: ${gameState.roundId}), skipping start`
    );
    return;
  }

  clearAllTimers();

  // Update game state
  const newGameState = {
    ...gameState,
    isGameRunning: true,
    roundId: Date.now().toString(),
    bets: [],
    phase: "betting",
  };

  await setGameState(newGameState);

  console.log(`🎮 Starting new game round: ${newGameState.roundId}`);
  io.emit("gameStarted", { roundId: newGameState.roundId, phase: "betting" });

  // BETTING PHASE (0–15s)
  gameTimers.bettingTimer = setTimeout(async () => {
    const currentState = await getGameState();

    // Double-check this instance is still managing the game
    if (currentState.roundId !== newGameState.roundId) {
      console.log("⚠️ Round ID changed, another instance took over");
      return;
    }

    const updatedState = {
      ...currentState,
      phase: "spinning",
    };
    await setGameState(updatedState);

    io.emit("bettingClosed");

    // Choose winning number
    if (currentState.nextWinningNumber !== null) {
      updatedState.winningNumber = currentState.nextWinningNumber;
      updatedState.nextWinningNumber = null;
    } else if (currentState.bets.length > 0) {
      // Find number with least bets
      const betCounts = {};
      currentState.bets.forEach((bet) => {
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
      updatedState.winningNumber = candidate;
    } else {
      updatedState.winningNumber = Math.floor(Math.random() * 37);
    }

    await setGameState(updatedState);
    io.emit("spinning", { winningNumber: updatedState.winningNumber });
  }, 15000);

  // RESULT PHASE (25–30s)
  gameTimers.resultTimer = setTimeout(async () => {
    const currentState = await getGameState();

    // Double-check this instance is still managing the game
    if (currentState.roundId !== newGameState.roundId) {
      console.log("⚠️ Round ID changed during result phase");
      return;
    }

    const updatedState = {
      ...currentState,
      phase: "result",
    };
    await setGameState(updatedState);

    await settleBets(io, currentState);

    // Update last results
    updatedState.lastResults = [
      {
        result: currentState.winningNumber,
        roundId: currentState.roundId,
      },
      ...currentState.lastResults.slice(0, 4),
    ];
    updatedState.isGameRunning = false;
    await setGameState(updatedState);

    io.emit("roundResult", {
      winningNumber: currentState.winningNumber,
      lastResults: updatedState.lastResults,
    });

    // Start next round
    gameTimers.nextRoundTimer = setTimeout(() => startGame(io), 5000);
  }, 25000);
}

// ✅ Modified settleBets function
async function settleBets(io, gameState) {
  for (const bet of gameState.bets) {
    const user = await User.findById(bet.userId);
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

    // Save bet to database
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
}

// ✅ Modified placeBet function
async function placeBet(socket, data) {
  const gameState = await getGameState();

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

  // Add bet to Redis game state
  const updatedState = {
    ...gameState,
    bets: [...gameState.bets, bet],
  };
  await setGameState(updatedState);

  socket.emit("betPlaced", {
    success: true,
    balances: {
      realBalance: user.realBalance,
      playTokens: user.playTokens,
    },
  });
}

// ✅ Modified forceResult function
async function forceResult(num) {
  const gameState = await getGameState();
  const updatedState = {
    ...gameState,
    nextWinningNumber: num,
  };
  await setGameState(updatedState);
}

// ✅ Modified stopGame function
async function stopGame() {
  clearAllTimers();
  const gameState = await getGameState();
  const updatedState = {
    ...gameState,
    isGameRunning: false,
    phase: "waiting",
  };
  await setGameState(updatedState);
}

// ✅ Export game state getter for health check
async function getCurrentGameState() {
  return await getGameState();
}

module.exports = {
  startGame,
  placeBet,
  forceResult,
  stopGame,
  getCurrentGameState,
  initRedisGameState,
};
