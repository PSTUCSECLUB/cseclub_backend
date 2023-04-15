const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../config/cloudinary");
const parser = multer({ storage });
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
  getUserDetails,
} = require("../../controllers/AuthController/AuthController");
const { isAuthenticatedUser } = require("../../middleware/verifyAuth");

router.get("/", getAllUsers);

router.get("/userProfile", isAuthenticatedUser, getUserDetails);

router.get("/:userId", singleUser);

// auth routes
router.post("/singup", parser.single("avatar"), signup); //parser.single("avatar")
router.post("/signin", signin);
router.get("/sigout", signout);

router.post("/sendVerification", sendVerificationCode);

router.post("/verify", userVerify);

router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/updateProfile", updateProfile);
router.patch("/updateAvatar", updateAvatar);

router.delete("/:userId", deleteUser);

//router.delete("/users/", deleteUser);

module.exports = router;
