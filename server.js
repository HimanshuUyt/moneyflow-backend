const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// 🔥 FIREBASE INIT
require("./firebaseAdmin");

// ROUTES
const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");
const emailRoutes = require("./src/routes/email"); // ✅ NEW

const app = express();

// ================= MIDDLEWARE =================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ================= DB CONNECT =================
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "moneyflow", // ✅ correct
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
app.use("/api/email", emailRoutes); // ✅ NEW ROUTE

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ================= START =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});