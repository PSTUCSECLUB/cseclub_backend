const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel/UserModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (bearer && bearer.startsWith("Bearer ")) {
    const Token = bearer.split(" ")[1];

    if (!Token) {
      return next(
        new ErrorHandler("Please login to access the resource.", 401)
      );
    }
    const decodedData = jwt.verify(Token, process.env.JWT_TOKEN_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  }
});
