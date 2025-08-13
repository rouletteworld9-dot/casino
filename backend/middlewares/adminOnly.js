const verifyTokenAndSession = require("../utils/verifyTokenAndSession");

const adminOnly = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const user = await verifyTokenAndSession(token);
        if (!user) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        req.user = user; // store user for further use in route
        next();
    } catch (error) {
        console.error("Admin check error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = adminOnly;
