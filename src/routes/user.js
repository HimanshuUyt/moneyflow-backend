const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const User = require("../models/User");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../cloudinary");

/// ================= CLOUDINARY STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "moneyflow_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

/// ================= VERIFY TOKEN =================
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

/// ================= STORE USER =================
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

/// ================= GET CURRENT USER =================
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

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
    console.error("❌ GET ME ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/// ================= UPDATE PROFILE =================
router.put(
  "/update",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const uid = req.user.uid;

      let updateData = {
        name,
        email,
        phone,
      };

      /// 📸 CLOUDINARY IMAGE
      if (req.file) {
        updateData.photo = req.file.path; // 🔥 Cloudinary URL
      }

      const user = await User.findOneAndUpdate(
        { uid },
        updateData,
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
        message: "Profile updated successfully",
        data: user,
      });

    } catch (err) {
      console.error("❌ UPDATE PROFILE ERROR:", err.message);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/// ================= GET ALL USERS =================
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

/// ================= BLOCK / UNBLOCK USER =================
router.put("/status/:id", async (req, res) => {
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

    await admin.auth().updateUser(user.uid, {
      disabled: !status,
    });

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message: status ? "User activated" : "User blocked",
      data: user,
    });

  } catch (err) {
    console.error("❌ STATUS ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/// ================= DELETE USER =================
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

    await admin.auth().deleteUser(user.uid);
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