import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { getInstructorStats } from "../../../services/profileAPI";
import { Spinner } from "../../common/index";
import { HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlineBookOpen, HiOutlineStar, HiOutlineTrendingUp } from "react-icons/hi";
import { VscAdd, VscEdit } from "react-icons/vsc";
import { FaPlayCircle } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatCard({ icon: Icon, label, value, color, bg, trend }) {
  return (
    <div className={`rounded-2xl p-5 border ${bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-richblack-900/50 ${color}`}><Icon size={22} /></div>
        {trend && (
          <span className="text-xs text-caribbeangreen-50 bg-caribbeangreen-50/10 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-richblack-5 font-bold text-2xl">{value}</p>
      <p className="text-richblack-400 text-sm mt-0.5">{label}</p>
    </div>
  );
}

export default function Instructor() {
  const { user } = useSelector((s) => s.profile);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInstructorStats().then((data) => { setStats(data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const chartData = {
    labels: stats?.courses?.map((c) => c.courseName.slice(0, 18) + (c.courseName.length > 18 ? "…" : "")) || [],
    datasets: [
      {
        label: "Students",
        data: stats?.courses?.map((c) => c.totalStudents) || [],
        backgroundColor: "rgba(255, 214, 10, 0.75)",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#161D29",
        borderColor: "#424854",
        borderWidth: 1,
        titleColor: "#F1F2FF",
        bodyColor: "#AFB2BF",
      },
    },
    scales: {
      x: { ticks: { color: "#6E727F", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" } },
      y: { ticks: { color: "#6E727F", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" } },
    },
  };

  const totalRevenue = stats?.totals?.totalRevenue || 0;
  const totalStudents = stats?.totals?.totalStudents || 0;
  const totalCourses = stats?.totals?.totalCourses || 0;
  const avgRating = stats?.totals?.avgRating || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-richblack-800 to-richblack-900 border border-richblack-700 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-richyellow-50/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-blue-100/5 rounded-full translate-y-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={user?.image} alt={user?.firstName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-richblack-600" />
            <div>
              <p className="text-richblack-400 text-sm">Welcome back,</p>
              <h1 className="text-richblack-5 font-bold text-xl">{user?.firstName} {user?.lastName} 👋</h1>
              <p className="text-richblack-500 text-xs mt-0.5">Instructor · EduVerse</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/my-courses"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-25 text-sm hover:bg-richblack-600 transition-colors">
              <FaPlayCircle size={14} /> My Courses
            </Link>
            <Link to="/dashboard/add-course"
              className="flex items-center gap-2 btn-primary text-sm px-4 py-2">
              <VscAdd size={16} /> New Course
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineBookOpen}
          label="Total Courses"
          value={totalCourses}
          color="text-blue-100"
          bg="bg-richblack-800 border-richblack-700"
        />
        <StatCard
          icon={HiOutlineUsers}
          label="Total Students"
          value={totalStudents.toLocaleString()}
          color="text-caribbeangreen-50"
          bg="bg-richblack-800 border-richblack-700"
          trend={totalStudents > 0 ? "Active" : null}
        />
        <StatCard
          icon={HiOutlineStar}
          label="Average Rating"
          value={avgRating ? `${avgRating.toFixed(1)} ★` : "N/A"}
          color="text-richyellow-50"
          bg="bg-richblack-800 border-richblack-700"
        />
        <StatCard
          icon={HiOutlineCurrencyRupee}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="text-pink-100"
          bg="bg-richblack-800 border-richblack-700"
          trend={totalRevenue > 0 ? "Earned" : null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-richblack-5 font-semibold">Students per Course</h2>
              <p className="text-richblack-400 text-xs mt-0.5">Enrollment breakdown</p>
            </div>
            <HiOutlineTrendingUp className="text-richblack-500" size={20} />
          </div>
          {stats?.courses?.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-richblack-500">
              <HiOutlineBookOpen size={36} className="mb-2 opacity-50" />
              <p className="text-sm">Create your first course to see stats</p>
            </div>
          )}
        </div>

        {/* Recent courses */}
        <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-richblack-5 font-semibold text-sm">Your Courses</h2>
            <Link to="/dashboard/my-courses" className="text-richyellow-50 text-xs hover:underline">View all</Link>
          </div>
          {stats?.courses?.length > 0 ? (
            <div className="space-y-3">
              {stats.courses.slice(0, 4).map((course) => (
                <div key={course._id} className="flex items-center gap-3 p-3 rounded-xl bg-richblack-700 hover:bg-richblack-600 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-richblack-600 overflow-hidden flex-shrink-0">
                    {course.thumbnail && (
                      <img src={course.thumbnail} alt={course.courseName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-richblack-25 text-xs font-medium truncate">{course.courseName}</p>
                    <p className="text-richblack-500 text-xs">{course.totalStudents} students</p>
                  </div>
                  <Link to={`/dashboard/edit-course/${course._id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-richblack-400 hover:text-richblack-25">
                    <VscEdit size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-richblack-500 text-sm mb-3">No courses yet</p>
              <Link to="/dashboard/add-course" className="btn-primary text-xs px-4 py-2">Create Course</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: "/dashboard/add-course", icon: VscAdd, label: "Create New Course", desc: "Share your knowledge", color: "text-richyellow-50", bg: "border-richyellow-50/20 hover:bg-richyellow-50/5" },
          { to: "/dashboard/my-courses", icon: FaPlayCircle, label: "Manage Courses", desc: "Edit and publish", color: "text-blue-100", bg: "border-blue-100/20 hover:bg-blue-100/5" },
          { to: "/dashboard/settings", icon: VscEdit, label: "Update Profile", desc: "Your instructor profile", color: "text-caribbeangreen-50", bg: "border-caribbeangreen-50/20 hover:bg-caribbeangreen-50/5" },
        ].map(({ to, icon: Icon, label, desc, color, bg }) => (
          <Link key={to} to={to}
            className={`flex items-center gap-4 p-4 rounded-2xl bg-richblack-800 border transition-colors ${bg}`}>
            <div className={`p-3 rounded-xl bg-richblack-700 ${color}`}><Icon size={20} /></div>
            <div>
              <p className="text-richblack-5 font-semibold text-sm">{label}</p>
              <p className="text-richblack-400 text-xs">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
