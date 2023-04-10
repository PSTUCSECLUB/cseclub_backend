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

const router = express.Router();

router.get("/", allEvent);
router.post("/", createEvent);
router.get("/eventId", singleEvent);
router.put("/eventId", updateEvent);
router.delete("/eventId", removeEvent);
router.patch("/uploadCover", uploadCover);
router.patch("/uploadImages", uploadImages);
router.post("/uploadThumbline", uploadThumbline);

module.exports = router;
