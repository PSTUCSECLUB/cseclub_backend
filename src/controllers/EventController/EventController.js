const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const Event = require("../../models/EventModel/EventModel");

exports.allEvent = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    subTitle,
    organizers,
    participants,
    startDate,
    endDate,
    duration,
    galleryTitle,
    description,
  } = req.body;

  const imageUrls = [];
  for (let i = 0; i < req.files?.galleryImgs.length; i++) {
    imageUrls.push(req.files.galleryImgs[i].path);
  }

  const event = new Event({
    title,
    subTitle,
    organizers,
    participants,
    coverImg: req.files?.coverImg[0]?.path, // Use the first image as the cover image
    thumbline: req.files?.thumbline[0]?.path, // Use the first image as the thumbnail
    galleryTitle,
    galleryImgs: imageUrls,
    startDate,
    endDate,
    duration,
    description,
  });

  const result = await event.save();

  res.json({
    result,
  });
});

exports.singleEvent = catchAsyncErrors(async (req, res, next) => {});
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {});
exports.removeEvent = catchAsyncErrors(async (req, res, next) => {});
exports.uploadCover = catchAsyncErrors(async (req, res, next) => {});
exports.uploadImages = catchAsyncErrors(async (req, res, next) => {});
exports.uploadThumbline = catchAsyncErrors(async (req, res, next) => {});
