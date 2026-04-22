const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 🔥 FIREBASE INIT
require("./firebaseAdmin");

// ROUTES
const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");

const app = express();

// ================= SECURITY MIDDLEWARE =================
app.use(cors({
  origin: "*", // ⚠️ restrict in production
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= REQUEST LOG =================
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ================= DB CONNECT =================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("❌ MONGO_URI is missing");
    }

    await mongoose.connect(mongoURI, {
      dbName: "moneyflow",
    });

    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

// ================= ROUTES =================
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 MoneyFlow API running",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================= START =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});