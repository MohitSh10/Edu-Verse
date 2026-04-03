const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, default: "" },
  email:       { type: String, required: true },
  phoneNumber: { type: String, default: "" },
  message:     { type: String, required: true },
  status:      { type: String, enum: ["unread", "read", "resolved"], default: "unread" },
  adminReply:  { type: String, default: "" },
  repliedAt:   { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
