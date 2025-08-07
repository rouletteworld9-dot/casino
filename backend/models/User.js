
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    otp: String,
    otpExpiresAt: Date,
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    sessionToken: String, // single-device login
    tokenVersion: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "banned", "deleted"], default: "active" },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
