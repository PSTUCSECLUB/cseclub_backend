const express = require("express");
const { getTest } = require("../controllers/AuthController/AuthController");
const router = express.Router();

router.get("/test", getTest);
module.exports = router;
