//* Imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const createError = require("http-errors");
const router = require("./src/routes");
const ErrorHandler = require("./src/middleware/error");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routers

app.use("/api/v1", router);

// custom error middleware
app.use(ErrorHandler);

app.use(async (req, res, next) => {
  //next(createError.NotFound());
  res.send(createError.NotFound());
});
/*
app.use("*", (req, res) => {
  res.status(404).json({ status: "Failure", data: "Not Found" });
});
*/

module.exports = app;
