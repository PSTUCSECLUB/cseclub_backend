const express = require("express");
const {
  allEvent,
  createEvent,
  singleEvent,
  updateEvent,
  removeEvent,
  uploadCover,
  uploadImages,
  uploadThumbline,
} = require("../../controllers/EventController/EventController");
const multer = require("multer");
const { eventStorage } = require("../../config/cloudinary");
const parser = multer({ storage: eventStorage });
const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");

const router = express.Router();

router.get("/", allEvent);

router.post(
  "/",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "galleryImgs", maxCount: 5 },
  ]),
  createEvent
);
router.get("/:eventId", singleEvent);
router.put("/:eventId", isAuthenticatedUser, verifyAdmin("admin"), updateEvent);
router.delete(
  "/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  removeEvent
);
router.patch(
  "/uploadCover/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "coverImg", maxCount: 1 }]),
  uploadCover
);
router.patch(
  "/uploadImages/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "galleryImgs", maxCount: 5 }]),
  uploadImages
);
router.patch(
  "/uploadThumbline/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "thumbnail", maxCount: 1 }]),
  uploadThumbline
);

module.exports = router;
