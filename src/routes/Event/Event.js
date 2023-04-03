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

router.get("/events", allEvent);
router.post("/events", createEvent);
router.get("/events/eventId", singleEvent);
router.put("/events/eventId", updateEvent);
router.delete("/events/eventId", removeEvent);
router.patch("/events/uploadCover", uploadCover);
router.patch("/events/uploadImages", uploadImages);
router.post("/events/uploadThumbline", uploadThumbline);

module.exports = router;
