const express = require("express");
const router = express.Router();

const Auth = require("./Auth/Auth");
const Blog = require("./Blog/Blog");
const Event = require("./Event/Event");
const Special = require("./Special/index");

router.use("/users", Auth);
router.use("/blogs", Blog);
router.use("/events", Event);
router.use(Special);
module.exports = router;
