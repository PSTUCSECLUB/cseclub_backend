const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Blog = require("../models/blog");

// configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// configure Cloudinary
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

// PATCH /api/v1/blogs/uploadThumbline/:blogId
router.patch(
  "/uploadThumbline/:blogId",
  upload.single("thumbline"),
  async (req, res, next) => {
    try {
      // find the blog by ID
      const blog = await Blog.findById(req.params.blogId);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      // upload the thumbline image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "blog-thumblines", // specify the Cloudinary folder
        format: "jpg", // specify the image format
        transformation: [
          { width: 400, height: 300, crop: "fill" }, // specify the image size and crop method
        ],
      });

      // update the blog's thumbline property with the Cloudinary URL
      blog.thumbline = result.secure_url;
      await blog.save();

      res.json(blog);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
