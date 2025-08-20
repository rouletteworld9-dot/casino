const {
  startGame,
  placeBet,
  forceResult,
  gameState,
} = require("../game/gameManager");

let gameStarted = false;

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Send current state and last results right away
    socket.emit("syncState", {
      roundId: gameState.roundId,
      phase: gameState.phase,
      winningNumber: gameState.winningNumber || null,
      lastResults: gameState.lastResults,
    });

    socket.emit("lastResults", gameState.lastResults);

    socket.on("placeBet", (data) => {
      placeBet(socket, data);
    });

    socket.on("forceResult", (num) => {
      forceResult(num);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  // Start the first game only once
  if (!gameStarted) {
    gameStarted = true;
    startGame(io);
  }
};
