const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  let { message = "Internal Server Error", statusCode = 500 } = err;

  // wrong mongodb id error

  if (err.name == "CastError") {
    message = `Resource not found: Invalid ${err.path}`;

    err = new ErrorHandler(message, 400);
  }

  // duplicate mongodb id error

  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Token error

  if (err.name === "JsonWebTokenError") {
    message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

/*
// Define the global error middleware function
function errorHandler(err, req, res, next) {
  // Check if the error is a known error that has a custom message and status code
  if (err.statusCode && err.message) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    // If the error is unknown, return a generic error message and status code
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Register the global error middleware function with Express.js
app.use(errorHandler);


*/
