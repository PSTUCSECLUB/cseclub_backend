const express = require("express");
const router = express.Router();

const Auth = require("./Auth/Auth");
const Blog = require("./Blog/Blog");
const Event = require("./Event/Event");
const Alumni = require("./Alumni/Alumni");
const Special = require("./Special/index");
const Sponsor = require("./Sponsor/Sponsor");
const Executive = require("./Executive/Executive");

router.use("/users", Auth);
router.use("/blogs", Blog);
router.use("/events", Event);
router.use("/alumnies", Alumni);
router.use("/sponsors", Sponsor);
router.use("/executives", Executive);
router.use("/upload", Special);
module.exports = router;
