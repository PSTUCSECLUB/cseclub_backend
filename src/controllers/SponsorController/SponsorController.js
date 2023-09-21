const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const APIFeatures = require("../../utils/ApiFeatures");
const { removeSingleImg } = require("../../utils/Images");
const Sponsor = require("../../models/SponsorModel/SponsorModel");

exports.allSponsor = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Sponsor.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .search();

  const allSponsor = await apiFeatures.query;

  res.status(201).json({
    success: true,
    sponsors: allSponsor,
  });
});

exports.createSponsor = catchAsyncErrors(async (req, res, next) => {
  let { title, url, event } = req.body;

  // sponsors = JSON.parse(sponsors);

  // work on the image and images
  let image = process.env.URL + "/sponsors/" + req.file.filename;

  // create the image
  const sponsor = new Sponsor({
    title,
    url,
    image,
    event,
  });

  const savedSponsor = await sponsor.save();
  res.status(200).json({
    success: true,
    sponsor: savedSponsor,
  });
});

//! json data
// * ("MM/DD/YYYY hh:mm:ss"))
exports.updateSponsor = catchAsyncErrors(async (req, res, next) => {
  try {
    let sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) {
      return next(new ErrorHandler("Sponsor not found", 404));
    }

    // if (
    //   event.createdBy.toString() === req.user._id.toString() ||
    //   req.user.role === "admin"
    // ) {

    try {
      // if the main image change
      if (req.file) {
        req.body.image = process.env.URL + "/sponsors/" + req.file.filename;
        removeSingleImg(sponsor.image);
      }
      // if sponsor images are d
      sponsor = await Sponsor.findByIdAndUpdate(
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
        sponsor,
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
exports.removeSponsor = catchAsyncErrors(async (req, res, next) => {
  try {
    let sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) {
      return next(new ErrorHandler("sponsor not found", 404));
    }
    // remove images
    if (sponsor.image) {
      removeSingleImg(sponsor.image);
    }
    await Sponsor.findByIdAndRemove(req.params.sponsorId);
    res.status(200).json({
      success: true,
      message: "sponsor deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
