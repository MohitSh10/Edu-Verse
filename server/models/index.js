const mongoose = require("mongoose");

// ─── Section ─────────────────────────────────────────────────────────────────
const sectionSchema = new mongoose.Schema({
  sectionName: { type: String, required: true },
  subSection:  [{ type: mongoose.Schema.Types.ObjectId, ref: "SubSection" }],
});
exports.Section = mongoose.model("Section", sectionSchema);

// ─── SubSection ───────────────────────────────────────────────────────────────
const subSectionSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  videoUrl:    { type: String },
  timeDuration: { type: Number, default: 0 }, // seconds
  // NEW: support for attachments / resources
  resources: [
    {
      title: { type: String },
      url:   { type: String },
      type:  { type: String, enum: ["pdf", "link", "image", "other"], default: "link" },
    },
  ],
});
exports.SubSection = mongoose.model("SubSection", subSectionSchema);

// ─── Category ─────────────────────────────────────────────────────────────────
const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  description: { type: String },
  courses:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  // NEW: icon for UI display
  icon:        { type: String, default: "" },
});
exports.Category = mongoose.model("Category", categorySchema);

// ─── OTP ──────────────────────────────────────────────────────────────────────
const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  otp:       { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "5m" }, // auto-delete after 5 min
});
exports.OTP = mongoose.model("OTP", otpSchema);

// ─── RatingAndReview ──────────────────────────────────────────────────────────
const ratingAndReviewSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    // NEW: helpful votes
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
exports.RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);

// ─── CourseProgress ───────────────────────────────────────────────────────────
const courseProgressSchema = new mongoose.Schema(
  {
    courseID:           { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedVideos:    [{ type: mongoose.Schema.Types.ObjectId, ref: "SubSection" }],
    // NEW: track last accessed lecture for resume feature
    lastAccessedSection:    { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    lastAccessedSubSection: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection" },
    completionPercentage:   { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);
exports.CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);
