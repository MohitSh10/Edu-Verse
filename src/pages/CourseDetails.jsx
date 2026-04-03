import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsPlayCircle, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { HiOutlineClock, HiOutlineUsers, HiOutlineAcademicCap, HiOutlineShieldCheck } from "react-icons/hi";
import { MdOutlineLanguage, MdVerified } from "react-icons/md";
import { FaCheckCircle, FaArrowRight, FaStar, FaTag } from "react-icons/fa";
import { fetchCourseDetails } from "../services/courseAPI";
import { addToCart, clearCart } from "../redux/slices/cartSlice";
import { enrollFreeCourse } from "../services/paymentAPI";
import { setUser } from "../redux/slices/profileSlice";
import { apiConnector, endpoints } from "../services/apiConnector";
import { RatingStars, Spinner } from "../components/common/index";
import MockPayment from "../components/common/MockPayment";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

function secToHM(sec) {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);
  const { user } = useSelector(s => s.profile);
  const { cart } = useSelector(s => s.cart);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [showPayment, setShowPayment] = useState(false);

  const isEnrolled = user?.courses?.some(c =>
    (c?._id?.toString() ?? c?.toString()) === courseId
  );
  const inCart = cart.some(c => c._id === courseId);

  useEffect(() => {
    setLoading(true);
    fetchCourseDetails(courseId).then(data => {
      if (data?.data) setCourse(data.data);
      setLoading(false);
    });
  }, [courseId]);

  const toggleSection = id => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePaymentSuccess = async (paymentId) => {
    setShowPayment(false);
    const toastId = toast.loading("Enrolling you...");
    try {
      const res = await apiConnector("POST", endpoints.VERIFY_PAYMENT, {
        razorpay_order_id: "mock_order_" + Date.now(),
        razorpay_payment_id: paymentId,
        razorpay_signature: "mock_sig_" + Date.now(),
        courses: [courseId],
      });
      if (!res.data.success) throw new Error(res.data.message);
      // Refresh user profile so isEnrolled updates immediately
      const profileRes = await apiConnector("GET", endpoints.GET_PROFILE);
      if (profileRes.data.success) {
        dispatch(setUser(profileRes.data.data));
        localStorage.setItem("user", JSON.stringify(profileRes.data.data));
      }
      dispatch(clearCart());
      toast.success("🎉 Enrolled successfully!", { id: toastId });
      navigate("/dashboard/enrolled-courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed", { id: toastId });
    }
  };

  const handleEnroll = () => {
    if (!token) return navigate("/login");
    if (course.price === 0) {
      dispatch(enrollFreeCourse(courseId, navigate));
    } else {
      setShowPayment(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <Spinner size="lg" />
    </div>
  );
  if (!course) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)", color: "var(--color-muted)" }}>
      Course not found.
    </div>
  );

  const totalLectures = course.courseContent?.reduce((a, s) => a + (s.subSection?.length || 0), 0) || 0;
  const avgRating = course.ratingAndReview?.length
    ? (course.ratingAndReview.reduce((a, r) => a + r.rating, 0) / course.ratingAndReview.length).toFixed(1)
    : "4.5";

  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-16 px-6"
        style={{
          background: isLight
            ? "linear-gradient(135deg, #dce8f5 0%, #ccdff0 100%)"
            : "linear-gradient(135deg, #061525 0%, #0a2040 100%)",
          borderBottom: "1px solid var(--color-border)"
        }}>
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />

        <div className="max-w-maxContent mx-auto grid md:grid-cols-3 gap-10 relative z-10">
          <div className="md:col-span-2">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.tag?.slice(0, 3).map(t => (
                <span key={t} className="badge badge-blue text-xs">{t}</span>
              ))}
              {course.level && <span className="badge badge-gold text-xs">{course.level}</span>}
            </div>

            <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(24px, 4vw, 36px)", color: "var(--color-text)", marginBottom: "12px", lineHeight: 1.2 }}>
              {course.courseName}
            </h1>

            <p style={{ color: "var(--color-muted)", marginBottom: "20px", lineHeight: "1.7", fontSize: "15px" }} className="line-clamp-3">
              {course.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 mb-5">
              <div className="flex items-center gap-2">
                <span style={{ color: "#f5a623", fontWeight: 700, fontSize: "15px" }}>{avgRating}</span>
                <RatingStars review_count={parseFloat(avgRating)} Star_Size={14} />
                <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>({course.ratingAndReview?.length || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "var(--color-muted)", fontSize: "13px" }}>
                <HiOutlineUsers size={15} /> {(course.studentsEnrolled?.length || 0).toLocaleString()} students
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "var(--color-muted)", fontSize: "13px" }}>
                <MdOutlineLanguage size={15} /> {course.language || "English"}
              </div>
              <div className="flex items-center gap-1.5" style={{ color: "var(--color-muted)", fontSize: "13px" }}>
                <HiOutlineClock size={15} /> {totalLectures} lectures
              </div>
            </div>

            <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
              Created by{" "}
              <span style={{ color: "#f5a623", fontWeight: 600 }}>
                {course.instructor?.firstName} {course.instructor?.lastName}
              </span>
            </p>
          </div>

          {/* Sticky card — desktop */}
          <div className="hidden md:block">
            <div className="rounded-2xl overflow-hidden sticky top-20"
              style={{
                background: isLight ? "rgba(255,255,255,0.98)" : "rgba(2,11,24,0.95)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(20px)"
              }}>
              {course.thumbnail && (
                <img src={course.thumbnail} alt={course.courseName} className="w-full aspect-video object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "#f5a623" }}>
                    {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
                  </p>
                  {course.price > 0 && (
                    <p style={{ color: "var(--color-muted)", textDecoration: "line-through", fontSize: "16px" }}>
                      ₹{Math.round(course.price * 1.3).toLocaleString()}
                    </p>
                  )}
                  {course.price > 0 && <span className="badge badge-green text-xs">30% OFF</span>}
                </div>

                {isEnrolled ? (
                  <button onClick={() => navigate(`/view-course/${courseId}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                    className="btn-primary w-full justify-center py-4">
                    Continue Learning <FaArrowRight size={14} />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button onClick={handleEnroll} className="btn-primary w-full justify-center py-4">
                      {course.price === 0 ? "Enroll for Free" : "Buy Now"}
                    </button>
                    {course.price > 0 && !inCart && (
                      <button onClick={() => dispatch(addToCart(course))} className="btn-secondary w-full justify-center py-3">
                        Add to Cart
                      </button>
                    )}
                    {inCart && (
                      <button onClick={() => navigate("/dashboard/cart")} className="btn-secondary w-full justify-center py-3">
                        Go to Cart →
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    [HiOutlineShieldCheck, "30-day money-back guarantee"],
                    [FaTag, "Lifetime access after purchase"],
                    [MdVerified, "Certificate of completion"],
                  ].map(([Icon, text]) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon size={13} style={{ color: "#00e5a0", flexShrink: 0 }} />
                      <span style={{ color: "var(--color-muted)", fontSize: "12px" }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-maxContent mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-10">

          {/* What you'll learn */}
          {course.whatYouWillLearn && (
            <section className="glass-card p-7">
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "20px", marginBottom: "16px" }}>
                What You'll Learn
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.split("\n").filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <FaCheckCircle size={14} style={{ color: "#00e5a0", flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6" }}>{line}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course Content */}
          <section>
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "20px", marginBottom: "6px" }}>
              Course Content
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: "13px", marginBottom: "16px" }}>
              {course.courseContent?.length} sections · {totalLectures} lectures
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {course.courseContent?.map((section, si) => (
                <div key={section._id} style={{ borderBottom: si < course.courseContent.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <button onClick={() => toggleSection(section._id)}
                    className="w-full flex items-center justify-between px-5 py-4 transition-colors"
                    style={{ background: openSections[section._id] ? "rgba(245,166,35,0.06)" : isLight ? "rgba(0,0,0,0.03)" : "rgba(6,21,37,0.8)" }}>
                    <span style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "14px" }}>{section.sectionName}</span>
                    <div className="flex items-center gap-3" style={{ color: "var(--color-muted)", fontSize: "12px" }}>
                      <span>{section.subSection?.length} lectures</span>
                      {openSections[section._id] ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                    </div>
                  </button>
                  {openSections[section._id] && (
                    <div style={{ background: isLight ? "rgba(0,0,0,0.02)" : "rgba(2,11,24,0.5)" }}>
                      {section.subSection?.map(sub => (
                        <div key={sub._id} className="flex items-center gap-3 px-5 py-3"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <BsPlayCircle size={14} style={{ color: "var(--color-muted)", flexShrink: 0 }} />
                          <span style={{ color: "var(--color-muted)", fontSize: "13px", flex: 1 }}>{sub.title}</span>
                          {sub.timeDuration > 0 && (
                            <span style={{ color: "var(--color-muted)", fontSize: "11px" }}>{secToHM(sub.timeDuration)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          {course.ratingAndReview?.length > 0 && (
            <section>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "20px", marginBottom: "16px" }}>
                Student Reviews
              </h2>
              <div className="space-y-5">
                {course.ratingAndReview.slice(0, 5).map(r => (
                  <div key={r._id} className="glass-card p-5 flex gap-4">
                    <img src={r.user?.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>{r.user?.firstName} {r.user?.lastName}</p>
                        <div className="flex">
                          {[1,2,3,4,5].map(i => <FaStar key={i} size={11} style={{ color: i <= r.rating ? "#f5a623" : "#3d6480" }} />)}
                        </div>
                      </div>
                      <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6" }}>{r.review}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-5">
          {/* Mobile price card */}
          <div className="md:hidden glass-card p-5">
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "#f5a623", marginBottom: "12px" }}>
              {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
            </p>
            {isEnrolled ? (
              <button onClick={() => navigate(`/view-course/${courseId}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
                className="btn-primary w-full justify-center py-3">Continue Learning</button>
            ) : (
              <button onClick={handleEnroll} className="btn-primary w-full justify-center py-3">
                {course.price === 0 ? "Enroll Free" : "Buy Now"}
              </button>
            )}
          </div>

          {/* Instructor */}
          <div className="glass-card p-5">
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", marginBottom: "14px" }}>Instructor</h3>
            <div className="flex items-center gap-3 mb-3">
              <img src={course.instructor?.image} alt="" className="w-12 h-12 rounded-xl object-cover border-2" style={{ borderColor: "rgba(245,166,35,0.3)" }} />
              <div>
                <div className="flex items-center gap-1">
                  <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <MdVerified size={14} style={{ color: "#00d4ff" }} />
                </div>
                <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>Verified Instructor</p>
              </div>
            </div>
            {course.instructor?.additionalDetails?.about && (
              <p style={{ color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.7" }} className="line-clamp-4">
                {course.instructor.additionalDetails.about}
              </p>
            )}
          </div>

          {/* Course includes */}
          <div className="glass-card p-5">
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px", fontSize: "15px" }}>This Course Includes</h3>
            <div className="space-y-2.5">
              {[
                [HiOutlineClock, `${totalLectures} video lectures`],
                [HiOutlineAcademicCap, `${course.level || "Beginner"} level`],
                [MdOutlineLanguage, `${course.language || "English"}`],
                [MdVerified, "Certificate of completion"],
                [HiOutlineShieldCheck, "Lifetime access"],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={15} style={{ color: "#f5a623", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-muted)", fontSize: "13px" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Mock payment */}
      {showPayment && (
        <MockPayment
          amount={course.price}
          courses={[course]}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
