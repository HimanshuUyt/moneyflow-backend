const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 🔥 FIREBASE INIT
require("./firebaseAdmin");

// ROUTES
const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");
const emailRoutes = require("./src/routes/email");

const app = express();

// ================= SECURITY MIDDLEWARE =================
app.use(cors({
  origin: "*", // ⚠️ change this in production later
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= HEALTH LOG MIDDLEWARE =================
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ================= DB CONNECT =================
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("❌ MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(mongoURI, {
      dbName: "moneyflow",
    });

    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// ================= ROUTES =================
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/email", emailRoutes);

// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 MoneyFlow API is running perfectly",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});