const mongoose = require("mongoose");

// Define the schema for the Sponsor model
const sponsorSchema = new mongoose.Schema({
  event: {
    ref: "Event",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

module.exports = Sponsor;
