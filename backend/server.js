require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

// ✅ NEW: Redis imports for Socket.IO scaling
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const gameSocket = require("./sockets/gameSocket");

// Generate unique instance ID for debugging
const INSTANCE_ID = `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const server = http.createServer(app);

// ✅ NEW: Setup Socket.IO with Redis (if available)
async function createSocketIOServer() {
  let io;

  // If Redis URL is provided, use Redis adapter
  if (process.env.REDIS_URL) {
    console.log("🔴 Setting up Socket.IO with Redis adapter for scaling...");

    try {
      // Create Redis clients
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      // Connect both clients
      await Promise.all([pubClient.connect(), subClient.connect()]);

      // Create Socket.IO server with Redis adapter
      io = new Server(server, {
        cors: { origin: "*" },
        adapter: createAdapter(pubClient, subClient), // ✅ This syncs all instances
      });

      console.log(
        "✅ Redis adapter connected - Multiple instances will now sync!"
      );

      // Handle Redis connection errors
      pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
      subClient.on("error", (err) => console.error("Redis Sub Error:", err));
    } catch (error) {
      console.error("❌ Redis connection failed:", error);
      console.log(
        "🔄 Falling back to single instance mode (will have scaling issues)"
      );

      // Fallback to regular Socket.IO
      io = new Server(server, { cors: { origin: "*" } });
    }
  } else {
    console.log(
      "⚠️ No REDIS_URL found - using single instance (will have scaling issues on Render)"
    );
    io = new Server(server, { cors: { origin: "*" } });
  }

  return io;
}

// ✅ Main startup function
async function startServer() {
  console.log(`🚀 Starting server instance: ${INSTANCE_ID}`);

  // Connect to database
  await connectDB();

  // Setup Socket.IO (with or without Redis)
  const io = await createSocketIOServer();

  // Add instance ID to all socket connections
  io.use((socket, next) => {
    socket.instanceId = INSTANCE_ID;
    next();
  });

  // Attach your existing game logic
  gameSocket(io);

  // ✅ Health check endpoint with Redis game state
  app.get("/health", async (req, res) => {
    const uptime = process.uptime();

    try {
      const { getCurrentGameState } = require("./game/gameManager");
      const gameState = await getCurrentGameState();

      res.json({
        instanceId: INSTANCE_ID,
        uptime: uptime,
        uptimeFormatted: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        timestamp: new Date().toISOString(),
        gameState: gameState.roundId,
        gamePhase: gameState.phase,
        isGameRunning: gameState.isGameRunning,
        connectedSockets: io.engine.clientsCount,
        hasRedis: !!process.env.REDIS_URL,
        redisStatus: process.env.REDIS_URL ? "Connected" : "Not configured",
        betsCount: gameState.bets ? gameState.bets.length : 0,
      });
    } catch (error) {
      res.json({
        instanceId: INSTANCE_ID,
        uptime: uptime,
        error: error.message,
        hasRedis: !!process.env.REDIS_URL,
        redisStatus: "Error getting game state",
      });
    }
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Server ${INSTANCE_ID} running on port ${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    console.log(
      `🔴 Redis Adapter: ${process.env.REDIS_URL ? "✅ ENABLED" : "❌ DISABLED"}`
    );
  });
}

// Start the server
startServer().catch((error) => {
  console.error("💥 Server startup failed:", error);
  process.exit(1);
});

// ✅ Graceful shutdown
const shutdown = () => {
  console.log(`🛑 Shutting down server instance: ${INSTANCE_ID}`);
  try {
    const { stopGame } = require("./game/gameManager");
    stopGame();
  } catch (error) {
    console.log("⚠️ Error during game cleanup:", error.message);
  }

  server.close(() => {
    console.log(`✅ Server ${INSTANCE_ID} shut down gracefully`);
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
