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
const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");
const parser = multer({ storage });

// Create a new alumni record
router.post(
  "/",
  isAuthenticatedUser,
  verifyAdmin(),
  parser.single("photo"),
  createAlumni
);

// Get all alumni records
router.get("/", getAllAlumni);

// Get a specific alumni record by ID
router.get("/:id", getAlumniById);

// Update an alumni record
router.put("/:id", isAuthenticatedUser, verifyAdmin(), updateAlumni);

// Delete an alumni record
router.delete("/:id", isAuthenticatedUser, verifyAdmin(), deleteAlumni);
router.patch(
  "/:id/updatePhoto",
  isAuthenticatedUser,
  verifyAdmin(),
  parser.single("photo"),
  updatePhoto
);

module.exports = router;
