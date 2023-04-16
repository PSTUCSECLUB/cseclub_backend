const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/ErrorHandler");

const forgetPasswordCodeSendEmail = async (user, req, res, next) => {
  const verifyCode = user.getResetPasswordCode();
  await user.save();

  const text = "Here is your reset Password Verification Code";

  try {
    await sendMail.sendEmail({
      email: user.email,
      name: user.name,
      subject: "Forget Passowrd",
      verifyCode: verifyCode,
      text: text,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordCode = undefined;
    user.resetPasswordCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = forgetPasswordCodeSendEmail;
