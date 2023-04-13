// api/v1/users.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");

// PATCH api/v1/users/updateProfile
router.patch("/updateProfile", async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "username",
      "email",
      "avatar",
      "regi",
      "fId",
      "session",
      "isAlumni",
      "socialLinks",
      "currentJob",
      "currentCompany",
      "description",
    ];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
