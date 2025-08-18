// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
} = require("../utils/jwt");
const sendOtpWhatsApp = require("../utils/sendOtpWhatsApp");
const { setRefreshTokenCookie, hashToken } = require("../utils/authHelpers");
const cryptoModule = require("crypto");

// Helper to generate random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
  const { phone, name, password } = req.body;

  if (!phone || !name || !password) {
    return res
      .status(400)
      .json({ message: "Phone, name, and password are required." });
  }

  try {
    let user = await User.findOne({ phone });

    if (user) {
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "Phone number already registered." });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        phone,
        name,
        password: hashedPassword,
        playTokens: 1500,
      });
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

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required." });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified." });

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    console.log(user.otp !== otp || user.otpExpiresAt < new Date());

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    console.log("user verified");

    return res.json({ message: "User verified successfully." });
  } catch (err) {
    console.error("OTP verify error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// exports.login = async (req, res) => {
//   const { phone, password } = req.body;

//   if (!phone || !password) {
//     return res.status(400).json({ message: "Phone and password are required." });
//   }

//   try {
//     const user = await User.findOne({ phone });

//     if (!user || user.status !== "active") {
//       return res.status(401).json({ message: "Invalid credentials or account disabled." });
//     }

//     if (!user.isVerified) {
//       return res.status(403).json({ message: "Account not verified." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid phone or password." });
//     }

//     // Enforce single-device login
//     const newSessionToken = require("crypto").randomBytes(32).toString("hex");
//     user.sessionToken = newSessionToken;
//     user.lastLogin = new Date();
//     await user.save();

//     const token = generateToken(user._id, newSessionToken, user.tokenVersion);

//     return res.json({ token, user: { name: user.name, phone: user.phone, role: user.role } });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

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

  if (!phone)
    return res.status(400).json({ message: "Phone number is required." });

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
    return res
      .status(400)
      .json({ message: "Phone, OTP, and new password are required." });
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

// UPDATED login to issue access + refresh tokens and enforce single-session
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json({ message: "Phone and password are required." });
  }

  try {
    const user = await User.findOne({ phone });

    if (!user || user.status !== "active") {
      return res
        .status(401)
        .json({ message: "Invalid credentials or account disabled." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Account not verified." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid phone or password." });
    }

    // Enforce single-device login:
    // create a new session token (random), store it on user
    const newSessionToken = cryptoModule.randomBytes(32).toString("hex");
    user.sessionToken = newSessionToken;
    user.lastLogin = new Date();

    // Create Refresh token (a JWT) and store its hash in DB
    const refreshPayload = {
      userId: user._id.toString(),
      sessionToken: newSessionToken,
      tokenVersion: user.tokenVersion,
    };
    const refreshToken = signRefreshToken(refreshPayload);
    const refreshHash = hashToken(refreshToken);

    // Save hashed refresh token to DB (this invalidates previous refresh tokens)
    user.refreshTokenHash = refreshHash;

    await user.save();

    // Create access token (short lived)
    const accessPayload = {
      userId: user._id.toString(),
      sessionToken: newSessionToken,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = signAccessToken(accessPayload);

    // Set refresh token in httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      token: accessToken,
      user: { name: user.name, phone: user.phone, role: user.role , _id:user._id },
      expiresIn: 30 * 60, // seconds, client can use to know expiry (30 minutes)
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Refresh token endpoint: reads cookie, validates, rotates refresh token and issues new access token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided." });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      console.error("Invalid refresh token:", err);
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const { userId, sessionToken, tokenVersion } = payload;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // check tokenVersion
    if (user.tokenVersion !== tokenVersion) {
      return res
        .status(401)
        .json({ message: "Token invalidated. Please login again." });
    }

    // check sessionToken matches current session (enforce single-login)
    if (!user.sessionToken || user.sessionToken !== sessionToken) {
      return res
        .status(401)
        .json({ message: "Session invalid. Please login again." });
    }

    // check stored hashed refresh token matches the provided one
    const incomingHash = hashToken(token);
    if (!user.refreshTokenHash || user.refreshTokenHash !== incomingHash) {
      return res
        .status(401)
        .json({ message: "Refresh token mismatch. Please login again." });
    }

    // All good -> rotate refresh token (issue new refresh token) and issue new access token
    const newSessionToken = user.sessionToken; // keep same session token for now (or generate a new one if desired)
    // If you want to rotate sessionToken every refresh, generate a new one and update user.sessionToken

    const newRefreshPayload = {
      userId: user._id.toString(),
      sessionToken: newSessionToken,
      tokenVersion: user.tokenVersion,
    };
    const newRefreshToken = signRefreshToken(newRefreshPayload);
    const newRefreshHash = hashToken(newRefreshToken);

    // Save new refresh hash to DB (rotates and invalidates previous refresh token)
    user.refreshTokenHash = newRefreshHash;
    await user.save();

    // Issue new access token
    const accessPayload = {
      userId: user._id.toString(),
      sessionToken: newSessionToken,
      tokenVersion: user.tokenVersion,
    };
    const newAccessToken = signAccessToken(accessPayload);

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    return res.json({
      token: newAccessToken,
      user: {
        name: user.name,
        phone: user.phone,
        role: user.role,
        _id: user._id,
      },
      expiresIn: 30 * 60,
    });
  } catch (err) {
    console.error("refreshToken error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Logout endpoint: clears cookie and removes stored refresh token and sessionToken to force re-login
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      // try to decode to find user, but either way we will clear cookie
      try {
        const payload = verifyRefreshToken(token);
        const user = await User.findById(payload.userId);
        if (user) {
          user.refreshTokenHash = null;
          user.sessionToken = null;
          await user.save();
        }
      } catch (e) {
        // ignore decode errors
        console.log(e);
      }
    }

    // clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({ message: "Logged out." });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
