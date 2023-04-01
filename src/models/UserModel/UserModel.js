const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[\w-]+@cse\.pstu\.ac\.bd$/.test(value);
        },
        message: "Please enter a your university mail",
      },
    },
    password: {
      type: String,
      required: true,
      required: [true, "Please enter your password"],
      minLength: [8, "Must be at least 8"],
      select: false,
    },
    avatar: {
      type: String,
    },
    regi: {
      type: Number,
      required: true,
    },
    fId: {
      type: Number,
      required: true,
    },
    session: {
      type: Number,
      required: true,
    },
    isAlumni: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      type: [String],
    },
    currentJob: {
      type: String,
    },
    currentCompany: {
      type: String,
    },
    description: {
      type: String,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
