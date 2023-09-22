const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const Event = require("../../models/EventModel/EventModel");
const {
  getPublicId,
  getPublicIdList,
  removeImageFromCloud,
  removeImageFromCloudList,
} = require("../../utils/cloud");
const APIFeatures = require("../../utils/ApiFeatures");
const { removeSingleImg, removeMultipleImgs } = require("../../utils/Images");
const Sponsor = require("../../models/SponsorModel/SponsorModel");

exports.allEvent = catchAsyncErrors(async (req, res, next) => {
  const eventCount = await Event.countDocuments();
  const apiFeatures = new APIFeatures(Event.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate()
    .search();

  const allEvents = await apiFeatures.query;
  res.status(201).json({
    success: true,
    events: allEvents,
    totalEventsCount: eventCount,
  });
});

exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  let {
    title,
    shortDescription,
    // schedules,
    description,
    participants,
    websiteLink,
    startDate,
    endDate,
  } = req.body;

  // sponsors = JSON.parse(sponsors);

  // work on the image and images
  let image = process.env.URL + "/events/" + req.files.image[0].filename;

  // handle sponsors

  // create the image
  const event = new Event({
    title,
    shortDescription,
    image,
    description,
    startDate,
    endDate,
    participants,
    websiteLink,
    // createdBy: req.user._id,
  });

  const savedEvent = await event.save();
  res.status(200).json({
    success: true,
    event: savedEvent,
  });
});

exports.singleEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId);
    if (!singleEvent) {
      return next(new ErrorHandler("Event not found", 404));
    }
    res.status(200).json({
      success: true,
      event: singleEvent,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//! json data
// * ("MM/DD/YYYY hh:mm:ss"))

/* Updating event-----
1. image might be updated
2. images might be updated
3. normal data might be updated
4. sponsors might be updated with new sponsors
   or removedSponsors */

exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.eventId);
    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    // if (
    //   event.createdBy.toString() === req.user._id.toString() ||
    //   req.user.role === "admin"
    // ) {

    try {
      // if the main image change
      if (req.files.image) {
        req.body.image =
          process.env.URL + "/events/" + req.files.image[0].filename;
        removeSingleImg(event.image);
      }
      // if sponsor images are d
      event = await Event.findByIdAndUpdate(
        req.params.eventId,
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
        event,
      });
    } catch (error) {
      console.log(error);
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
exports.removeEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.eventId);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }
    // remove images
    if (event.image) {
      removeSingleImg(event.image);
    }

    // for (let s of event.sponsors) {
    //   if (s.img) {
    //     removeSingleImg(s.img);
    //   }
    // }

    // removing images from the description
    let matches = event.description.match(/src="(.*?)"/g);
    let qImgFiles = [];
    if (matches) {
      for (let m of matches) {
        qImgFiles.push(m.slice(5, m.length - 1));
      }
      removeMultipleImgs(qImgFiles);
    }
    await Event.findByIdAndRemove(req.params.eventId);
    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// //!  cover image update coverImgLand
// exports.updateCoverImgLand = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const file = req.files;
//     console.log(req.files);
//     if (file !== "") {
//       let event = await Event.findById(req.params.eventId);

//       if (!event) {
//         return next(new ErrorHandler("Event not found", 404));
//       }

//       // if (
//       //   event.createdBy.toString() === req.user._id.toString() ||
//       //   req.user.role === "admin"
//       // ) {
//       const coverImgLand = getPublicId(event.coverImgLand);
//       removeImageFromCloud(coverImgLand);

//       const updateCoverImageUrl = {
//         coverImgLand: req.files?.coverImgLand[0]?.path,
//       };

//       event = await Event.findByIdAndUpdate(
//         req.params.eventId,
//         updateCoverImageUrl,
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );

//       res.status(200).json({
//         success: true,
//         event,
//       });
//       // } else {
//       //   return next(new ErrorHandler("Admin can update the event", 401));
//       // }
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// //! uploadImagesSponsors update
// exports.updateImagesOfSponsors = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const file = req.files;
//     if (file !== "") {
//       let event = await Event.findById(req.params.eventId);

//       if (!event) {
//         return next(new ErrorHandler("Event not found", 404));
//       }

//       let imageUrls = [];
//       let sponsors = event?.sponsors;
//       sponsors.forEach((elt) => {
//         elt.img && imageUrls.push(elt.img);
//       });

//       const galleryImgsId = getPublicIdList(imageUrls);

//       // if (
//       //   event.createdBy.toString() === req.user._id.toString() ||
//       //   req.user.role === "admin"
//       // ) {
//       removeImageFromCloudList(galleryImgsId);
//       for (let i = 0; i < req.files?.sponsorImg?.length; i++) {
//         sponsors[i].img = req.files?.sponsorImg[i].path;
//       }

//       await event.save({
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       });

//       res.status(200).json({
//         success: true,
//         event,
//       });
//       // } else {
//       //   return next(new ErrorHandler("Admin can update the event", 401));
//       // }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// });

// //! updateCoverImgPort coverImgPort
// exports.updateCoverImgPort = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const file = req.files;

//     if (file !== "") {
//       let event = await Event.findById(req.params.eventId);

//       if (!event) {
//         return next(new ErrorHandler("Event not found", 404));
//       }

//       // if (
//       //   event.createdBy.toString() === req.user._id.toString() ||
//       //   req.user.role === "admin"
//       // ) {
//       const coverImgPort = getPublicId(event.coverImgPort);
//       removeImageFromCloud(coverImgPort);

//       const updateCoverImgPortUrl = {
//         coverImgPort: req.files?.coverImgPort[0]?.path,
//       };

//       event = await Event.findByIdAndUpdate(
//         req.params.eventId,
//         updateCoverImgPortUrl,
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );

//       res.status(200).json({
//         success: true,
//         event,
//       });
//       // } else {
//       //   return next(new ErrorHandler("Admin can update the event", 401));
//       // }
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// //! uploadImages image
// exports.updateImage = catchAsyncErrors(async (req, res, next) => {
//   try {
//     const file = req.files;

//     if (file !== "") {
//       let event = await Event.findById(req.params.eventId);

//       if (!event) {
//         return next(new ErrorHandler("Event not found", 404));
//       }

//       // if (
//       //   event.createdBy.toString() === req.user._id.toString() ||
//       //   req.user.role === "admin"
//       // ) {
//       const image = getPublicId(event.image);
//       removeImageFromCloud(image);

//       const updateImageUrl = {
//         image: req.files?.image[0]?.path,
//       };

//       event = await Event.findByIdAndUpdate(
//         req.params.eventId,
//         updateImageUrl,
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );

//       res.status(200).json({
//         success: true,
//         event,
//       });
//       // } else {
//       //   return next(new ErrorHandler("Admin can update the event", 401));
//       // }
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
