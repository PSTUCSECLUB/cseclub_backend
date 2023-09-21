const express = require("express");
const router = express.Router();
const multer = require("multer");
const { sponsorsStorage, checkFileType } = require("../../config/multer");
const {
  createSponsor,
  allSponsor,
  updateSponsor,
  removeSponsor,
} = require("../../controllers/SponsorController/SponsorController");

const parser = multer({
  storage: sponsorsStorage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

router.post("/", parser.single("image"), createSponsor);

router.get("/", allSponsor);

router.put("/:id", parser.single("image"), updateSponsor);

// Delete an alumni record
router.delete("/:id", removeSponsor);

module.exports = router;
