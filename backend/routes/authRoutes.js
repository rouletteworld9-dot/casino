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

// ✅ Forgot password (send OTP again)
router.post("/forgot-password", authController.forgotPassword);

// send otp to phone number for reset password first
router.post("/request-reset-otp", authController.requestResetOtp);

// ✅ Reset password using OTP
router.post("/reset-password", authController.resetPassword);

// Referesh Token
router.post("/refresh-token", authController.refreshToken);


module.exports = router;
