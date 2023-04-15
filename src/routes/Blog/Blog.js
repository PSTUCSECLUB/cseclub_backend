const express = require("express");
const {
  updateBlogThumbline,
  updateBlogCover,
  removeBlog,
  updateBlog,
  singleBlog,
  createBlog,
  allBlog,
} = require("../../controllers/BlogController/BlogController");
const { isAuthenticatedUser } = require("../../middleware/verifyAuth");
const multer = require("multer");
const { blogStorage } = require("../../config/cloudinary");
const parser = multer({ storage: blogStorage });

const router = express.Router();

router.get("/", allBlog);
router.post(
  "/",
  isAuthenticatedUser,
  parser.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createBlog
);
router.get("/:blogId", singleBlog);
router.put("/:blogId", isAuthenticatedUser, updateBlog);
router.delete("/:blogId", isAuthenticatedUser, removeBlog);
router.patch(
  "/uploadCover/:blogId",
  isAuthenticatedUser,
  parser.fields([{ name: "coverImg", maxCount: 1 }]),
  updateBlogCover
);

router.patch(
  "/uploadThumbline/:blogId",
  isAuthenticatedUser,
  parser.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateBlogThumbline
);

module.exports = router;
