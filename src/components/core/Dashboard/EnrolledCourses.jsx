import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEnrolledCourses } from "../../../services/profileAPI";
import { apiConnector, endpoints } from "../../../services/apiConnector";
import { Spinner } from "../../common/index";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  HiOutlineBookOpen, HiOutlineLightningBolt, HiOutlineCheckCircle, HiOutlineTrash,
} from "react-icons/hi";
import { FaPlay } from "react-icons/fa";
import toast from "react-hot-toast";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [removingId, setRemovingId] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    getEnrolledCourses().then((data) => {
      setCourses(data || []);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (courseId) => {
    setRemovingId(courseId);
    try {
      const res = await apiConnector("POST", endpoints.UNENROLL_COURSE, { courseId });
      if (res.data.success) {
        setCourses(prev => prev.filter(c => c._id !== courseId));
        toast.success("Course removed from your list.");
      } else {
        toast.error(res.data.message || "Failed to remove course.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove course.");
    } finally {
      setRemovingId(null);
      setConfirmRemove(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const filtered = courses.filter((c) => {
    if (filter === "inprogress") return (c.progressPercentage || 0) > 0 && (c.progressPercentage || 0) < 100;
    if (filter === "completed") return (c.progressPercentage || 0) === 100;
    if (filter === "notstarted") return (c.progressPercentage || 0) === 0;
    return true;
  });

  const totalCompleted = courses.filter((c) => (c.progressPercentage || 0) === 100).length;
  const inProgress = courses.filter((c) => (c.progressPercentage || 0) > 0 && (c.progressPercentage || 0) < 100).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-richblack-5">My Learning</h1>
          <p className="text-richblack-400 text-sm mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Link to="/" className="btn-primary text-sm px-4 py-2">+ Explore More</Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 bg-richblack-800 border border-richblack-700 rounded-2xl">
          <HiOutlineBookOpen className="mx-auto text-richblack-500 mb-4" size={48} />
          <p className="text-richblack-400 mb-2 font-medium">No courses yet</p>
          <p className="text-richblack-500 text-sm mb-6">Discover expert-led courses to start your journey</p>
          <Link to="/" className="btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-4 text-center">
              <HiOutlineBookOpen className="mx-auto text-richyellow-50 mb-1" size={22} />
              <p className="text-richblack-5 font-bold text-xl">{courses.length}</p>
              <p className="text-richblack-400 text-xs">Total</p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-4 text-center">
              <HiOutlineLightningBolt className="mx-auto text-blue-100 mb-1" size={22} />
              <p className="text-richblack-5 font-bold text-xl">{inProgress}</p>
              <p className="text-richblack-400 text-xs">In Progress</p>
            </div>
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-4 text-center">
              <HiOutlineCheckCircle className="mx-auto text-caribbeangreen-50 mb-1" size={22} />
              <p className="text-richblack-5 font-bold text-xl">{totalCompleted}</p>
              <p className="text-richblack-400 text-xs">Completed</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5 bg-richblack-800 border border-richblack-700 rounded-xl p-1.5 w-fit">
            {[
              { key: "all", label: "All" },
              { key: "inprogress", label: "In Progress" },
              { key: "completed", label: "Completed" },
              { key: "notstarted", label: "Not Started" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-richyellow-50 text-richblack-900"
                    : "text-richblack-400 hover:text-richblack-25"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Course List */}
          <div className="space-y-4">
            {filtered.map((course) => {
              const progress = course.progressPercentage || 0;
              const resumeLink = course.lastAccessedSubSection
                ? `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.lastAccessedSubSection}`
                : `/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`;

              return (
                <div key={course._id}
                  className="bg-richblack-800 border border-richblack-700 rounded-2xl p-5 flex gap-4 items-start hover:border-richblack-600 transition-colors group">

                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img src={course.thumbnail} alt={course.courseName}
                      className="w-28 h-[72px] object-cover rounded-xl" />
                    {progress === 100 && (
                      <div className="absolute inset-0 bg-caribbeangreen-50/20 rounded-xl flex items-center justify-center">
                        <HiOutlineCheckCircle className="text-caribbeangreen-50" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-richblack-5 font-semibold text-sm truncate">{course.courseName}</p>
                    <p className="text-richblack-400 text-xs mt-0.5">
                      {course.instructor?.firstName} {course.instructor?.lastName}
                    </p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-richblack-400">
                          {progress === 0 ? "Not started" : progress === 100 ? "Completed! 🎉" : "In progress"}
                        </span>
                        <span className={`font-semibold ${
                          progress === 100 ? "text-caribbeangreen-50" : "text-richyellow-50"}`}>
                          {progress}%
                        </span>
                      </div>
                      <ProgressBar
                        completed={progress}
                        bgColor={progress === 100 ? "#00C28B" : "#FFD60A"}
                        baseBgColor="#2C333F"
                        height="6px"
                        labelSize="0px"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link to={resumeLink}
                      className={`flex items-center gap-2 text-xs whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold transition-all ${
                        progress === 100
                          ? "bg-caribbeangreen-50/20 text-caribbeangreen-50 border border-caribbeangreen-50/30 hover:bg-caribbeangreen-50/30"
                          : "btn-primary"
                      }`}>
                      <FaPlay size={10} />
                      {progress === 100 ? "Rewatch" : progress > 0 ? "Resume" : "Start"}
                    </Link>

                    {confirmRemove === course._id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleRemove(course._id)}
                          disabled={removingId === course._id}
                          className="flex-1 text-xs px-3 py-2 rounded-xl font-semibold transition-all"
                          style={{ background: "rgba(255,77,109,0.15)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.3)" }}>
                          {removingId === course._id ? "..." : "Yes, remove"}
                        </button>
                        <button
                          onClick={() => setConfirmRemove(null)}
                          className="text-xs px-3 py-2 rounded-xl font-semibold transition-all text-richblack-400 hover:text-richblack-25"
                          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmRemove(course._id)}
                        className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl font-medium transition-all text-richblack-400 hover:text-pink-200"
                        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                        title="Remove course">
                        <HiOutlineTrash size={13} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-center text-richblack-500 py-8">No courses match this filter.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
