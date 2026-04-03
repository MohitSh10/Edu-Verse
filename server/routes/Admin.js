const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const {
  getStats,
  getMessages, updateMessage, deleteMessage,
  getUsers, toggleUserStatus, changeUserRole, deleteUser,
  getAllCoursesAdmin, adminDeleteCourse, updateCourseStatus,
  getCategories, createCategoryAdmin, deleteCategoryAdmin,
} = require("../controllers/Admin");

// All admin routes require auth + admin role
router.use(auth, isAdmin);

// Stats
router.get("/stats", getStats);

// Contact Messages
router.get("/messages", getMessages);
router.put("/messages/:id", updateMessage);
router.delete("/messages/:id", deleteMessage);

// Users
router.get("/users", getUsers);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.put("/users/:id/role", changeUserRole);
router.delete("/users/:id", deleteUser);

// Courses
router.get("/courses", getAllCoursesAdmin);
router.delete("/courses/:id", adminDeleteCourse);
router.put("/courses/:id/status", updateCourseStatus);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategoryAdmin);
router.delete("/categories/:id", deleteCategoryAdmin);

module.exports = router;
