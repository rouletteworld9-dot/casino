// middleware/adminOnly.js
const adminOnly = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user data" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }

        next();
    } catch (error) {
        console.error("Admin check error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = adminOnly;
