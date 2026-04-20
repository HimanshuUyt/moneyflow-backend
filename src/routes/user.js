const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const User = require("../models/User");

// 🔐 VERIFY TOKEN MIDDLEWARE
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// 🔥 STORE USER
router.post("/person/store", verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture, firebase } = req.user;

    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({
        uid,
        email,
        name: name || "",
        photo: picture || "",
        provider: firebase.sign_in_provider,
      });

      await user.save();
    }

    res.json({
      success: true,
      message: "User stored",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 GET USERS (FOR ADMIN)
router.get("/person/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;