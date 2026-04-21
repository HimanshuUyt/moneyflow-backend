const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config(); // ✅ IMPORTANT

const categoryRoutes = require("./src/routes/category");
const userRoutes = require("./src/routes/user");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DB CONNECTION =================
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

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

// ================= START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});