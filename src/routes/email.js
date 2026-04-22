const express = require("express");
const router = express.Router();

const admin = require("../../firebaseAdmin");
const sendEmail = require("../services/emailService");
const { verificationTemplate } = require("../utils/emailTemplates");


// ================= SEND VERIFICATION =================
router.post("/send-verification", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const actionCodeSettings = {
      url: "https://moneyflow-api-bes2.onrender.com/api/email/verify-email", // 🔥 IMPORTANT
      handleCodeInApp: false,
    };

    const link = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    const html = verificationTemplate(link, name || "User");

    await sendEmail(email, "Verify Your Email - MoneyFlow 🚀", html);

    return res.json({
      success: true,
      message: "Verification email sent",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ================= VERIFY EMAIL (ADD THIS HERE) =================
router.get("/verify-email", async (req, res) => {
  try {
    const { oobCode } = req.query;

    if (!oobCode) {
      return res.send("❌ Invalid verification link");
    }

    await admin.auth().applyActionCode(oobCode);

    return res.send(`
      <h2>✅ Email Verified Successfully</h2>
      <p>You can now login in the app.</p>
    `);

  } catch (err) {
    console.error(err);
    return res.send("❌ Verification failed or link expired");
  }
});

module.exports = router;