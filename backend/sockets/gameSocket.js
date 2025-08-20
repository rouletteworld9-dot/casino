const {
  startGame,
  placeBet,
  forceResult,
  gameState,
} = require("../game/gameManager");

// ✅ Track if game has been initialized
let gameInitialized = false;

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // ✅ Send comprehensive current state
    socket.emit("syncState", {
      roundId: gameState.roundId,
      phase: gameState.phase,
      winningNumber: gameState.winningNumber || null,
      lastResults: gameState.lastResults,
      isGameRunning: gameState.isGameRunning,
      timestamp: Date.now(), // ✅ Add timestamp for debugging
    });

    socket.emit("lastResults", gameState.lastResults);

    socket.on("placeBet", (data) => {
      placeBet(socket, data);
    });

    socket.on("forceResult", (num) => {
      forceResult(num);
    });

    // ✅ Add ping/pong for connection health
    socket.on("ping", () => {
      socket.emit("pong", {
        serverTime: Date.now(),
        gameState: {
          roundId: gameState.roundId,
          phase: gameState.phase,
          isRunning: gameState.isGameRunning,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  // ✅ Only start game once when server initializes
  if (!gameInitialized) {
    console.log("🚀 Initializing game for the first time");
    gameInitialized = true;
    startGame(io);
  } else {
    console.log("⚠️ Game already initialized, skipping startup");
  }
};
