const { Category } = require("../models/index");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name required." });

    const category = await Category.create({ name, description, icon });
    return res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Category already exists." });
    }
    return res.status(500).json({ success: false, message: "Failed to create category." });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, "name description icon courses");
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories." });
  }
};

exports.getCategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      match: { status: "Published" },
      populate: [
        { path: "instructor", select: "firstName lastName image" },
        { path: "ratingAndReview" },
      ],
    });

    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    // Other categories (for sidebar)
    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate({
        path: "courses",
        match: { status: "Published" },
        options: { limit: 5 },
      });

    // Top selling courses across all categories
    const topCourses = await Course.find({ status: "Published" })
      .populate("instructor", "firstName lastName image")
      .sort({ studentsEnrolled: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: { selectedCategory, otherCategories, topCourses },
    });
  } catch (error) {
    console.error("getCategoryPageDetails error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch category details." });
  }
};
