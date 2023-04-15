const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Profile",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blog-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const specialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "special-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

module.exports = {
  cloudinary,
  storage,
  eventStorage,
  blogStorage,
  specialStorage,
};
