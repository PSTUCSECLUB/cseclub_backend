const nodemailer = require("nodemailer");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_gmail_email_address",
    pass: "your_gmail_password",
  },
});

// Example function for sending email
async function sendEmail(toEmail, subject, message) {
  try {
    const mailOptions = {
      from: "your_gmail_email_address",
      to: toEmail,
      subject: subject,
      text: message,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email.");
  }
}
