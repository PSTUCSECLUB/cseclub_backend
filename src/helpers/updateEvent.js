const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/event");

router.put("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send("Invalid event ID");
    }

    // Find event by ID and update it
    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
    });

    // Check if event was found and updated
    if (!updatedEvent) {
      return res.status(404).send("Event not found");
    }

    // Return updated event
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
