const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const User = require("../models/User");

// ================= VERIFY TOKEN =================
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token Error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// ================= STORE USER =================
router.post("/store", verifyToken, async (req, res) => {
  try {
    const firebaseUser = req.user;

    let user = await User.findOne({ uid: firebaseUser.uid });

    if (!user) {
      user = new User({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || req.body.name || "",
        photo: firebaseUser.picture || req.body.photo || "",
        provider: firebaseUser.firebase?.sign_in_provider || "firebase",
      });

      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "User stored successfully",
      data: user,
    });

  } catch (err) {
    console.error("❌ STORE ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= GET USERS =================
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: users,
    });

  } catch (err) {
    console.error("❌ GET USERS ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= BLOCK / UNBLOCK USER =================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 UPDATE FIREBASE (VERY IMPORTANT)
    await admin.auth().updateUser(user.uid, {
      disabled: !status, // true = blocked
    });

    // 🔥 UPDATE MONGODB
    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: status ? "User activated" : "User blocked",
      data: user,
    });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 DELETE FROM FIREBASE FIRST
    await admin.auth().deleteUser(user.uid);

    // 🔥 DELETE FROM MONGODB
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;