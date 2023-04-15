const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  coverImg: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
      enum: [
        "Tech",
        "Competitive Programming",
        "Development",
        "Programming",
        "Guidelines",
      ],
      required: true,
      _id: false,
    },
  ],
  tags: [
    {
      type: String,
      required: false,
      _id: false,
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
});

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;
