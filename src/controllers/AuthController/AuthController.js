const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const User = require("../../models/UserModel/UserModel");
const APIFeatures = require("../../utils/ApiFeatures");
const ErrorHandler = require("../../utils/ErrorHandler");
const { getPublicId, removeImageFromCloud } = require("../../utils/cloud");
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
    role,
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
    role,
  });

  const token = user.getJWTToken();
  res.status(201).json({
    token,
  });
});

// signin
exports.signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

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
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const token = "";
  res.status(200).json({
    success: true,
    token,
    message: "Successfully logged out",
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

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
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (user._id.toString() === req.user._id.toString()) {
      try {
        user = await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: req.body,
          },
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );
        res.status(200).json({
          success: true,
          user,
        });
      } catch (error) {
        res.status(500).json(err);
      }
    } else {
      return next(new ErrorHandler("You can update only your profile!", 401));
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

exports.updateAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    const file = req.files;

    if (file !== "") {
      let user = await User.findById(req.user._id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (user._id.toString() === req.user._id.toString()) {
        const avatarId = getPublicId(user.avatar);

        removeImageFromCloud(avatarId);

        const updateAvatarImageUrl = {
          avatar: req.file.path,
        };

        user = await User.findByIdAndUpdate(
          req.user._id,
          updateAvatarImageUrl,
          {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          }
        );

        res.status(200).json({
          success: true,
          user,
        });
      } else {
        return next(new ErrorHandler("You can update only your post!", 401));
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//! admin
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id ${req.params.userId}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});
// !admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(
        new ErrorHandler(`User doesn't exist with id ${req.params.userId}`, 404)
      );
    }

    const avatarId = getPublicId(user.avatar);
    removeImageFromCloud(avatarId);

    await User.findByIdAndRemove(req.params.userId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const userCount = await User.countDocuments();
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .searchByName()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const allUsers = await apiFeatures.query;

  res.status(201).json({
    success: true,
    users: allUsers,
    userCount,
  });
});

// * Update role -- Admin

exports.updateRoles = catchAsyncErrors(async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new ErrorHandler(`User doesn't exist with id ${req.params.id}`, 404)
      );
    }

    const updatedInfo = {
      role: req.body.role,
    };

    user = await userModel.findByIdAndUpdate(req.params.id, updatedInfo, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
