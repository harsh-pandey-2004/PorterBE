const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const validationMiddleware = require("../middleware/validationMiddleware");

// Routes for user registration, login, and OTP handling
router.post(
  "/register",
  validationMiddleware.validateRegister,
  authController.register
);
router.post(
  "/send-otp",
  validationMiddleware.validateSendOtp,
  authController.sendOtp
);
router.post(
  "/verify-otp",
  validationMiddleware.validateVerifyOtp,
  authController.verifyOtp
);
router.post("/login", validationMiddleware.validateLogin, authController.login);

module.exports = router;
