const express = require("express");
const router = express.Router();
const multer = require("multer");
const { checkFileType, executivesStorage } = require("../../config/multer");

const {
  createExecutive,
  allExecutive,
  updateExecutive,
  removeExecutive,
  getSingleExecutive,
} = require("../../controllers/ExecutiveController/ExecutiveController");
const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");

const parser = multer({
  storage: executivesStorage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

router.post(
  "/",
  isAuthenticatedUser,
  verifyAdmin(),
  parser.single("image"),
  createExecutive
);

router.get("/", allExecutive);
router.get("/:id", getSingleExecutive);
router.put(
  "/:id",
  isAuthenticatedUser,
  verifyAdmin(),
  parser.single("image"),
  updateExecutive
);

// Delete an alumni record
router.delete("/:id", isAuthenticatedUser, verifyAdmin(), removeExecutive);

module.exports = router;
