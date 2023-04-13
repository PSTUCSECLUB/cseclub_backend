const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/event");

router.get("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send("Invalid event ID");
    }

    // Find event by ID
    const event = await Event.findById(eventId);

    // Check if event was found
    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Return event
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
