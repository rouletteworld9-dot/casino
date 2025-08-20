require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const gameSocket = require("./sockets/gameSocket");
const { stopGame } = require("./game/gameManager");

const INSTANCE_ID = `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

connectDB();
// Attach socket game logic
gameSocket(io);

process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  stopGame();
  server.close();
});

app.get("/health", (req, res) => {
  res.json({
    instanceId: INSTANCE_ID,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    gameState: require("./game/gameManager").gameState.roundId,
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
