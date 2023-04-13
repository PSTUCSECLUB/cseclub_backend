const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../models/event");

router.delete("/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).send("Invalid event ID");
    }

    // Find event by ID and remove it
    const deletedEvent = await Event.findByIdAndRemove(eventId);

    // Check if event was found and deleted
    if (!deletedEvent) {
      return res.status(404).send("Event not found");
    }

    // Return deleted event
    res.json(deletedEvent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
