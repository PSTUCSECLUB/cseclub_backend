const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
exports.allEvent = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.createEvent = catchAsyncErrors(async (req, res, next) => {});
exports.singleEvent = catchAsyncErrors(async (req, res, next) => {});
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {});
exports.removeEvent = catchAsyncErrors(async (req, res, next) => {});
exports.uploadCover = catchAsyncErrors(async (req, res, next) => {});
exports.uploadImages = catchAsyncErrors(async (req, res, next) => {});
exports.uploadThumbline = catchAsyncErrors(async (req, res, next) => {});
