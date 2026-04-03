import { useState, useEffect, useCallback } from "react";
import { HiOutlineSearch, HiOutlineTrash, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { getAdminCourses, deleteAdminCourse, updateCourseStatus } from "../../../../services/adminAPI";
import { Spinner } from "../../../common/index";

const STATUS_COLORS = {
  Published: { bg: "rgba(0,229,160,0.12)", text: "#00e5a0" },
  Draft:     { bg: "rgba(245,166,35,0.12)", text: "#f5a623" },
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const load = useCallback(async (s = search, st = statusFilter) => {
    setLoading(true);
    const res = await getAdminCourses({
      search: s || undefined,
      status: st === "all" ? undefined : st,
      limit: 50,
    });
    setCourses(res.data || []);
    setTotal(res.total || 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, []);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => load(val, statusFilter), 400));
  };

  const handleStatusFilter = (st) => {
    setStatusFilter(st);
    load(search, st);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    const updated = await updateCourseStatus(id, newStatus);
    if (updated) setCourses(prev => prev.map(c => c._id === id ? { ...c, status: updated.status } : c));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course permanently? All enrollments will be removed.")) return;
    const ok = await deleteAdminCourse(id);
    if (ok) setCourses(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-text)" }}>
          Course Management
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "13px" }}>{total} courses total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--color-muted)" }} />
          <input
            className="form-input pl-9"
            placeholder="Search courses..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "Published", "Draft"].map(s => (
            <button key={s} onClick={() => handleStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: statusFilter === s ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                color: statusFilter === s ? "#f5a623" : "var(--color-muted)",
                border: `1px solid ${statusFilter === s ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : courses.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <p style={{ color: "var(--color-muted)" }}>No courses found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {courses.map(course => (
            <div key={course._id} className="glass-card p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }} className="truncate">
                  {course.courseName}
                </p>
                <p style={{ color: "var(--color-muted)", fontSize: "12px", marginTop: "2px" }}>
                  by {course.instructor?.firstName} {course.instructor?.lastName} · {course.category?.name}
                </p>
              </div>

              {/* Price */}
              <span style={{ color: "#f5a623", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
              </span>

              {/* Students */}
              <span style={{ color: "var(--color-muted)", fontSize: "12px", flexShrink: 0 }}>
                {course.studentsEnrolled?.length || 0} students
              </span>

              {/* Status Badge */}
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                style={{ background: STATUS_COLORS[course.status]?.bg, color: STATUS_COLORS[course.status]?.text }}>
                {course.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleToggleStatus(course._id, course.status)}
                  title={course.status === "Published" ? "Unpublish" : "Publish"}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: course.status === "Published" ? "rgba(245,166,35,0.1)" : "rgba(0,229,160,0.1)",
                    color: course.status === "Published" ? "#f5a623" : "#00e5a0",
                    border: `1px solid ${course.status === "Published" ? "rgba(245,166,35,0.2)" : "rgba(0,229,160,0.2)"}`,
                  }}>
                  {course.status === "Published" ? <HiOutlineEyeOff size={15} /> : <HiOutlineEye size={15} />}
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  title="Delete Course"
                  className="p-2 rounded-lg transition-all"
                  style={{ background: "rgba(255,77,109,0.08)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.15)" }}>
                  <HiOutlineTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
