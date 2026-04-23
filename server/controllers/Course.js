const Course = require("../models/Course");
const { Category, Section, SubSection } = require("../models/index");
const User = require("../models/User");

// ─── Create Course ────────────────────────────────────────────────────────────
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName, description, whatYouWillLearn,
      price, category, tag, status, instructions, requirements, level, language, thumbnail,
    } = req.body;

    if (!courseName || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "Required fields missing." });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return res.status(404).json({ success: false, message: "Category not found." });

    // req.file.path is the full Cloudinary URL when using multer-storage-cloudinary
    let thumbnailUrl = thumbnail || "";
    if (req.file) {
      thumbnailUrl = req.file.path;
    }

    const course = await Course.create({
      courseName,
      description,
      instructor: req.user._id,
      whatYouWillLearn,
      price: parseFloat(price),
      category: categoryDoc._id,
      tag: typeof tag === "string" ? JSON.parse(tag) : tag || [],
      thumbnail: thumbnailUrl,
      status: status || "Draft",
      instructions: typeof instructions === "string" ? JSON.parse(instructions) : instructions || [],
      requirements: typeof requirements === "string" ? JSON.parse(requirements) : requirements || [],
      level: level || "All Levels",
      language: language || "English",
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { courses: course._id } });
    await Category.findByIdAndUpdate(category, { $push: { courses: course._id } });

    return res.status(201).json({ success: true, message: "Course created successfully!", data: course });
  } catch (error) {
    console.error("createCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to create course." });
  }
};

// ─── Edit Course ──────────────────────────────────────────────────────────────
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const updates = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized to edit this course." });
    }

    if (req.file) {
      updates.thumbnail = req.file.path;
    }

    const updated = await Course.findByIdAndUpdate(courseId, updates, { new: true })
      .populate("instructor", "firstName lastName email image")
      .populate("category");

    return res.status(200).json({ success: true, message: "Course updated successfully!", data: updated });
  } catch (error) {
    console.error("editCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to update course." });
  }
};

// ─── Delete Course ────────────────────────────────────────────────────────────
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    // Remove course from enrolled students
    await User.updateMany({ courses: courseId }, { $pull: { courses: courseId } });
    // Remove from category
    await Category.findByIdAndUpdate(course.category, { $pull: { courses: courseId } });
    // Delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ success: true, message: "Course deleted successfully." });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete course." });
  }
};

// ─── Get All Published Courses ────────────────────────────────────────────────
exports.getAllCourses = async (req, res) => {
  try {
    const { category, level, minPrice, maxPrice, search, sort = "createdAt", page = 1, limit = 12 } = req.query;

    const filter = { status: "Published" };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { studentsEnrolled: -1 },
    };

    const courses = await Course.find(filter)
      .populate("instructor", "firstName lastName image")
      .populate("category", "name")
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: courses,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch courses." });
  }
};

// ─── Get Course Details ───────────────────────────────────────────────────────
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate({ path: "instructor", populate: { path: "additionalDetails" }, select: "-password" })
      .populate("category")
      .populate({ path: "ratingAndReview", populate: { path: "user", select: "firstName lastName image" } })
      .populate({
        path: "courseContent",
        populate: { path: "subSection", select: "title timeDuration description videoUrl resources" },
      });

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    // Increment view count
    await Course.findByIdAndUpdate(courseId, { $inc: { totalViews: 1 } });

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("getCourseDetails error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch course details." });
  }
};

// ─── Get Instructor Courses ───────────────────────────────────────────────────
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate("category", "name")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("getInstructorCourses error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch courses." });
  }
};

// ─── Publish Course ───────────────────────────────────────────────────────────
exports.publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to publish this course." });
    }

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { status: "Published" },
      { new: true }
    ).populate("instructor", "firstName lastName email image").populate("category");

    return res.status(200).json({ success: true, message: "Course published successfully!", data: updated });
  } catch (error) {
    console.error("publishCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to publish course." });
  }
};

// ─── Add Section ──────────────────────────────────────────────────────────────
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({ success: false, message: "Section name and course ID are required." });
    }

    const section = await Section.create({ sectionName });
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: section._id } },
      { new: true }
    ).populate({ path: "courseContent", populate: { path: "subSection" } });

    return res.status(201).json({ success: true, message: "Section added!", data: updatedCourse });
  } catch (error) {
    console.error("createSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to create section." });
  }
};

// ─── Update Section ───────────────────────────────────────────────────────────
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
    return res.status(200).json({ success: true, data: section });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update section." });
  }
};

// ─── Delete Section ───────────────────────────────────────────────────────────
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    await Course.findByIdAndUpdate(courseId, { $pull: { courseContent: sectionId } });
    await Section.findByIdAndDelete(sectionId);
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection" },
    });
    return res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete section." });
  }
};

// ─── Add SubSection ───────────────────────────────────────────────────────────
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description, videoUrl, timeDuration } = req.body;

    // req.files is set when using .fields([...])
    // req.files.video[0].path  → Cloudinary video URL
    // req.files.pdf[0].path    → Cloudinary PDF URL
    const videoFile = req.files?.video?.[0];
    const pdfFile   = req.files?.pdf?.[0];

    const resolvedVideoUrl = videoFile ? videoFile.path : videoUrl;

    if (!sectionId || !title || !resolvedVideoUrl) {
      return res.status(400).json({ success: false, message: "Section ID, title, and video are required." });
    }

    const subSectionData = {
      title,
      description,
      videoUrl: resolvedVideoUrl,
      timeDuration: timeDuration ? parseFloat(timeDuration) : 0,
    };

    // Attach PDF as a resource if uploaded
    if (pdfFile) {
      subSectionData.resources = [{
        title: pdfFile.originalname || "Lecture Notes",
        url:   pdfFile.path,
        type:  "pdf",
      }];
    }

    const subSection = await SubSection.create(subSectionData);

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSection._id } },
      { new: true }
    ).populate("subSection");

    return res.status(201).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("createSubSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to create sub-section." });
  }
};

// ─── Update SubSection ────────────────────────────────────────────────────────
exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, title, description, videoUrl, timeDuration } = req.body;
    if (!subSectionId) {
      return res.status(400).json({ success: false, message: "Sub-section ID is required." });
    }

    const videoFile = req.files?.video?.[0];
    const pdfFile   = req.files?.pdf?.[0];

    const updates = {};
    if (title) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (videoFile) {
      updates.videoUrl = videoFile.path;
    } else if (videoUrl) {
      updates.videoUrl = videoUrl;
    }
    if (timeDuration !== undefined) updates.timeDuration = parseFloat(timeDuration) || 0;

    if (pdfFile) {
      updates.$push = {
        resources: {
          title: pdfFile.originalname || "Lecture Notes",
          url:   pdfFile.path,
          type:  "pdf",
        },
      };
    }

    const updated = await SubSection.findByIdAndUpdate(subSectionId, updates, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Sub-section not found." });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("updateSubSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to update sub-section." });
  }
};

// ─── Delete SubSection ────────────────────────────────────────────────────────
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(400).json({ success: false, message: "Sub-section ID and section ID are required." });
    }

    await Section.findByIdAndUpdate(sectionId, { $pull: { subSection: subSectionId } });
    await SubSection.findByIdAndDelete(subSectionId);

    const updatedSection = await Section.findById(sectionId).populate("subSection");
    return res.status(200).json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("deleteSubSection error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete sub-section." });
  }
};
