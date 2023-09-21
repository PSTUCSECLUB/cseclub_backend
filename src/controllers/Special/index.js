const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const { removeSingleImg } = require("../../utils/Images");
exports.postImages = catchAsyncErrors(async (req, res, next) => {});
exports.listImages = catchAsyncErrors(async (req, res, next) => {});
exports.postImage = catchAsyncErrors(async (req, res, next) => {
  return res.json({
    image: process.env.URL + "/images/" + req.file.filename,
  });
});
exports.deleteImage = catchAsyncErrors(async (req, res, next) => {
  await removeSingleImg(req.body.url);
  return res.json({ success: true });
});
