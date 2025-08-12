// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Registration (phone, name, password)
router.post("/register", authController.register);

// ✅ OTP verification (after registration)
router.post("/verify-otp", authController.verifyOTP);

// ✅ Login (phone, password)
router.post("/login", authController.login);

// LogOut 
router.post("/logout", authController.logout)

// ✅ Forgot password (send OTP again)
router.post("/forgot-password", authController.forgotPassword);

// ✅ Reset password using OTP
router.post("/reset-password", authController.resetPassword);

// Referesh Token
router.post("/refresh-token", authController.refreshToken);


module.exports = router;
