const { gameState } = require("../game/gameManager");

exports.forceResult = (req, res) => {
  const { number } = req.body;

  if (number < 0 || number > 36) {
    return res.status(400).json({ message: "Invalid number" });
  }

  gameState.nextWinningNumber = Number(number);
  res.json({ message: `Next round will result in ${number}` });
};
