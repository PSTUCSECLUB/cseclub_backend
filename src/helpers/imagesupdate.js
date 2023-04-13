const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Event = require("../models/event");
const { cloudinaryConfig } = require("../config/cloudinaryConfig");

// Set up Cloudinary configuration
cloudinary.config(cloudinaryConfig);

// Set up Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

router.patch(
  "/uploadImages/:eventId",
  upload.array("galleryImgs"),
  async (req, res) => {
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

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "event-images",
          });
          return result.secure_url;
        })
      );

      // Update event galleryImgs property with Cloudinary URLs
      event.galleryImgs = [...event.galleryImgs, ...uploadedImages];
      await event.save();

      // Return updated event
      res.json(event);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
