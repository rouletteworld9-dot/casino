// utils/jwt.js

const jwt = require("jsonwebtoken");

const generateToken = (userId, sessionToken, tokenVersion) => {
  return jwt.sign(
    { userId, sessionToken, tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
