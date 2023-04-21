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
  const {
    title,
    shortDescription,
    schedules,
    sponsors,
    inEventsPage,
    description,
  } = req.body;

  for (let i = 0; i < req.files?.sponsorImg?.length; i++) {
    sponsors[i].sponsorImg = req.files.sponsorImg[i].path;
  }

  const event = new Event({
    title,
    shortDescription,
    coverImgLand: req.files?.coverImgLand[0]?.path,
    coverImgPort: req.files?.coverImgPort[0]?.path,
    image: req.files?.image[0]?.path,
    schedules,
    sponsors,
    inEventsPage,
    description,
    createdBy: req.user._id,
  });

  const result = await event.save();

  let parentEvent = await Event.findById(req.query.parentId);

  if (parentEvent) {
    parentEvent.childs.push(result._id);
    await parentEvent.save();
  }

  res.status(200).json({
    result,
  });
});

exports.singleEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
      .lean()
      .populate({
        path: "childs",
        select: "title shortDescription image",
      })
      .select("-inEventsPage");

    if (!singleEvent) {
      return next(new ErrorHandler("Event not found", 404));
    }
    res.status(200).json({
      success: true,
      singleEvent,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//! json data
// * ("MM/DD/YYYY hh:mm:ss"))
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.eventId);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    if (
      event.createdBy.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      try {
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
        res.status(500).json(err);
      }
    } else {
      return next(new ErrorHandler("Admin can update the event", 401));
    }
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

    const coverImgLand = getPublicId(event.coverImgLand);
    const coverImgPort = getPublicId(event.coverImgPort);
    //! array

    let imageUrls = [];

    event?.sponsors.forEach((elt) => {
      imageUrls.push(elt.sponsorImg);
    });

    const galleryImgsId = getPublicIdList(imageUrls);

    console.log(event.createdBy.toString(), req.user._id.toString());

    if (
      event.createdBy.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      try {
        removeImageFromCloud(coverImgLand);
        removeImageFromCloud(coverImgPort);
        removeImageFromCloudList(galleryImgsId);

        await Event.findByIdAndRemove(req.params.eventId);

        res.status(200).json({
          success: true,
          message: "Event deleted successfully",
        });
      } catch (error) {
        res.status(500).json(error);
        console.log(error);
      }
    } else {
      return next(new ErrorHandler("Admin can update the event", 401));
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//!  cover image update coverImgLand
exports.updateCoverImgLand = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      if (
        event.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        const coverImgLand = getPublicId(event.coverImgLand);
        removeImageFromCloud(coverImgLand);

        const updateCoverImageUrl = {
          coverImgLand: req.files?.coverImgLand[0]?.path,
        };

        event = await Event.findByIdAndUpdate(
          req.params.eventId,
          updateCoverImageUrl,
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
      } else {
        return next(new ErrorHandler("Admin can update the event", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//! uploadImagesSponsors update
exports.updateImagesOfSponsors = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      let imageUrls = [];

      event?.sponsors.forEach((elt) => {
        imageUrls.push(elt.sponsorImg);
      });

      const galleryImgsId = getPublicIdList(imageUrls);

      if (
        event.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        removeImageFromCloudList(galleryImgsId);

        for (let i = 0; i < req.files?.sponsorImg?.length; i++) {
          sponsors[i].sponsorImg = req.files?.sponsorImg[i].path;
        }

        await event.save({
          new: true,
          runValidators: true,
          useFindAndModify: false,
        });

        res.status(200).json({
          success: true,
          event,
        });
      } else {
        return next(new ErrorHandler("Admin can update the event", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//! updateCoverImgPort coverImgPort
exports.updateCoverImgPort = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      if (
        event.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        const coverImgPort = getPublicId(event.coverImgPort);
        removeImageFromCloud(coverImgPort);

        const updateCoverImgPortUrl = {
          coverImgPort: req.files?.coverImgPort[0]?.path,
        };

        event = await Event.findByIdAndUpdate(
          req.params.eventId,
          updateCoverImgPortUrl,
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
      } else {
        return next(new ErrorHandler("Admin can update the event", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//! uploadImages image
exports.updateImage = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      if (
        event.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        const image = getPublicId(event.image);
        removeImageFromCloud(image);

        const updateImageUrl = {
          image: req.files?.image[0]?.path,
        };

        event = await Event.findByIdAndUpdate(
          req.params.eventId,
          updateImageUrl,
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
      } else {
        return next(new ErrorHandler("Admin can update the event", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
