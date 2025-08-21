const {
  startGame,
  placeBet,
  forceResult,
  getCurrentGameState,
  initRedisGameState,
} = require("../game/gameManager");

// ✅ Track if game has been initialized globally (across all instances)
// let gameInitialized = false;

module.exports = function (io) {
  // ✅ Initialize Redis for game state when Socket.IO starts
  initRedisGameState().then((redisReady) => {
    console.log(
      `🔴 Redis game state: ${redisReady ? "Ready" : "Fallback to local"}`
    );
  });

  io.on("connection", async (socket) => {
    console.log(
      `👤 User connected: ${socket.id} to instance: ${socket.instanceId}`
    );

    // ✅ Get current game state from Redis
    const gameState = await getCurrentGameState();

    // Send comprehensive current state
    socket.emit("syncState", {
      roundId: gameState.roundId,
      phase: gameState.phase,
      winningNumber: gameState.winningNumber || null,
      lastResults: gameState.lastResults,
      isGameRunning: gameState.isGameRunning,
      instanceId: socket.instanceId,
      timestamp: Date.now(),
    });

    socket.emit("lastResults", gameState.lastResults);

    socket.on("placeBet", (data) => {
      console.log(`🎰 Bet placed on instance ${socket.instanceId}:`, data);
      placeBet(socket, data);
    });

    socket.on("forceResult", (num) => {
      console.log(`🎯 Force result on instance ${socket.instanceId}:`, num);
      forceResult(num);
    });

    // Enhanced ping/pong with current game state
    socket.on("ping", async () => {
      const currentGameState = await getCurrentGameState();
      socket.emit("pong", {
        serverTime: Date.now(),
        instanceId: socket.instanceId,
        gameState: {
          roundId: currentGameState.roundId,
          phase: currentGameState.phase,
          isRunning: currentGameState.isGameRunning,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log(
        `👋 User disconnected: ${socket.id} from instance: ${socket.instanceId}`
      );
    });
  });

  // ✅ Only start game once across ALL instances using Redis lock
  setTimeout(async () => {
    const gameState = await getCurrentGameState();

    if (!gameState.isGameRunning) {
      console.log(
        `🚀 No active game found, starting new game on instance: ${process.env.INSTANCE_ID || "unknown"}`
      );
      startGame(io);
    } else {
      console.log(
        `⚠️ Game already running on another instance (Round: ${gameState.roundId})`
      );
    }
  }, 2000); // Small delay to ensure Redis is ready
};
