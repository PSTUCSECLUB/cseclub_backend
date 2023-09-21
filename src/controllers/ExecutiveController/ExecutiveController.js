const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const APIFeatures = require("../../utils/ApiFeatures");
const { removeSingleImg } = require("../../utils/Images");
const Executive = require("../../models/ExecutiveModel/ExecutiveModel");

exports.allExecutive = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Executive.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .search();

  const allExecutives = await apiFeatures.query;

  res.status(201).json({
    success: true,
    executives: allExecutives,
  });
});

exports.getSingleExecutive = catchAsyncErrors(async (req, res) => {
  let executive = await Executive.findById(req.params.id);
  if (!executive)
    return res.status(404).json({
      success: true,
      message: "Not found!",
    });
  return res.status(201).json({
    success: true,
    executive,
  });
});

exports.createExecutive = catchAsyncErrors(async (req, res, next) => {
  let { name, role, order } = req.body;

  // work on the image and images
  let image = process.env.URL + "/executives/" + req.file.filename;

  const executives = new Executive({
    name,
    role,
    order,
    image,
  });

  const savedExecutive = await executives.save();
  res.status(200).json({
    success: true,
    executive: savedExecutive,
  });
});

//! json data
// * ("MM/DD/YYYY hh:mm:ss"))
exports.updateExecutive = catchAsyncErrors(async (req, res, next) => {
  try {
    let executive = await Executive.findById(req.params.id);
    if (!executive) {
      return next(new ErrorHandler("Executive not found", 404));
    }

    // if (
    //   event.createdBy.toString() === req.user._id.toString() ||
    //   req.user.role === "admin"
    // ) {

    try {
      // if the main image change
      if (req.file) {
        req.body.image = process.env.URL + "/executives/" + req.file.filename;
        removeSingleImg(executive.image);
      }
      // if sponsor images are d
      executive = await Executive.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        executive,
      });
    } catch (error) {
      res.status(500).json(error);
    }
    // } else {
    //   return next(new ErrorHandler("Admin can update the event", 401));
    // }
  } catch (error) {
    res.status(500).json(error);
  }
});

// remove event
exports.removeExecutive = catchAsyncErrors(async (req, res, next) => {
  try {
    let executive = await Executive.findById(req.params.id);

    if (!executive) {
      return next(new ErrorHandler("Executive not found", 404));
    }
    // remove images
    if (executive.image) {
      removeSingleImg(executive.image);
    }
    let removed = await Executive.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: "Executive deleted successfully",
      removed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
