const express = require("express");
const {
  singleUser,
  getAllUsers,
  signup,
  signin,
  signout,
  sendVerificationCode,
  userVerify,
  forgetPassword,
  resetPassword,
  updateProfile,
  updateAvatar,
  deleteUser,
} = require("../../controllers/AuthController/AuthController");
const router = express.Router();

// all users
router.get("/users", getAllUsers);
// get user by id
router.get("/users/userId", singleUser);
// signup, signin, signout
router.post("/users/singup", signup);
router.post("/users/signin", signin);
router.get("/users/sigout", signout);

// verification code
router.post("/users/sendVerification", sendVerificationCode);
// verify
router.post("/users/verify", userVerify);
// forgetPassword, resetPassword, update
router.post("/users/forgetPassword", forgetPassword);
router.patch("/users/resetPassword", resetPassword);
router.patch("/users/updateProfile", updateProfile);
router.patch("/users/updateAvatar", updateAvatar);

// remove user
router.delete("/users/userId", deleteUser);
//router.delete("/users/", deleteUser);

module.exports = router;
