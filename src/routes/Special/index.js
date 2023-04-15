const express = require("express");
const { postImages, listImages } = require("../../controllers/Special");
const router = express.Router();
const multer = require("multer");
const { specialStorage } = require("../../config/cloudinary");
const parser = multer({ storage: specialStorage });

const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");

router.post(
  "/uploadImgs",
  isAuthenticatedUser,
  verifyAdmin,
  parser.fields([{ name: "images", maxCount: 7 }]),
  postImages
);

router.get("/listImgs", listImages);

module.exports = router;
