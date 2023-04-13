// Import necessary modules and models
const express = require("express");
const User = require("../models/User");

// Create a router instance
const router = express.Router();

// Define the route handler for verifying the user using a verification link
router.get("/verify/:userId/:verificationToken", async (req, res) => {
  try {
    const { userId, verificationToken } = req.params;

    // Find the user with the provided user ID and verification token
    const user = await User.findOne({ _id: userId, verificationToken });

    // If the user is not found, send an error response
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or verification token is invalid." });
    }

    // Verify the user and update the isVerified flag and verificationToken fields
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Send a success response
    res.json({ message: "User verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Export the router
module.exports = router;
