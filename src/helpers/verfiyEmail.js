const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");

const verifyEmail = async (user, req, res, next) => {
  const verifyCode = user.getVerificationCode();
  await user.save();

  try {
    await sendMail.sendEmail({
      email: user.email,
      name: user.name,
      subject: "Email Verification",
      verifyCode: verifyCode,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = verifyEmail;
