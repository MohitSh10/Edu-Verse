const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const { CourseProgress } = require("../models/index");

// ─── Get My Profile ───────────────────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("additionalDetails");
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch profile." });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, about, contactNumber, gender, socialLinks } = req.body;
    const user = await User.findById(req.user._id);

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();

    // Update profile fields
    await Profile.findByIdAndUpdate(user.additionalDetails, {
      dateOfBirth, about, contactNumber, gender,
      ...(socialLinks && { socialLinks }),
    });

    const updated = await User.findById(req.user._id).populate("additionalDetails");
    return res.status(200).json({ success: true, message: "Profile updated!", data: updated });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
};

// ─── Update Profile Picture ───────────────────────────────────────────────────
exports.updateProfilePicture = async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || "";
    if (req.file) {
      // req.file.path is the Cloudinary secure URL
      imageUrl = req.file.path;
    }
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "No image provided." });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { image: imageUrl },
      { new: true }
    ).populate("additionalDetails");

    return res.status(200).json({ success: true, message: "Profile picture updated!", data: user });
  } catch (error) {
    console.error("updateProfilePicture error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile picture." });
  }
};

// ─── Delete Account ───────────────────────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Remove from enrolled courses
    await Course.updateMany(
      { studentsEnrolled: user._id },
      { $pull: { studentsEnrolled: user._id } }
    );

    // Delete profile
    await Profile.findByIdAndDelete(user.additionalDetails);
    // Delete user
    await User.findByIdAndDelete(user._id);

    return res.status(200).json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("deleteAccount error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete account." });
  }
};

// ─── Get Enrolled Courses ─────────────────────────────────────────────────────
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "courses",
      populate: [
        { path: "instructor", select: "firstName lastName image" },
        {
          path: "courseContent",
          populate: {
            path: "subSection",
            select: "title timeDuration description videoUrl resources",
          },
        },
      ],
    });

    // Attach progress to each course
    const coursesWithProgress = await Promise.all(
      user.courses.map(async (course) => {
        const progress = await CourseProgress.findOne({
          courseID: course._id,
          userId: req.user._id,
        });

        const totalVideos = course.courseContent.reduce(
          (acc, section) => acc + section.subSection.length, 0
        );
        const completedVideos = progress?.completedVideos?.length || 0;
        const completionPercentage = totalVideos > 0
          ? Math.round((completedVideos / totalVideos) * 100)
          : 0;

        return {
          ...course.toObject(),
          progressPercentage: completionPercentage,
          completedVideos: progress?.completedVideos || [],
          lastAccessedSubSection: progress?.lastAccessedSubSection,
        };
      })
    );

    return res.status(200).json({ success: true, data: coursesWithProgress });
  } catch (error) {
    console.error("getEnrolledCourses error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch enrolled courses." });
  }
};

// ─── Get Instructor Dashboard Stats ──────────────────────────────────────────
exports.getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate("ratingAndReview");

    const stats = courses.map((course) => {
      const totalRatings = course.ratingAndReview.length;
      const avgRating = totalRatings > 0
        ? course.ratingAndReview.reduce((acc, r) => acc + r.rating, 0) / totalRatings
        : 0;

      return {
        _id: course._id,
        courseName: course.courseName,
        thumbnail: course.thumbnail,
        price: course.price,
        totalStudents: course.studentsEnrolled.length,
        totalRevenue: course.price * course.studentsEnrolled.length,
        avgRating: avgRating.toFixed(1),
        totalRatings,
        status: course.status,
      };
    });

    const totals = {
      totalCourses: courses.length,
      totalStudents: stats.reduce((acc, c) => acc + c.totalStudents, 0),
      totalRevenue: stats.reduce((acc, c) => acc + c.totalRevenue, 0),
    };

    return res.status(200).json({ success: true, data: { courses: stats, totals } });
  } catch (error) {
    console.error("getInstructorStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
};
