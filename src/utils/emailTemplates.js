// src/utils/emailTemplates.js

const verificationTemplate = (link, name) => {
  return `
  <div style="background:#f5f6fa;padding:30px;font-family:sans-serif;">
    <div style="max-width:500px;margin:auto;background:#fff;border-radius:10px;overflow:hidden">

      <!-- HEADER -->
      <div style="background:#4A6CF7;padding:20px;text-align:center;">
        <h2 style="color:#fff;margin:0;">MoneyFlow</h2>
      </div>

      <!-- BODY -->
      <div style="padding:30px;color:#333;">
        <h2>Verify Your Email</h2>

        <p>Hi ${name || "User"} 👋,</p>

        <p>Welcome to <b>MoneyFlow</b>! You're one step away from getting started.</p>

        <p style="text-align:center;margin:30px 0;">
          <a href="${link}" 
             style="background:#4A6CF7;color:#fff;padding:12px 25px;
             text-decoration:none;border-radius:6px;font-weight:bold;">
             Verify Email
          </a>
        </p>

        <p>If the button doesn't work, click here:</p>
        <a href="${link}">${link}</a>

        <p style="margin-top:30px;">
          Thanks,<br/>
          <strong>MoneyFlow Team</strong>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f1f3f6;padding:15px;text-align:center;font-size:12px;color:#777;">
        © ${new Date().getFullYear()} MoneyFlow. All rights reserved.
      </div>

    </div>
  </div>
  `;
};

module.exports = {
  verificationTemplate,
};