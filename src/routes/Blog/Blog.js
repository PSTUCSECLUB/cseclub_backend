const express = require("express");
const {
  uploadBlogThumbline,
  uploadBlogCover,
  removeBlog,
  updateBlog,
  singleBlog,
  createBlog,
  allBlog,
} = require("../../controllers/BlogController/BlogController");

const router = express.Router();

router.get("/blogs", allBlog);
router.post("/blogs", createBlog);
router.get("/blogs/blogId", singleBlog);
router.put("/blogs/blogId", updateBlog);
router.delete("/blogs/blogId", removeBlog);
router.patch("/blogs/uploadCover", uploadBlogCover);

router.post("/blogs/uploadThumbline", uploadBlogThumbline);

module.exports = router;
