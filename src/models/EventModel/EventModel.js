const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  coverImgLand: {
    type: String,
    required: true,
  },
  coverImgPort: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  schedules: [
    {
      _id: false,
      title: String,
      time: String,
      detail: String,
    },
  ],
  sponsors: [
    {
      _id: false,
      name: String,
      site: String,
      img: String,
    },
  ],
  inEventsPage: {
    type: Boolean,
    default: false,
  },
  childs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  description: {
    type: String,
    required: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
