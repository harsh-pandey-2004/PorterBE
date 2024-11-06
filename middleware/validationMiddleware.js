const { check, validationResult } = require("express-validator");

exports.validateRegister = [
  check("name").notEmpty().withMessage("Name is required"),
  check("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateSendOtp = [
  check("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateVerifyOtp = [
  check("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  check("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

exports.validateLogin = [
  check("phoneNumber")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];
