const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,       // straight, split, street, corner, dozen, etc.
  numbers: [Number],  // covered numbers
  amount: Number,
  roundId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bet", betSchema);
