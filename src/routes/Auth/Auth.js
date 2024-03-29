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
  updateRoles,
} = require("../../controllers/AuthController/AuthController");
const {
  isAuthenticatedUser,
  verifyAdmin,
} = require("../../middleware/verifyAuth");

//  isAuthenticatedUser, verifyAdmin("admin"),
router.get("/", getAllUsers);

router.get("/userProfile", isAuthenticatedUser, getUserDetails);

// auth routes
router.post("/signup", parser.single("avatar"), signup);
router.post("/signin", signin);
router.get("/sigout", isAuthenticatedUser, signout);

router.post("/sendVerification", sendVerificationCode);

router.post("/verify", userVerify);

router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword", resetPassword);

router.patch("/updateProfile", isAuthenticatedUser, updateProfile);
router.patch(
  "/updateAvatar",
  isAuthenticatedUser,
  parser.single("avatar"),
  updateAvatar
);

// ! admin
router.get("/:userId", isAuthenticatedUser, verifyAdmin("admin"), singleUser);
router.delete(
  "/:userId",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  deleteUser
);

// ! update role
router.patch(
  "/role/:id",
  isAuthenticatedUser,
  verifyAdmin("admin"),
  updateRoles
);

module.exports = router;
