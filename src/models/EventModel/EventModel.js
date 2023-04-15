const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subTitle: { type: String },
  organizers: [
    {
      _id: false,
      companyName: { type: String },
      companyLogo: { type: String },
    },
  ],
  participants: {
    type: Number,
  },
  coverImg: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  durationInHour: {
    type: Number,
  },
  galleryTitle: {
    type: String,
  },
  galleryImgs: [{ type: String }],
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
