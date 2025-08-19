const User = require("../models/User");
const { validateBet, VALID_BET_TYPES } = require("./betValidator");

let gameState = {
  phase: "waiting", // betting, spinning, result
  roundId: null,
  bets: [],
  winningNumber: null,
  nextWinningNumber: null, // Admin override
};

function startGame(io) {
  gameState.roundId = Date.now().toString();
  gameState.bets = [];
  gameState.phase = "betting";

  io.emit("gameStarted", { roundId: gameState.roundId, phase: "betting" });

  // BETTING PHASE (0–15s)
  setTimeout(() => {
    gameState.phase = "spinning";
    io.emit("bettingClosed");

    // Choose winning number
    if (gameState.nextWinningNumber !== null) {
      gameState.winningNumber = gameState.nextWinningNumber;
      gameState.nextWinningNumber = null;
    } else {
      gameState.winningNumber = Math.floor(Math.random() * 37); // 0–36
    }

    io.emit("spinning", { winningNumber: gameState.winningNumber });
  }, 15000);

  // RESULT PHASE (25–30s)
  setTimeout(async () => {
    gameState.phase = "result";
    await settleBets(io);

    io.emit("roundResult", {
      winningNumber: gameState.winningNumber,
    });

    // Start next round
    setTimeout(() => startGame(io), 5000);
  }, 25000);
}

async function settleBets(io) {
  for (const bet of gameState.bets) {
    const user = await User.findById(bet.user);
    if (!user) continue;

    const isWin = validateBet(bet, gameState.winningNumber);
    if (isWin) {
      const payout = bet.amount * VALID_BET_TYPES[bet.type].payout;
      user.realBalance += payout;
      await user.save();
      io.to(bet.socketId).emit("betResult", { win: true, payout });
    } else {
      // Lose → 90% from real, 10% from playTokens
      user.realBalance -= bet.amount * 0.9;
      user.playTokens -= bet.amount * 0.1;
      if (user.realBalance < 0) user.realBalance = 0;
      if (user.playTokens < 0) user.playTokens = 0;
      await user.save();
      io.to(bet.socketId).emit("betResult", { win: false });
    }
  }
}

function placeBet(socket, data) {
  if (gameState.phase !== "betting") {
    return socket.emit("error", { message: "Betting closed" });
  }

  gameState.bets.push({
    ...data,
    socketId: socket.id,
    roundId: gameState.roundId,
  });
}

function forceResult(num) {
  gameState.nextWinningNumber = num;
}

module.exports = { startGame, placeBet, forceResult, gameState };
