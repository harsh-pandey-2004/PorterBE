const User = require("../models/user");
const Otp = require("../models/otp");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function sendOtpToPhoneNumber(phoneNumber) {
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpEntry = new Otp({ phoneNumber, otp });
  await otpEntry.save();

  console.log(`OTP for ${phoneNumber}: ${otp}`);
}

exports.register = async (req, res) => {
  const { name, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ phoneNumber });
    if (user)
      return res.status(400).json({ message: "User already registered" });

    user = new User({ name, phoneNumber });
    await user.save();

    await sendOtpToPhoneNumber(phoneNumber);
    res
      .status(201)
      .json({ message: "User registered. OTP sent for verification." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    await sendOtpToPhoneNumber(phoneNumber);
    res.status(200).json({ message: "OTP sent to phone number." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ phoneNumber, otp });
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { isVerified: true },
      { new: true }
    );
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await otpRecord.deleteOne();
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found. Please register." });

    await sendOtpToPhoneNumber(phoneNumber);
    res.status(200).json({ message: "OTP sent for login." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
