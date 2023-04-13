// Import required packages and models
const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const cloudinary = require("cloudinary").v2;

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define route handler for PATCH request to '/api/v1/blogs/uploadCover/:blogId'
router.patch("/uploadCover/:blogId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Upload cover image to cloudinary
    const result = await cloudinary.uploader.upload(req.body.coverImg, {
      folder: "blogCovers/",
    });
    blog.coverImg = result.secure_url;
    await blog.save();

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Export router
module.exports = router;
