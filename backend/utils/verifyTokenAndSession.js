// utils/verifyTokenAndSession.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyTokenAndSession = async (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);

        if (
            !user ||
            user.sessionToken !== payload.sessionToken ||
            user.tokenVersion !== payload.tokenVersion
        ) {
            return null;
        }

        return user;
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
        return null;
    }
};

module.exports = verifyTokenAndSession;
