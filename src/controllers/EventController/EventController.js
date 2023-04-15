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
    eventCount,
  });
});

exports.createEvent = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    subTitle,
    organizers,
    participants,
    startDate,
    endDate,
    durationInHour,
    galleryTitle,
    description,
  } = req.body;

  const imageUrls = [];
  for (let i = 0; i < req.files?.galleryImgs?.length; i++) {
    imageUrls.push(req.files.galleryImgs[i].path);
  }
  console.log(req.author);
  const event = new Event({
    title,
    subTitle,
    organizers,
    participants,
    coverImg: req.files?.coverImg[0]?.path,
    thumbnail: req.files?.thumbnail[0]?.path,
    galleryTitle,
    galleryImgs: imageUrls,
    startDate,
    endDate,
    durationInHour,
    description,
    createdBy: req.user._id,
  });

  const result = await event.save();

  res.json({
    result,
  });
});

exports.singleEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId).lean();
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
        console.log(req.body);
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
    console.log(event);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    const thumbnailId = getPublicId(event.thumbnail);
    const coverImgId = getPublicId(event.coverImg);
    //! array
    const galleryImgsId = getPublicIdList(event.galleryImgs);

    console.log(event.createdBy.toString(), req.user._id.toString());

    if (
      event.createdBy.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      try {
        removeImageFromCloud(thumbnailId);
        removeImageFromCloud(coverImgId);
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

// cover image update
exports.uploadCover = catchAsyncErrors(async (req, res, next) => {
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
        const coverImgId = getPublicId(event.coverImg);
        removeImageFromCloud(coverImgId);

        const updateCoverImageUrl = {
          coverImg: req.files?.coverImg[0]?.path,
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

// galleryImgs update
exports.uploadImages = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let event = await Event.findById(req.params.eventId);

      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }

      const galleryImgsId = getPublicIdList(event.galleryImgs);

      if (
        event.createdBy.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        removeImageFromCloudList(galleryImgsId);

        const imageUrls = [];
        for (let i = 0; i < req.files?.galleryImgs.length; i++) {
          imageUrls.push(req.files.galleryImgs[i].path);
        }

        const updateGalleryImgsUrl = {
          galleryImgs: imageUrls,
        };

        event = await Event.findByIdAndUpdate(
          req.params.eventId,
          updateGalleryImgsUrl,
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

// uploadThumbline
exports.uploadThumbline = catchAsyncErrors(async (req, res, next) => {
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
        const thumbnailId = getPublicId(event.thumbnail);
        removeImageFromCloud(thumbnailId);

        const updateThumbnailImageUrl = {
          thumbnail: req.files?.thumbnail[0]?.path,
        };

        event = await Event.findByIdAndUpdate(
          req.params.eventId,
          updateThumbnailImageUrl,
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
