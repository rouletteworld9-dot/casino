const { startGame, placeBet, forceResult } = require("../game/gameManager");

module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("placeBet", (data) => {
      placeBet(socket, data);
    });

    socket.on("forceResult", (num) => {
      // Admin check should be added
      forceResult(num);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  // Start the first game automatically
  startGame(io);
};
