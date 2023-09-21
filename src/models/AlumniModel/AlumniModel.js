const mongoose = require("mongoose");

// Define the schema for the Alumni model
const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
  },
  jobRole: {
    type: String,
    default: "Unemplowed",
  },
  jobCompany: {
    type: String,
    default: "No organization",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Alumni = mongoose.model("Alumni", alumniSchema);

module.exports = Alumni;
