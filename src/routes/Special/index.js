const express = require("express");
const { postImages, listImages } = require("../../controllers/Special");
const router = express.Router();

router.post("/uploadImgs", postImages);
router.get("/listImgs", listImages);

module.exports = router;
