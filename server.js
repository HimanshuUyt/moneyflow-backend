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

// ================= DB CONNECT FUNCTION =================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");

  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

// ================= ROUTES =================
app.use("/api/category", categoryRoutes);
app.use("/api/users", userRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 API Running");
});

// ================= START SERVER AFTER DB =================
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});