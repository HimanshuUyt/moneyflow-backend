// src/routes/email.js

const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const sendEmail = require("../services/emailService");
const { verificationTemplate } = require("../utils/emailTemplates");

/// ===============================
/// 🔥 SEND VERIFICATION EMAIL
/// ===============================
router.post("/send-verification", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔐 GENERATE FIREBASE VERIFICATION LINK
    const link = await admin
      .auth()
      .generateEmailVerificationLink(email);

    // 🎨 GET HTML TEMPLATE
    const html = verificationTemplate(link, name);

    // 📩 SEND EMAIL
    await sendEmail(
      email,
      "Verify Your Email - MoneyFlow 🚀",
      html
    );

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
    });

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;