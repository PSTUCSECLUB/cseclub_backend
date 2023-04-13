const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/user");

// Endpoint for sending a verification code to the user's email
router.post("/sendVerificationCode", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user with given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is ${verificationCode}`,
    };

    // Send email with verification code
    await transporter.sendMail(mailOptions);

    // Save verification code in the database
    user.verificationCode = verificationCode;
    await user.save();

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
