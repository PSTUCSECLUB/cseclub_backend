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
// const { eventStorage } = require("../../config/cloudinary");
const { eventsStorage, checkFileType } = require("../../config/multer");

const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");

const router = express.Router();
const parser = multer({
  storage: eventsStorage,
  // limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
router.get("/", allEvent);

// ! query parameter need when you add child event
router.post(
  "/",
  // isAuthenticatedUser,
  // verifyAdmin("admin"),
  parser.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 6 },
    { name: "sponsorImgs", maxCount: 8 },
  ]),
  createEvent
);
router.get("/:eventId", singleEvent);
//isAuthenticatedUser, verifyAdmin("admin"),
router.put(
  "/:eventId",

  parser.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 6 },
    // { name: "sponsorImgs", maxCount: 8 },
  ]),
  updateEvent
);
//  isAuthenticatedUser,verifyAdmin("admin"),
router.delete(
  "/:eventId",

  removeEvent
);
// // isAuthenticatedUser,
// // verifyAdmin("admin"),
// router.patch(
//   "/uploadCover/:eventId",

//   parser.fields([{ name: "coverImgLand", maxCount: 1 }]),
//   updateCoverImgLand
// );
// // isAuthenticatedUser,
// // verifyAdmin("admin"),
// router.patch(
//   "/uploadImagesSponsors/:eventId",

//   parser.fields([{ name: "sponsorImg", maxCount: 8 }]),
//   updateImagesOfSponsors
// );
// // isAuthenticatedUser,
// // verifyAdmin("admin"),
// router.patch(
//   "/uploadCoverImgPort/:eventId",

//   parser.fields([{ name: "coverImgPort", maxCount: 1 }]),
//   updateCoverImgPort
// );

// // isAuthenticatedUser,
// // verifyAdmin("admin"),
// router.patch(
//   "/uploadImage/:eventId",

//   parser.fields([{ name: "image", maxCount: 1 }]),
//   updateImage
// );

module.exports = router;
