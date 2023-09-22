const express = require("express");
const {
  postImages,
  listImages,
  postImage,
  deleteImage,
} = require("../../controllers/Special");
// const router = express.Router();
// const multer = require("multer");
// const { specialStorage } = require("../../config/cloudinary");
// const parser = multer({ storage: specialStorage });
const router = express.Router();
const multer = require("multer");
const { checkFileType, imagesStorage } = require("../../config/multer");

const parser = multer({
  storage: imagesStorage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

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
router.post(
  "/uploadImg",
  isAuthenticatedUser,
  verifyAdmin(),
  parser.single("image"),
  postImage
);
router.put("/remove", isAuthenticatedUser, verifyAdmin(), deleteImage);

router.get("/listImgs", listImages);

module.exports = router;
