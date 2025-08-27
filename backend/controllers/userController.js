const Bet = require("../models/Bet");
const User = require("../models/User");

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserBetsHistory = async (req, res) => {
  try {
    const {id} = req.params;

    const Bets = await Bet.find({user : id})

    if (!Bets) {
      return res.status(404).json({ message: "No bets Found" });
    }

    res.status(200).json(Bets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}