// ─── routes/User.js ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const {
  sendOTP, signup, login, logout, forgotPassword, resetPassword, changePassword,
} = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

router.post("/send-otp", sendOTP);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);

module.exports = router;
