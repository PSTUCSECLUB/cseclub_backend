const express = require("express");
const router = express.Router();

const Auth = require("./Auth/Auth");
const Blog = require("./Blog/Blog");
const Event = require("./Event/Event");
const Special = require("./Special/index");

router.use(Auth);
router.use(Blog);
router.use(Event);
router.use(Special);
module.exports = router;
