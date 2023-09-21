const ErrorHandler = require("../../utils/ErrorHandler");
const Alumni = require("../../models/AlumniModel/AlumniModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const APIFeatures = require("../../utils/ApiFeatures");
const { getPublicId, removeImageFromCloud } = require("../../utils/cloud");

// Create a new alumni record
exports.createAlumni = async (req, res) => {
  const photo = req.file.path;
  try {
    let { name, session, email, socialLinks, jobRole, jobCompany } = req.body;

    // to work around with formdata
    if (typeof socialLinks === "string") {
      socialLinks = JSON.parse(socialLinks);
    }

    const alumni = new Alumni({
      name,
      photo,
      session,
      email,
      socialLinks,
      jobRole,
      jobCompany,
    });

    const savedAlumni = await alumni.save();

    res.status(201).json({ success: true, alumni: savedAlumni });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to create alumni record", error });
  }
};

// Get all alumni records
exports.getAllAlumni = async (req, res) => {
  try {
    const apiFeatures = new APIFeatures(Alumni.find(), req.query)
      .searchByName()
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const allAlumni = await apiFeatures.query;

    res.status(201).json({
      success: true,
      alumnies: allAlumni,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to get alumni records", error });
  }
};

// Get a specific alumni record by ID
exports.getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res
        .status(404)
        .json({ msg: "Alumni record not found", error: null });
    }

    res.json({ success: true, alumni });
  } catch (error) {
    res.status(500).json({ error, msg: "Failed to get alumni record" });
  }
};

// Update an alumni record
exports.updateAlumni = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    let alumni = await Alumni.findById(id);
    if (!alumni) return next(new ErrorHandler("Alumni not found", 404));
    alumni = await Alumni.findByIdAndUpdate(
      id,
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
      alumni,
    });
  } catch (error) {
    res.status(500).json({ error, msg: "Failed to update alumni record" });
  }
};

exports.updatePhoto = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;
    console.log(file);
    if (file !== "") {
      let alumni = await Alumni.findById(req.params.id);
      if (!alumni) {
        return next(new ErrorHandler("alumni not found", 404));
      }

      // removing from the cloud
      if (alumni.photo) {
        const photoId = getPublicId(alumni.photo);
        removeImageFromCloud("profile/" + photoId);
      }

      const updatePhotoImageUrl = {
        photo: req.file.path,
      };

      alumni = await Alumni.findByIdAndUpdate(
        req.params.id,
        updatePhotoImageUrl,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      res.status(200).json({
        success: true,
        alumni,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error happend", error });
  }
});
// Delete an alumni record
exports.deleteAlumni = async (req, res, next) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findById(id);
    if (!alumni) {
      return next(new ErrorHandler(`alumni doesn't exist with id ${id}`, 404));
    }
    if (alumni.photo) {
      const photoId = getPublicId(alumni.photo);
      removeImageFromCloud("profile/" + photoId);
    }
    await Alumni.findByIdAndRemove(id);

    res.status(200).json({
      success: true,
      message: "Alumni deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, msg: "Failed to delete alumni record" });
  }
};
