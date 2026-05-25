const nodemailer = require("nodemailer");

const sendInvite = async ({ to, name, inviteLink }) => {
 const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false  // ← fixes SSL certificate error
    }
  });

  await transporter.sendMail({
    from: `"FlowTask" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're invited to FlowTask!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px;">
        <h2 style="color: #1f2937;">You're invited to FlowTask! 👋</h2>
        <p style="color: #6b7280;">Hi <strong>${name}</strong>, you've been added to the FlowTask workspace.</p>
        <p style="color: #6b7280;">Click the button below to set your password and get started:</p>
        
        <a href="${inviteLink}" style="display: inline-block; margin-top: 16px; padding: 14px 28px; background: #b7791f; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Set My Password
        </a>

        <p style="margin-top: 24px; color: #9ca3af; font-size: 12px;">This link expires in 24 hours. If you didn't expect this, ignore it.</p>
      </div>
    `,
  });
};

module.exports = sendInvite;