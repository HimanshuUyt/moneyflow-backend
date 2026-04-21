const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const User = require("../models/User");

// ================= VERIFY TOKEN =================
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();

  } catch (err) {
    console.error("❌ Token Error:", err.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ================= STORE USER =================
router.post("/store", verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture, firebase } = req.user;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name: name || "",
        photo: picture || "",
        provider: firebase?.sign_in_provider || "firebase",
        status: true,
      });

      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "User stored successfully",
      data: user,
    });

  } catch (err) {
    console.error("❌ STORE USER ERROR:", err);
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
    console.error("❌ GET USERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= UPDATE USER (BLOCK / UNBLOCK) =================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ================= DELETE USER =================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;