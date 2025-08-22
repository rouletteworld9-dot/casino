// const mongoose = require("mongoose");

// const betSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   type: String,       // straight, split, street, corner, dozen, etc.
//   numbers: [Number],  // covered numbers
//   amount: Number,
//   roundId: String,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Bet", betSchema);

const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  roundId: { 
    type: String, 
    required: true 
  },

  type: { 
    type: String, 
    enum: [
      "straight", "split", "street", "corner", "line",
      "column", "dozen", "red", "black", "odd", "even", "low", "high"
    ],
    required: true 
  },

  numbers: {
    type: [Number],
    default: [],
    validate: {
      validator: function (nums) {
        // Inside bets must have numbers, outside may not
        if (["straight","split","street","corner","line"].includes(this.type)) {
          return nums.length > 0;
        }
        return true;
      },
      message: "Numbers required for inside bets"
    }
  },

  amount: { 
    type: Number, 
    required: true, 
    min: 1 
  },

  // Helpful for settlement
  status: { 
    type: String, 
    enum: ["pending", "won", "lost", "refunded"], 
    default: "pending" 
  },

  payout: { 
    type: Number, 
    default: 0 
  },

  socketId: { type: String },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Bet", betSchema);
