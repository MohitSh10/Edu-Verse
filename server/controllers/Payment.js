const { instance: razorpay } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const { CourseProgress } = require("../models/index");
const mailSender = require("../utils/mailSender");
const { enrollmentEmailTemplate } = require("../mail/templates/enrollmentEmailTemplate");
const crypto = require("crypto");

// ─── Capture Payment (Create Order) ──────────────────────────────────────────
exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body; // array of courseIds
    if (!courses || !courses.length) {
      return res.status(400).json({ success: false, message: "No courses provided." });
    }

    let totalAmount = 0;
    for (const courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: `Course ${courseId} not found.` });
      }
      if (course.studentsEnrolled.includes(req.user._id)) {
        return res.status(400).json({ success: false, message: `Already enrolled in ${course.courseName}.` });
      }
      totalAmount += course.price;
    }

    const options = {
      amount: totalAmount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { courses: JSON.stringify(courses), userId: req.user._id.toString() },
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
        keyId: process.env.RAZORPAY_KEY,
      },
    });
  } catch (error) {
    console.error("capturePayment error:", error);
    return res.status(500).json({ success: false, message: "Payment initiation failed." });
  }
};

// ─── Verify Payment & Enroll ──────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;

    // Only verify Razorpay signature when real credentials are configured.
    // In mock/dev mode (no valid key), skip HMAC and trust the request.
    const isRazorpayConfigured =
      process.env.RAZORPAY_KEY &&
      process.env.RAZORPAY_KEY !== "your_razorpay_key" &&
      process.env.RAZORPAY_SECRET;

    if (isRazorpayConfigured) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed. Invalid signature." });
      }
    }

    // Enroll student in all courses
    await enrollStudentInCourses(req.user._id, courses);

    // Send confirmation email
    const user = await User.findById(req.user._id);
    const courseNames = await Course.find({ _id: { $in: courses } }).select("courseName");
    await mailSender(
      user.email,
      "Enrollment Confirmed!",
      enrollmentEmailTemplate(user.firstName, courseNames.map((c) => c.courseName))
    );

    return res.status(200).json({ success: true, message: "Payment verified! You are now enrolled." });
  } catch (error) {
    console.error("verifyPayment error:", error);
    return res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

// ─── Enroll in Free Course ────────────────────────────────────────────────────
exports.enrollFree = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    if (course.price > 0) return res.status(400).json({ success: false, message: "This is a paid course." });

    if (course.studentsEnrolled.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already enrolled." });
    }

    await enrollStudentInCourses(req.user._id, [courseId]);
    return res.status(200).json({ success: true, message: "Enrolled successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Enrollment failed." });
  }
};

// ─── Helper: Enroll student ───────────────────────────────────────────────────
const enrollStudentInCourses = async (userId, courseIds) => {
  for (const courseId of courseIds) {
    await Course.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { courses: courseId } });
    await CourseProgress.create({ courseID: courseId, userId, completedVideos: [] });
  }
};

// ─── Unenroll from Course ─────────────────────────────────────────────────────
exports.unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    if (!course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ success: false, message: "You are not enrolled in this course." });
    }

    await Course.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { courses: courseId } });
    await CourseProgress.deleteOne({ courseID: courseId, userId });

    return res.status(200).json({ success: true, message: "Unenrolled successfully." });
  } catch (error) {
    console.error("unenrollCourse error:", error);
    return res.status(500).json({ success: false, message: "Failed to unenroll." });
  }
};

// ─── Update Course Progress ───────────────────────────────────────────────────
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId, sectionId } = req.body;

    let progress = await CourseProgress.findOne({ courseID: courseId, userId: req.user._id });
    if (!progress) {
      return res.status(404).json({ success: false, message: "Course progress not found." });
    }

    if (!progress.completedVideos.includes(subSectionId)) {
      progress.completedVideos.push(subSectionId);
    }

    progress.lastAccessedSubSection = subSectionId;
    progress.lastAccessedSection = sectionId;

    // Calculate completion percentage
    const course = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: { path: "subSection", select: "_id" },
    });
    const totalVideos = course.courseContent.reduce((acc, s) => acc + s.subSection.length, 0);
    progress.completionPercentage = Math.round((progress.completedVideos.length / totalVideos) * 100);

    if (progress.completionPercentage === 100 && !progress.completed) {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    await progress.save();
    return res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error("updateCourseProgress error:", error);
    return res.status(500).json({ success: false, message: "Failed to update progress." });
  }
};
