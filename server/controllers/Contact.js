const ContactMessage = require("../models/ContactMessage");
const mailSender = require("../utils/mailSender");
const { contactTemplate } = require("../mail/templates/contactTemplate");

exports.contactUs = async (req, res) => {
  try {
    const { firstName, lastName, email, message, phoneNumber } = req.body;
    if (!firstName || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    // Save to DB so admin can view it
    await ContactMessage.create({
      firstName,
      lastName: lastName || "",
      email,
      message,
      phoneNumber: phoneNumber || "",
    });

    // Send emails — best effort, don't fail if mail fails
    try {
      await mailSender(
        process.env.MAIL_USER,
        `New Contact Form Submission from ${firstName} ${lastName || ""}`,
        contactTemplate({ firstName, lastName, email, message, phoneNumber })
      );
      await mailSender(
        email,
        "We received your message!",
        `<p>Hi ${firstName},</p><p>Thanks for reaching out! We'll get back to you within 24 hours.</p><p>— EduVerse Team</p>`
      );
    } catch (mailErr) {
      console.error("Mail send error:", mailErr.message);
    }

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("contactUs error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
};
