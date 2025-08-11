// middleware/authMiddleware.js
const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No access token provided." });
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = verifyAccessToken(token);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired access token." });
    }

    const { userId, sessionToken, tokenVersion } = payload;

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found." });

    // check tokenVersion and sessionToken (single-login)
    if (user.tokenVersion !== tokenVersion) {
      return res.status(401).json({ message: "Token invalidated. Please login again." });
    }
    if (!user.sessionToken || user.sessionToken !== sessionToken) {
      return res.status(401).json({ message: "Session invalid. Please login again." });
    }

    // attach user to req
    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = authMiddleware;
