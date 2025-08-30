const gameManager = require("../game/gameManager");
const { validateMultipleBets } = require("../game/betValidator");

async function handleConnection(socket) {
  try {
    const gameState = await gameManager.getCurrentGameState();

    socket.emit("syncState", {
      roundId: gameState.roundId,
      phase: gameState.phase,
      winningNumber: gameState.winningNumber || null,
      lastResults: gameState.lastResults || [],
      recentWinners: gameState.recentWinners || [],
      isGameRunning: gameState.isGameRunning,
      timestamp: Date.now(),
      roundEndTime: gameState.roundEndTime,
    });

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("error", { message: "Failed to sync game state" });
  }
}

async function handlePlaceBets(socket, data) {

  try {
    if (!data?.userId || !data?.bets) {
      return socket.emit("error", { message: "Invalid request data" });
    }

    const validation = validateMultipleBets(data.bets);
    if (!validation.isValid) {
      console.log("invalid", validation.errors);
      return socket.emit("error", {
        message: "Invalid bet data",
        errors: validation.errors,
      });
    }

    const result = await gameManager.placeBets(socket, data);
    socket.emit("betsPlaced", {
      success: true,
      betsCount: data.bets.length,
      totalAmount: result.totalAmount,
      balances: result.userBalance,
      message: `${data.bets.length} bet(s) placed successfully`,
    });
  } catch (error) {
    socket.emit("error", { message: error.message });
  }
}

async function handlePlaceBet(socket, data) {
  try {
    if (!data?.userId) {
      return socket.emit("error", { message: "User ID is required" });
    }

    const singleBet = {
      type: data.type,
      numbers: data.numbers,
      amount: data.amount,
    };

    const multipleBetsData = {
      userId: data.userId,
      bets: [singleBet],
    };

    await handlePlaceBets(socket, multipleBetsData);
  } catch (error) {
    socket.emit("error", { message: error.message });
  }
}

async function handleForceResult(socket, data) {
  try {
    let number;

    if (typeof data === "number") {
      number = data;
    } else if (typeof data === "string") {
      number = parseInt(data, 10);
    } else if (data?.number !== undefined) {
      number = parseInt(data.number, 10);
    } else {
      return socket.emit("error", { message: "Invalid number format" });
    }

    if (isNaN(number) || number < 0 || number > 36) {
      return socket.emit("error", {
        message: "Number must be between 0 and 36",
      });
    }

    await gameManager.forceResult(number);
    socket.emit("forceResultSet", {
      number,
      message: `Next winning number set to ${number}`,
    });

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("error", { message: "Failed to set forced result" });
  }
}

async function handlePing(socket) {
  try {
    const currentGameState = await gameManager.getCurrentGameState();

    socket.emit("pong", {
      serverTime: Date.now(),
      gameState: {
        roundId: currentGameState.roundId,
        phase: currentGameState.phase,
        isRunning: currentGameState.isGameRunning,
        winningNumber:
          currentGameState.phase === "result"
            ? currentGameState.winningNumber
            : null,
      },
    });

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("pong", {
      serverTime: Date.now(),
      error: "Failed to get game state",
    });
  }
}

async function handleRequestGameState(socket) {
  try {
    const gameState = await gameManager.getCurrentGameState();

    socket.emit("gameStateUpdate", {
      roundId: gameState.roundId,
      phase: gameState.phase,
      winningNumber: gameState.winningNumber,
      lastResults: gameState.lastResults || [],
      recentWinners: gameState.recentWinners || [],
      isGameRunning: gameState.isGameRunning,
      timestamp: Date.now(),
    });

    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("error", { message: "Failed to get game state" });
  }
}

async function handleRequestRecentWinners(socket) {
  try {
    const gameState = await gameManager.getCurrentGameState();
    socket.emit("recentWinners", gameState.recentWinners || []);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("recentWinners", []);
  }
}

async function handleRequestLastResults(socket) {
  try {
    const gameState = await gameManager.getCurrentGameState();
    socket.emit("lastResults", gameState.lastResults || []);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    socket.emit("lastResults", []);
  }
}

function handleDisconnect() {
  // Minimal logging for disconnect
}

module.exports = {
  handleConnection,
  handlePlaceBets,
  handlePlaceBet,
  handleForceResult,
  handlePing,
  handleRequestGameState,
  handleRequestRecentWinners,
  handleRequestLastResults,
  handleDisconnect,
};
