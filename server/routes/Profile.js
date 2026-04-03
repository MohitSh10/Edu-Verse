const express = require("express");
const router = express.Router();
const {
  getMyProfile, updateProfile, updateProfilePicture,
  deleteAccount, getEnrolledCourses, getInstructorStats,
} = require("../controllers/Profile");
const { auth, isInstructor } = require("../middlewares/auth");
const upload = require("../utils/upload");

router.get("/me", auth, getMyProfile);
router.put("/update", auth, updateProfile);
router.put("/picture", auth, upload.single("profileImage"), updateProfilePicture);
router.delete("/delete", auth, deleteAccount);
router.get("/enrolled-courses", auth, getEnrolledCourses);
router.get("/instructor-stats", auth, isInstructor, getInstructorStats);

module.exports = router;
