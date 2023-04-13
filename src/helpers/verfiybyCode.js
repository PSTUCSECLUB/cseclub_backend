const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/v1/users/verify/:verificationCode
router.post("/verify/:verificationCode", async (req, res) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOneAndUpdate(
      { verificationCode },
      { $set: { isVerified: true, verificationCode: null } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
