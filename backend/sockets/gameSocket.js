const gameManager = require("../game/gameManager");
const socketHandlers = require("./socketHandlers");

module.exports = function (io) {
  // Initialize game state on startup
  gameManager.initGameState().then((redisReady) => {
    console.log(`Game state: ${redisReady ? "Redis Ready" : "Local Fallback"}`);
  });

  io.on("connection", async (socket) => {
    await socketHandlers.handleConnection(socket, io);
    // Socket event handlers
    socket.on("placeBets", (data) =>
      socketHandlers.handlePlaceBets(socket, data)
    );
    socket.on("placeBet", (data) =>
      socketHandlers.handlePlaceBet(socket, data)
    );
    socket.on("forceResult", (data) =>
      socketHandlers.handleForceResult(socket, data)
    );
    socket.on("ping", () => socketHandlers.handlePing(socket));
    socket.on("requestGameState", () =>
      socketHandlers.handleRequestGameState(socket)
    );
    socket.on("requestRecentWinners", () =>
      socketHandlers.handleRequestRecentWinners(socket)
    );
    socket.on("requestLastResults", () =>
      socketHandlers.handleRequestLastResults(socket)
    );
    socket.on("disconnect", (reason) =>
      socketHandlers.handleDisconnect(socket, reason)
    );
  });

  // Start game after initialization delay
  setTimeout(async () => {
    try {
      const gameState = await gameManager.getCurrentGameState();

      if (!gameState.isGameRunning) {
        const started = await gameManager.startGame(io);
        if (started) {
          console.log("Game started successfully");
        }
      }
    } catch (error) {
      console.error("Game initialization error:", error.message);
    }
  }, 2000);

  // Graceful shutdown
  const shutdown = async () => {
    try {
      await gameManager.stopGame();
      process.exit(0);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      process.exit(1);
    }
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};
