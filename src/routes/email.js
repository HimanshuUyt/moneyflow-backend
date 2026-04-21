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

    console.log("📩 API HIT:", email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    /// ===============================
    /// 🔐 GENERATE FIREBASE LINK (IMPROVED)
    /// ===============================
    const actionCodeSettings = {
      url: "https://moneyflow-api-bes2.onrender.com/verified", // 🔥 change to your frontend if needed
      handleCodeInApp: false,
    };

    const link = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    console.log("🔗 VERIFY LINK:", link);

    /// ===============================
    /// 🎨 TEMPLATE
    /// ===============================
    const html = verificationTemplate(link, name || "User");

    /// ===============================
    /// 📩 SEND EMAIL
    /// ===============================
    console.log("📨 Sending email to:", email);

    await sendEmail(
      email,
      "Verify Your Email - MoneyFlow 🚀",
      html
    );

    console.log("✅ Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "Verification email sent",
    });

  } catch (err) {
    console.error("❌ EMAIL ERROR FULL:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Email failed",
    });
  }
});

module.exports = router;