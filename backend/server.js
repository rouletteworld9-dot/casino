require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// -----------------------------
// 🟢 Connect MongoDB
// -----------------------------
connectDB();

// -----------------------------
// 🚀 Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

