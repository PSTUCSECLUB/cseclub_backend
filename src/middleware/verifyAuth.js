const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel/UserModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return next(new ErrorHandler("Please login to access the resource.", 401));
  }

  if (bearer && bearer.startsWith("Bearer ")) {
    const Token = bearer.split(" ")[1];

    if (!Token) {
      return next(
        new ErrorHandler("Please login to access the resource.", 401)
      );
    }
    console.log(Token);

    const decodedData = jwt.verify(Token, process.env.JWT_TOKEN_SECRET);
    req.user = await User.findById(decodedData.id);
    console.log(req.user);
    next();
  }
});

exports.verifyAdmin = () => {
  return (req, res, next) => {
    if (req.user.role !== "admin") {
      return next(new ErrorHandler(`this user is not admin!`, 403));
    }
    next();
  };
};
