const multer = require("multer");
const path = require("path");

const eventsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/events");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const alumniesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/alumnies");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const blogsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/blogs");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const sponsorsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/sponsors");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const executivesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/executives");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const imagesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e2);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|webp|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

module.exports = {
  eventsStorage,
  alumniesStorage,
  blogsStorage,
  sponsorsStorage,
  imagesStorage,
  checkFileType,
  executivesStorage,
};
