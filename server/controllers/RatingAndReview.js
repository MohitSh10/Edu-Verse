const { RatingAndReview } = require("../models/index");
const Course = require("../models/Course");
const User = require("../models/User");

// ─── Create Rating & Review ───────────────────────────────────────────────────
exports.createRatingAndReview = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user._id;

    // Check enrollment
    const course = await Course.findOne({ _id: courseId, studentsEnrolled: userId });
    if (!course) {
      return res.status(403).json({ success: false, message: "You must be enrolled to review this course." });
    }

    // Check duplicate
    const existing = await RatingAndReview.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already reviewed this course." });
    }

    const ratingReview = await RatingAndReview.create({ user: userId, rating, review, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $push: { ratingAndReview: ratingReview._id } });

    const populated = await ratingReview.populate("user", "firstName lastName image");
    return res.status(201).json({ success: true, message: "Review submitted!", data: populated });
  } catch (error) {
    console.error("createRatingAndReview error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit review." });
  }
};

// ─── Get Course Reviews ───────────────────────────────────────────────────────
exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await RatingAndReview.find({ course: courseId })
      .populate("user", "firstName lastName image")
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return res.status(200).json({ success: true, data: { reviews, avgRating, total: reviews.length } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews." });
  }
};

// ─── Get All Reviews (homepage) ───────────────────────────────────────────────
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await RatingAndReview.find({ rating: { $gte: 4 } })
      .populate("user", "firstName lastName image")
      .populate("course", "courseName")
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);

    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch reviews." });
  }
};

// ─── Delete Review ────────────────────────────────────────────────────────────
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await RatingAndReview.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });

    if (review.user.toString() !== req.user._id.toString() && req.user.accountType !== "Admin") {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    await Course.findByIdAndUpdate(review.course, { $pull: { ratingAndReview: reviewId } });
    await RatingAndReview.findByIdAndDelete(reviewId);

    return res.status(200).json({ success: true, message: "Review deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete review." });
  }
};
