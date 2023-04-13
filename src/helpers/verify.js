const nodemailer = require("nodemailer");
const User = require("../models/User");

// Define the transport method for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send verification link to user's email
exports.sendVerificationLink = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate the verification token
    const token = user.generateVerificationToken();

    // Save the verification token to the user object
    user.verificationToken = token;
    await user.save();

    // Create the verification link
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify?token=${token}`;

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your email address",
      html: `Click this <a href="${verificationLink}">link</a> to verify your email address.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
