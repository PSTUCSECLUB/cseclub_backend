const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
exports.allBlog = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.createBlog = catchAsyncErrors(async (req, res, next) => {});
exports.singleBlog = catchAsyncErrors(async (req, res, next) => {});
exports.updateBlog = catchAsyncErrors(async (req, res, next) => {});
exports.removeBlog = catchAsyncErrors(async (req, res, next) => {});
exports.uploadBlogCover = catchAsyncErrors(async (req, res, next) => {});
exports.uploadBlogThumbline = catchAsyncErrors(async (req, res, next) => {});
