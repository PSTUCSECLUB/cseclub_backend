const mongoose = require("mongoose");

// Define the schema for the Alumni model
const executiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

const Alumni = mongoose.model("Executive", executiveSchema);

module.exports = Alumni;
