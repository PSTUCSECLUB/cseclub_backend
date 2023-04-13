const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Event = require("../models/event");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer and Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-images",
    format: async (req, file) => "png", // Set image format to PNG
    public_id: (req, file) => `event-${Date.now()}-${file.originalname}`, // Set public ID to a unique value
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.array("images"), async (req, res) => {
  try {
    // Extract event data from request body
    const {
      title,
      subTitle,
      organizers,
      participants,
      startDate,
      endDate,
      duration,
      galleryTitle,
      description,
    } = req.body;

    // Upload images to Cloudinary and get their URLs
    const imageUrls = [];
    for (let i = 0; i < req.files.length; i++) {
      imageUrls.push(req.files[i].path);
    }

    // Create new event document
    const event = new Event({
      title,
      subTitle,
      organizers,
      participants,
      coverImg: imageUrls[0], // Use the first image as the cover image
      thumbnail: imageUrls[0], // Use the first image as the thumbnail
      galleryTitle,
      galleryImgs: imageUrls,
      startDate,
      endDate,
      duration,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save event to database
    const result = await event.save();

    // Return result
    res.status(201).json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
