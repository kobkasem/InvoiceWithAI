let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  console.warn("nodemailer not installed. Email features will be disabled.");
  nodemailer = null;
}

// Create transporter - configure based on your email provider
// For development, you can use Gmail, SendGrid, or other SMTP services
const createTransporter = () => {
  // If nodemailer is not installed, return console logger
  if (!nodemailer) {
    return {
      sendMail: async (options) => {
        console.log("📧 Email would be sent (nodemailer not installed):");
        console.log("To:", options.to);
        console.log("Subject:", options.subject);
        console.log("\n--- Email Content ---");
        console.log(options.text || options.html);
        console.log("--- End Email ---\n");
        return { messageId: "console-log" };
      },
    };
  }
  // Option 1: Gmail (for development/testing)
  // You'll need to enable "Less secure app access" or use App Password
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }

  // Option 2: SMTP (for production - works with most email providers)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Option 3: SendGrid
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Default: Console log (for development without email setup)
  return {
    sendMail: async (options) => {
      console.log("📧 Email would be sent:");
      console.log("To:", options.to);
      console.log("Subject:", options.subject);
      console.log("Body:", options.text);
      console.log("\n--- Email Content ---");
      console.log(options.html || options.text);
      console.log("--- End Email ---\n");
      return { messageId: "console-log" };
    },
  };
};

const transporter = createTransporter();

// Send password reset email
async function sendPasswordResetEmail(email, resetToken, resetUrl) {
  const resetLink = resetUrl || `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@synnex.co.th",
    to: email,
    subject: "Password Reset Request - Synnex Invoice Extractor",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Synnex Invoice Extractor</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #1976d2;">${resetLink}</p>
            <p class="warning">⚠️ This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Synnex Invoice Extractor</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - Synnex Invoice Extractor

      Hello,

      We received a request to reset your password for your account.

      Click the following link to reset your password:
      ${resetLink}

      This link will expire in 1 hour.

      If you did not request a password reset, please ignore this email or contact support if you have concerns.

      This is an automated message. Please do not reply to this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail,
};

