// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const sendOtpWhatsApp = require("../utils/sendOtpWhatsApp");

// Helper to generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    return res.status(400).json({ message: "Phone, name, and password are required." });
  }

  try {
    let user = await User.findOne({ phone });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "Phone number already registered." });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ phone, name, password: hashedPassword });
    }

    const otp = generateOTP();

    await sendOtpWhatsApp(phone, otp);
    
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry
    await user.save();


    return res.json({ message: "OTP sent via WhatsApp." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  console.log("phone",phone, "and", otp)

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required." });
  }

  try {
    const user = await User.findOne({ phone });
     console.log("user",user)
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified) return res.status(400).json({ message: "User already verified." });

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    console.log(user.otp !== otp || user.otpExpiresAt < new Date())

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    console.log("user verified")

    return res.json({ message: "User verified successfully." });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password are required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "Invalid credentials or account disabled." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }

    // Enforce single-device login
    const newSessionToken = require("crypto").randomBytes(32).toString("hex");
    user.sessionToken = newSessionToken;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, newSessionToken, user.tokenVersion);

    return res.json({ token, user: { name: user.name, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: "User not found." });

    const otp = generateOTP();

    await sendOtpWhatsApp(phone, otp);
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    await user.save();


    return res.json({ message: "OTP sent for password reset." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.requestResetOtp = async (req, res) => {
    const { phone } = req.body;
  
    if (!phone) return res.status(400).json({ message: "Phone number is required." });
  
    try {
      const user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ message: "User not found." });
  
      const otp = generateOTP();
      const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry
  
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
  
      await sendOtpWhatsApp(phone, otp);
  
      return res.json({ message: "OTP sent to your WhatsApp." });
    } catch (err) {
      console.error("requestResetOtp error:", err);
      return res.status(500).json({ message: "Server error." });
    }
  };

exports.resetPassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ message: "Phone, OTP, and new password are required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    user.tokenVersion += 1; // invalidate existing tokens
    await user.save();

    return res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
