import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUsers, HiOutlineBookOpen, HiOutlineMail, HiOutlineCurrencyRupee,
  HiOutlineAcademicCap, HiOutlineTrendingUp, HiOutlineCheckCircle, HiOutlineExclamationCircle,
} from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { getAdminStats, getAdminMessages } from "../../../../services/adminAPI";
import { Spinner } from "../../../common/index";

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p style={{ color: "var(--color-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ color: "var(--color-text)", fontSize: "24px", fontWeight: 800, fontFamily: "Sora, sans-serif", lineHeight: 1.2 }}>{value ?? "—"}</p>
        {sub && <p style={{ color: "var(--color-muted)", fontSize: "11px", marginTop: "2px" }}>{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats(),
      getAdminMessages({ status: "unread", limit: 5 }),
    ]).then(([s, m]) => {
      setStats(s);
      setRecentMessages(m.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "24px", color: "var(--color-text)" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "14px", marginTop: "4px" }}>
          Platform overview — manage users, courses, and messages.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiOutlineUsers} label="Total Users" value={stats?.totalUsers} sub={`${stats?.totalStudents} students`} color="#f5a623" bg="rgba(245,166,35,0.12)" />
        <StatCard icon={FaChalkboardTeacher} label="Instructors" value={stats?.totalInstructors} sub="active creators" color="#00d4ff" bg="rgba(0,212,255,0.12)" />
        <StatCard icon={HiOutlineBookOpen} label="Total Courses" value={stats?.totalCourses} sub={`${stats?.publishedCourses} published`} color="#00e5a0" bg="rgba(0,229,160,0.12)" />
        <StatCard icon={HiOutlineMail} label="Messages" value={stats?.totalMessages} sub={`${stats?.unreadMessages} unread`} color="#ff4d6d" bg="rgba(255,77,109,0.12)" />
        <StatCard icon={HiOutlineCurrencyRupee} label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} sub="from paid courses" color="#a855f7" bg="rgba(168,85,247,0.12)" />
        <StatCard icon={HiOutlineTrendingUp} label="Enrollments" value={stats?.totalEnrollments} sub="across all courses" color="#f97316" bg="rgba(249,115,22,0.12)" />
        <StatCard icon={MdOutlineCategory} label="Categories" value={stats?.totalCategories} sub="course categories" color="#00d4ff" bg="rgba(0,212,255,0.12)" />
        <StatCard icon={HiOutlineAcademicCap} label="Draft Courses" value={(stats?.totalCourses || 0) - (stats?.publishedCourses || 0)} sub="awaiting publish" color="#f5a623" bg="rgba(245,166,35,0.12)" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Manage Messages", path: "/dashboard/admin/messages", color: "#ff4d6d", badge: stats?.unreadMessages > 0 ? stats.unreadMessages : null },
          { label: "Manage Users", path: "/dashboard/admin/users", color: "#f5a623" },
          { label: "Manage Courses", path: "/dashboard/admin/courses", color: "#00e5a0" },
          { label: "Manage Categories", path: "/dashboard/admin/categories", color: "#00d4ff" },
        ].map(({ label, path, color, badge }) => (
          <Link key={path} to={path}
            className="glass-card p-4 flex items-center justify-between hover:border-opacity-50 transition-all"
            style={{ borderColor: `${color}30` }}>
            <span style={{ color, fontWeight: 600, fontSize: "13px" }}>{label}</span>
            {badge ? (
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: color, color: "#fff" }}>{badge}</span>
            ) : (
              <span style={{ color: "var(--color-muted)" }}>→</span>
            )}
          </Link>
        ))}
      </div>

      {/* Recent Unread Messages */}
      {recentMessages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "16px" }}>
              Unread Messages
            </h2>
            <Link to="/dashboard/admin/messages" style={{ color: "#f5a623", fontSize: "13px" }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map(msg => (
              <div key={msg._id} className="glass-card p-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm"
                  style={{ background: "rgba(255,77,109,0.15)", color: "#ff4d6d" }}>
                  {msg.firstName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "13px" }}>
                      {msg.firstName} {msg.lastName}
                    </p>
                    <span style={{ color: "var(--color-muted)", fontSize: "11px" }}>{msg.email}</span>
                  </div>
                  <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "2px" }} className="line-clamp-1">
                    {msg.message}
                  </p>
                </div>
                <span style={{ color: "var(--color-muted)", fontSize: "11px", flexShrink: 0 }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
