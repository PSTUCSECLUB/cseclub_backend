const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../config/cloudinary");
const {
  updatePhoto,
  createAlumni,
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
} = require("../../controllers/AlumniController/AlumniController");
const parser = multer({ storage });

// Create a new alumni record
router.post("/", parser.single("photo"), createAlumni);

// Get all alumni records
router.get("/", getAllAlumni);

// Get a specific alumni record by ID
router.get("/:id", getAlumniById);

// Update an alumni record
router.put(
  "/:id",
  (req, res, next) => {
    console.log("everthing is fine");
    next();
  },
  updateAlumni
);

// Delete an alumni record
router.delete("/:id", deleteAlumni);
router.patch("/:id/updatePhoto", parser.single("photo"), updatePhoto);

module.exports = router;
