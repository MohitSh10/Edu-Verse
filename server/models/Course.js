const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName:       { type: String, required: true, trim: true },
    description:      { type: String, required: true },
    instructor:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    whatYouWillLearn: { type: String },
    courseContent:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    ratingAndReview:  [{ type: mongoose.Schema.Types.ObjectId, ref: "RatingAndReview" }],
    price:     { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    tag:       { type: [String], default: [] },
    category:  { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    instructions: { type: [String], default: [] },
    requirements:  { type: [String], default: [] },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "All Levels"], default: "All Levels" },
    language: { type: String, default: "English" },
    status:   { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft" },
    // Analytics
    totalViews:     { type: Number, default: 0 },
    totalRevenue:   { type: Number, default: 0 },
    // Duration (auto-computed from sub-sections)
    totalDuration:  { type: Number, default: 0 }, // in seconds
  },
  { timestamps: true }
);

// Virtual for average rating
courseSchema.virtual("averageRating").get(function () {
  return this._averageRating || 0;
});

module.exports = mongoose.model("Course", courseSchema);
