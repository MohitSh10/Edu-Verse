const User = require("../models/User");
const Course = require("../models/Course");
const ContactMessage = require("../models/ContactMessage");
const { Category } = require("../models/index");
const mailSender = require("../utils/mailSender");

// ─── Overview Stats ───────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers, totalStudents, totalInstructors,
      totalCourses, publishedCourses,
      totalMessages, unreadMessages,
      totalCategories,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ accountType: "Student" }),
      User.countDocuments({ accountType: "Instructor" }),
      Course.countDocuments(),
      Course.countDocuments({ status: "Published" }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "unread" }),
      Category.countDocuments(),
    ]);

    const courses = await Course.find({ status: "Published" }).select("price studentsEnrolled");
    const totalRevenue = courses.reduce((sum, c) => sum + (c.price * (c.studentsEnrolled?.length || 0)), 0);
    const totalEnrollments = courses.reduce((sum, c) => sum + (c.studentsEnrolled?.length || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers, totalStudents, totalInstructors,
        totalCourses, publishedCourses,
        totalMessages, unreadMessages,
        totalCategories, totalRevenue, totalEnrollments,
      },
    });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};

// ─── Contact Messages ─────────────────────────────────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status && status !== "all" ? { status } : {};
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await ContactMessage.countDocuments(filter);
    return res.status(200).json({ success: true, data: messages, total });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch messages." });
  }
};

exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminReply !== undefined && adminReply !== "") {
      update.adminReply = adminReply;
      update.repliedAt = new Date();
      update.status = "resolved";
      const msg = await ContactMessage.findById(id);
      if (msg) {
        try {
          await mailSender(
            msg.email,
            "Reply from EduVerse Support",
            `<p>Hi ${msg.firstName},</p><p>${adminReply.replace(/\n/g, "<br/>")}</p><br/><p>— EduVerse Support Team</p>`
          );
        } catch (_) {}
      }
    }
    const updated = await ContactMessage.findByIdAndUpdate(id, update, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update message." });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Message deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete message." });
  }
};

// ─── User Management ──────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { accountType, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (accountType && accountType !== "all") filter.accountType = accountType;
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }
    const users = await User.find(filter)
      .select("-password -token -resetPasswordToken")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await User.countDocuments(filter);
    return res.status(200).json({ success: true, data: users, total });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot change your own status." });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    user.active = !user.active;
    await user.save();
    return res.status(200).json({
      success: true,
      data: user,
      message: `User ${user.active ? "activated" : "deactivated"} successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update user." });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { accountType } = req.body;
    if (!["Student", "Instructor", "Admin"].includes(accountType)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot change your own role." });
    }
    const user = await User.findByIdAndUpdate(id, { accountType }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to change role." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete yourself." });
    }
    await User.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};

// ─── Course Management ────────────────────────────────────────────────────────
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search) filter.courseName = new RegExp(search, "i");
    const courses = await Course.find(filter)
      .populate("instructor", "firstName lastName email")
      .populate("category", "name")
      .select("courseName price status studentsEnrolled thumbnail createdAt instructor category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Course.countDocuments(filter);
    return res.status(200).json({ success: true, data: courses, total });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch courses." });
  }
};

exports.adminDeleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    await User.updateMany({ courses: course._id }, { $pull: { courses: course._id } });
    await Category.findByIdAndUpdate(course.category, { $pull: { courses: course._id } });
    await Course.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Course deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete course." });
  }
};

exports.updateCourseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Published", "Draft"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update course status." });
  }
};

// ─── Category Management ──────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories." });
  }
};

exports.createCategoryAdmin = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name required." });
    const cat = await Category.create({ name, description: description || "", icon: icon || "📚" });
    return res.status(201).json({ success: true, data: cat });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Category already exists." });
    }
    return res.status(500).json({ success: false, message: "Failed to create category." });
  }
};

exports.deleteCategoryAdmin = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete category." });
  }
};
