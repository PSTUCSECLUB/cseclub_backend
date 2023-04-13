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
const { isAuthenticatedUser } = require("../../middleware/verifyAuth");

const router = express.Router();

router.get("/", allEvent);
router.post(
  "/",
  isAuthenticatedUser,
  parser.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "thumbline", maxCount: 1 },
    { name: "galleryImgs", maxCount: 5 },
  ]),
  createEvent
);
router.get("/eventId", singleEvent);
router.put("/eventId", updateEvent);
router.delete("/eventId", removeEvent);
router.patch("/uploadCover", uploadCover);
router.patch("/uploadImages", uploadImages);
router.post("/uploadThumbline", uploadThumbline);

module.exports = router;
