const express = require("express");
const router = express.Router();
const {
  createCourse, editCourse, deleteCourse, publishCourse,
  getAllCourses, getCourseDetails, getInstructorCourses,
  createSection, updateSection, deleteSection,
  createSubSection, updateSubSection, deleteSubSection,
} = require("../controllers/Course");
const {
  createCategory, getAllCategories, getCategoryPageDetails,
} = require("../controllers/Category");
const {
  createRatingAndReview, getCourseReviews, getAllReviews, deleteReview,
} = require("../controllers/RatingAndReview");
const { auth, isInstructor, isAdmin, isStudent } = require("../middlewares/auth");
const { uploadImage, uploadVideoWithPdf } = require("../utils/upload");

// Public
router.get("/", getAllCourses);
router.get("/reviews/all", getAllReviews);
router.get("/categories/all", getAllCategories);
router.get("/categories/:categoryId", getCategoryPageDetails);

// Instructor (must be before generic :courseId)
router.get("/instructor/my-courses", auth, isInstructor, getInstructorCourses);
router.post("/", auth, isInstructor, uploadImage.single("thumbnail"), createCourse);
router.put("/:courseId", auth, isInstructor, uploadImage.single("thumbnail"), editCourse);
router.delete("/:courseId", auth, isInstructor, deleteCourse);
router.patch("/:courseId/publish", auth, isInstructor, publishCourse);

// Public (generic routes last)
router.get("/:courseId", getCourseDetails);
router.get("/:courseId/reviews", getCourseReviews);

// Sections
router.post("/section/add", auth, isInstructor, createSection);
router.put("/section/update", auth, isInstructor, updateSection);
router.delete("/section/delete", auth, isInstructor, deleteSection);

// SubSections — accepts video + pdf in one request
const subSectionUpload = uploadVideoWithPdf.fields([
  { name: "video", maxCount: 1 },
  { name: "pdf",   maxCount: 1 },
]);
router.post("/subsection/add",    auth, isInstructor, subSectionUpload, createSubSection);
router.put("/subsection/update",  auth, isInstructor, subSectionUpload, updateSubSection);
router.delete("/subsection/delete", auth, isInstructor, deleteSubSection);

// Reviews (student)
router.post("/review", auth, isStudent, createRatingAndReview);
router.delete("/review/:reviewId", auth, deleteReview);

// Admin
router.post("/categories", auth, isAdmin, createCategory);

module.exports = router;
