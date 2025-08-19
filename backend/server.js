require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const gameSocket = require("./sockets/gameSocket");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://casino-mu-one.vercel.app"],
    methods: ["GET", "POST"],
  },
});

connectDB();
// Attach socket game logic
gameSocket(io);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
