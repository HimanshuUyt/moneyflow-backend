const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    const result = await resend.emails.send({
      from: "MoneyFlow <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", result);
  } catch (err) {
    console.error("❌ Email failed:", err);
    throw err;
  }
};

module.exports = sendEmail;