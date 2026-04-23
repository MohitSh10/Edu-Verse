const express = require("express");
const router = express.Router();
const {
  capturePayment, verifyPayment, enrollFree, updateCourseProgress, unenrollCourse,
} = require("../controllers/Payment");
const { auth, isStudent } = require("../middlewares/auth");

router.post("/capture", auth, isStudent, capturePayment);
router.post("/verify", auth, isStudent, verifyPayment);
router.post("/enroll-free", auth, isStudent, enrollFree);
router.post("/progress", auth, isStudent, updateCourseProgress);
router.post("/unenroll", auth, isStudent, unenrollCourse);

module.exports = router;
