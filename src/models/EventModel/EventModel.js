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
  image: {
    type: String,
    required: true,
  },
  // schedules: [
  //   {
  //     _id: false,
  //     title: String,
  //     time: String,
  //     detail: String,
  //   },
  // ],
  sponsors: [
    {
      id: mongoose.Schema.Types.ObjectId,
      title: String,
      image: String,
      url: String,
    },
  ],
  // inEventsPage: {
  //   type: Boolean,
  //   default: false,
  // },
  // childs: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Event",
  //   },
  // ],
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  participants: String,
  websiteLink: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
