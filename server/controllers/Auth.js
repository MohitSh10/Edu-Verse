const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
const Profile = require("../models/Profile");
const { OTP } = require("../models/index");
const mailSender = require("../utils/mailSender");
const { otpTemplate } = require("../mail/templates/otpTemplate");
const { passwordResetTemplate } = require("../mail/templates/passwordResetTemplate");
const crypto = require("crypto");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─── Send OTP ─────────────────────────────────────────────────────────────────
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered with this email." });
    }

    let otp;
    let isUnique = false;
    while (!isUnique) {
      otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      const existing = await OTP.findOne({ otp });
      if (!existing) isUnique = true;
    }

    await OTP.create({ email, otp });
    await mailSender(email, "Email Verification - EdTech Platform", otpTemplate(otp));

    return res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (error) {
    console.error("sendOTP error:", error);
    return res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// ─── Signup ───────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    // Validate OTP
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);

    // Default profile image using UI Avatars
    const profileImage = `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}+${lastName}`;

    // Create profile
    const profile = await Profile.create({ gender: "Prefer not to say", about: "", contactNumber: "" });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: accountType || "Student",
      additionalDetails: profile._id,
      image: profileImage,
      emailVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: { id: user._id, firstName, lastName, email, accountType: user.accountType, image: user.image },
    });
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({ success: false, message: "Signup failed. Please try again." });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password").populate("additionalDetails");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (!user.active) {
      return res.status(403).json({ success: false, message: "Account deactivated. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      image: user.image,
      additionalDetails: user.additionalDetails,
      courses: user.courses,
      courseProgress: user.courseProgress,
    };

    return res.cookie("token", token, COOKIE_OPTIONS).status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: "Login failed. Please try again." });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie("token").json({ success: true, message: "Logged out successfully." });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists
      return res.status(200).json({ success: true, message: "If this email is registered, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/update-password/${resetToken}`;
    await mailSender(email, "Password Reset Request", passwordResetTemplate(resetUrl, user.firstName));

    return res.status(200).json({ success: true, message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ success: false, message: "Failed to send reset email." });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    user.password = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ success: false, message: "Password reset failed." });
  }
};

// ─── Change Password (authenticated) ─────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match." });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password." });
    }

    user.password = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({ success: false, message: "Password change failed." });
  }
};
