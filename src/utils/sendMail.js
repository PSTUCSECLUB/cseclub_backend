const { transporter } = require("../config/nodemailer");
const { mailTemplate } = require("../helpers/mailgen");
const dotenv = require("dotenv").config();
exports.sendEmail = async ({ email, subject, name, verifyCode }) => {
  try {
    const mail = mailTemplate(name, verifyCode);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: mail,
    };

    const result = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
