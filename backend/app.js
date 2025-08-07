const express = require("express");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Authentication 
app.use("/api/auth", authRoutes);

// ✅ Middleware for Protected Routes
app.use("/api", authMiddleware);

// Global Error Handler 
app.use((err, req, res,) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ message: "Something went wrong" });
});


module.exports = app;