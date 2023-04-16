const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const userSchema = new Schema({
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
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  registration: {
    type: Number,
  },
  fId: { type: Number },
  session: {
    type: String,
  },
  isAlumni: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  socialLinks: [
    {
      _id: false,
      media: { type: String, enum: ["facebook", "twitter", "linkedin"] },
      url: { type: String },
    },
  ],
  currentJob: {
    type: String,
  },
  currentCompany: {
    type: String,
  },
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  verificationCode: String,
  verificationCodeExpires: Date,
  resetPasswordCode: String,
  resetPasswordCodeExpires: Date,
});

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
      role: this.role,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// get Reset Password Code
userSchema.methods.getResetPasswordCode = function () {
  const resetCode = Math.random().toString(36).substring(2, 8);

  this.resetPasswordCode = resetCode;
  this.resetPasswordCodeExpires = Date.now() + 15 * 60 * 1000;

  return resetCode;
};

// get verification code
userSchema.methods.getVerificationCode = function () {
  const emailVerifyCode = Math.random().toString(36).substring(2, 8);
  this.verificationCode = emailVerifyCode;
  this.verificationCodeExpires = Date.now() + 15 * 60 * 1000;

  return emailVerifyCode;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
