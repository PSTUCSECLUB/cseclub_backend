const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: String,
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  participants: Number,
  coverImg: String,
  thumbline: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  galleryTitle: String,
  galleryImgs: [String],
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
