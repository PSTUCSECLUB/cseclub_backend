const express = require("express");
const {
  allEvent,
  createEvent,
  singleEvent,
  updateEvent,
  removeEvent,
  updateCoverImgLand,
  updateCoverImgPort,
  updateImage,
  updateImagesOfSponsors,
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

// ! query parameter need when you add child event
router.post(
  "/",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([
    { name: "coverImgLand", maxCount: 1 },
    { name: "coverImgPort", maxCount: 1 },
    { name: "image", maxCount: 1 },
    { name: "sponsorImg", maxCount: 8 },
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
  parser.fields([{ name: "coverImgLand", maxCount: 1 }]),
  updateCoverImgLand
);
router.patch(
  "/uploadImagesSponsors/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "sponsorImg", maxCount: 8 }]),
  updateImagesOfSponsors
);
router.patch(
  "/uploadCoverImgPort/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "coverImgPort", maxCount: 1 }]),
  updateCoverImgPort
);

router.patch(
  "/uploadImage/:eventId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  parser.fields([{ name: "image", maxCount: 1 }]),
  updateImage
);

module.exports = router;
