const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
  },
  coverImgLand: String,
  coverImgPort: String,
  image: String,
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
      sponsorImg: String,
    },
  ],
  inEventsPage: Boolean,
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
