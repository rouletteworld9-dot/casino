require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const gameSocket = require("./sockets/gameSocket");

const INSTANCE_ID = `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const server = http.createServer(app);

async function createSocketIOServer() {
  let io;

  if (process.env.REDIS_URL) {
    try {
      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);

      io = new Server(server, {
        cors: { origin: "*" },
        adapter: createAdapter(pubClient, subClient),
      });

      console.log("✅ Redis adapter connected");

      pubClient.on("error", (err) => console.error("Redis Pub Error:", err));
      subClient.on("error", (err) => console.error("Redis Sub Error:", err));
    } catch (error) {
      console.error("❌ Redis connection failed:", error.message);
      io = new Server(server, { cors: { origin: "*" } });
    }
  } else {
    console.log("⚠️ No REDIS_URL - using single instance");
    io = new Server(server, { cors: { origin: "*" } });
  }

  return io;
}

async function startServer() {
  console.log(`🚀 Starting server: ${INSTANCE_ID}`);

  await connectDB();
  const io = await createSocketIOServer();

  io.use((socket, next) => {
    socket.instanceId = INSTANCE_ID;
    next();
  });

  gameSocket(io);

  app.get("/health", async (req, res) => {
    const uptime = process.uptime();

    try {
      const { getCurrentGameState } = require("./game/gameManager");
      const gameState = await getCurrentGameState();

      res.json({
        instanceId: INSTANCE_ID,
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        timestamp: new Date().toISOString(),
        gameState: {
          roundId: gameState.roundId,
          phase: gameState.phase,
          isRunning: gameState.isGameRunning,
          betsCount: gameState.bets?.length || 0,
          lastResultsCount: gameState.lastResults?.length || 0,
          recentWinnersCount: gameState.recentWinners?.length || 0,
        },
        connectedSockets: io.engine.clientsCount,
        redis: {
          configured: !!process.env.REDIS_URL,
          status: process.env.REDIS_URL ? "Connected" : "Not configured",
        },
      });
    } catch (error) {
      res.status(500).json({
        instanceId: INSTANCE_ID,
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        error: error.message,
        redis: {
          configured: !!process.env.REDIS_URL,
          status: "Error getting game state",
        },
      });
    }
  });

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/health`);
  });
}

const shutdown = async () => {
  console.log(`🛑 Shutting down: ${INSTANCE_ID}`);

  try {
    const { stopGame } = require("./game/gameManager");
    await stopGame();
  } catch (error) {
    console.log("⚠️ Game cleanup error:", error.message);
  }

  server.close(() => {
    console.log(`✅ Server shut down gracefully`);
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

startServer().catch((error) => {
  console.error("💥 Server startup failed:", error.message);
  process.exit(1);
});
