const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// 🔥 FIREBASE INIT
require("./firebaseAdmin");

// ROUTES
const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");
const expenseRoutes = require("./src/routes/expense");
const incomeRoutes = require("./src/routes/income");

const app = express();

/// ================= CREATE UPLOAD FOLDER =================
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log("📁 uploads folder created");
}

/// ================= SECURITY (CORS) =================
app.use(cors({
  origin: "*", // ⚠️ restrict in production
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/// ================= BODY PARSER =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/// ================= STATIC FILES =================
/// 🔥 VERY IMPORTANT (serve uploaded images)
app.use("/uploads", express.static(uploadPath));

/// ================= LOGGER =================
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

/// ================= DATABASE =================
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

/// ================= ROUTES =================
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);

/// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 MoneyFlow API running",
  });
});

/// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/// ================= GLOBAL ERROR =================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  });
});