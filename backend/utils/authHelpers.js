// utils/authHelpers.js
const cryptoModule = require("crypto");

// store hashed token in DB
function hashToken(token) {
  return cryptoModule.createHash("sha256").update(token).digest("hex");
}

function setRefreshTokenCookie(res, token) {
  const cookieOptions = {
    httpOnly: true,
    // secure true in production when using https
    secure: true,
    sameSite: "Strict", // adjust if needed for cross-site use
    // cookie expiry in ms — set to 30 days by default (match REFRESH_TOKEN_EXPIRES)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };
  res.cookie("refreshToken", token, cookieOptions);
}

module.exports = { hashToken, setRefreshTokenCookie };
