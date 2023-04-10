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

router.get("/", allBlog);
router.post("/", createBlog);
router.get("/blogId", singleBlog);
router.put("/blogId", updateBlog);
router.delete("/blogId", removeBlog);
router.patch("/uploadCover", uploadBlogCover);

router.post("/uploadThumbline", uploadBlogThumbline);

module.exports = router;
