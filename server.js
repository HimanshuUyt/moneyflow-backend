const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

// ================= DB + SERVER START =================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("❌ MONGO_URL missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000, // ⏱ prevent hanging
    });

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // stop app if DB fails
  }
}

startServer();