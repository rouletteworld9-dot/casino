const express = require("express");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const paymentSettingRoutes = require("./routes/paymentSettingsRoutes")
const transactionRoutes = require("./routes/transactionRoutes");
const adminOnly = require("./middlewares/adminOnly");
const cookieParser = require("cookie-parser");
const adminUserRoutes = require("./routes/adminUserRoutes")
const userRoutes = require("./routes/userRoutes")


const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://casino-mu-one.vercel.app"],
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//Authentication 
app.use("/api/auth", authRoutes);

// ✅ Middleware for Protected Routes
app.use("/api", authMiddleware);

// Transaction routes
app.use("/api/paymentSettings", paymentSettingRoutes) // (Admin ONlY)
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", adminUserRoutes)
app.use("/api/user" , userRoutes)

// Global Error Handler 

// app.use((err, req, res) => {
//     console.error("Unhandled Error:", err.stack);
//     res.status(500).json({ message: "Something went wrong" });
// });


module.exports = app;