const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, trim: true, lowercase: true },
    password:  { type: String, required: true, select: false },
    accountType: {
      type: String,
      enum: ["Admin", "Student", "Instructor"],
      required: true,
    },
    additionalDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    courseProgress: [{ type: mongoose.Schema.Types.ObjectId, ref: "CourseProgress" }],
    image: { type: String, default: "" },
    // Auth tokens
    token: { type: String, select: false },
    tokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date },
    // Account status
    active: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    // Instructor approval (Admin can approve/reject)
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.token;
  delete obj.resetPasswordToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
