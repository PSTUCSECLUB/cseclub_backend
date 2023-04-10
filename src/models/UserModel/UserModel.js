const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
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
    registration: {
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

// password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
});

// get jwt
userSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      username: this.username,
      avatar: this.avatar,
      registration: this.registration,
      fId: this.fId,
      session: this.session,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
