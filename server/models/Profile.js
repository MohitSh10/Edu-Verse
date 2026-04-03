const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender:      { type: String, enum: ["Male", "Female", "Other", "Prefer not to say"], default: "Prefer not to say" },
  dateOfBirth: { type: String, default: "" },
  about:       { type: String, trim: true, default: "" },
  contactNumber: { type: String, trim: true, default: "" },
  // Instructor-specific
  socialLinks: {
    website:  { type: String, default: "" },
    twitter:  { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
    youtube:  { type: String, default: "" },
  },
});

module.exports = mongoose.model("Profile", profileSchema);
