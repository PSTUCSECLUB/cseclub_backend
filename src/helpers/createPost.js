const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Blog = require("../models/blog");

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage for uploading images to Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Extract blog data from request body
      const { title, author, category, tags, description } = req.body;

      // Construct the blog object
      const blog = {
        title,
        author,
        category,
        tags,
        description,
      };

      // Add images to the blog object if they were uploaded
      if (req.files["thumbnail"]) {
        blog.thumbnail = req.files["thumbnail"][0].path;
      }
      if (req.files["coverImg"]) {
        blog.coverImg = req.files["coverImg"][0].path;
      }

      // Create new blog document with extracted data
      const newBlog = new Blog(blog);

      // Save new blog document to MongoDB database
      await newBlog.save();

      // Return newly created blog as JSON response
      res.json({
        success: true,
        data: newBlog,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
