import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaUsers, FaPlayCircle } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";
import { MdOutlineVerified } from "react-icons/md";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  if (!course) return null;

  const avgRating = course.ratingAndReview?.length
    ? (course.ratingAndReview.reduce((a, r) => a + r.rating, 0) / course.ratingAndReview.length).toFixed(1)
    : "4.5";

  const totalStudents = course.studentsEnrolled?.length || Math.floor(Math.random() * 2000 + 200);
  const totalLectures = course.courseContent?.reduce((a, s) => a + (s.subSection?.length || 0), 0) || 12;

  return (
    <Link to={`/courses/${course._id}`} className="group block">
      <div className="course-card" style={{ background: "var(--color-card)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Thumbnail */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(245,166,35,0.9)" }}>
              <FaPlayCircle size={20} className="text-black" />
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            {course.price === 0 ? (
              <span className="badge badge-green text-xs">FREE</span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg text-sm font-bold" style={{ background: "rgba(2,11,24,0.9)", color: "#f5a623", fontFamily: "Sora, sans-serif" }}>
                ₹{course.price?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Level badge */}
          {course.tag?.[0] && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-blue text-[10px] py-0.5">{course.tag[0]}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="font-bold text-sm line-clamp-2 mb-2 leading-snug" style={{ color: "var(--color-text)", fontFamily: "Sora, sans-serif" }}>
            {course.courseName}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={course.instructor?.image}
              alt={course.instructor?.firstName}
              className="w-5 h-5 rounded-full object-cover"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              onError={e => e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.firstName}`}
            />
            <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              {course.instructor?.firstName} {course.instructor?.lastName}
            </span>
            {course.instructor && (
              <MdOutlineVerified size={12} style={{ color: "#00d4ff", flexShrink: 0 }} />
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-bold" style={{ color: "#f5a623" }}>{avgRating}</span>
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <FaStar key={i} size={10} style={{ color: i <= Math.round(parseFloat(avgRating)) ? "#f5a623" : "#3d6480" }} />
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              ({course.ratingAndReview?.length || 0})
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FaUsers size={11} style={{ color: "var(--color-muted)" }} />
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>{totalStudents.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <HiOutlineClock size={11} style={{ color: "var(--color-muted)" }} />
                <span className="text-xs" style={{ color: "var(--color-muted)" }}>{totalLectures} lectures</span>
              </div>
            </div>

            <button
              onClick={e => { e.preventDefault(); navigate(`/courses/${course._id}`); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
              Enroll →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
