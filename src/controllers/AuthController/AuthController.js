const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const User = require("../../models/UserModel/UserModel");
const ErrorHandler = require("../../utils/ErrorHandler");

// signup
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const avatar = req.file.path;

  const {
    name,
    username,
    email,
    password,
    registration,
    fId,
    session,
    socialLinks,
    currentJob,
    currentCompany,
    description,
  } = req.body;

  const user = await User.create({
    name,
    username,
    email,
    password,
    avatar,
    registration,
    fId,
    session,
    socialLinks,
    currentJob,
    currentCompany,
    description,
  });
  const token = user.getJWTToken();
  res.status(201).json({
    token,
  });
});

// signin
exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const token = user.getJWTToken();
  res.status(201).json({
    token,
  });
});

exports.signout = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.sendVerificationCode = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.userVerify = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});
exports.updateAvatar = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});

//! admin
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.params.userId);
  const user = await User.findById(req.params.userId);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  res.send("Hello World! ");
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});
