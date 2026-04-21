// src/routes/email.js

const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const sendEmail = require("../services/emailService");
const { verificationTemplate } = require("../utils/emailTemplates");

router.post("/send-verification", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    console.log("📩 Sending verification to:", email);

    // 🔥 IMPORTANT SETTINGS
    const actionCodeSettings = {
      url: "https://moneyflow-api-bes2.onrender.com/", 
      handleCodeInApp: false,
    };

    // 🔐 Generate link
    const link = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    console.log("🔗 Link generated:", link);

    // 🎨 HTML
    const html = verificationTemplate(link, name || "User");

    // 📩 Send email
    await sendEmail(email, "Verify Your Email - MoneyFlow 🚀", html);

    return res.json({
      success: true,
      message: "Verification email sent",
    });

  } catch (err) {
    console.error("❌ FULL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;