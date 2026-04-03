import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  VscDashboard, VscAccount, VscSettingsGear, VscSignOut,
  VscAdd, VscBook, VscListOrdered,
} from "react-icons/vsc";
import { AiOutlineShoppingCart } from "react-icons/ai";
import {
  HiOutlineAcademicCap, HiOutlineMail, HiOutlineUsers,
  HiOutlineShieldCheck, HiOutlineCollection,
} from "react-icons/hi";
import { logout } from "../../../services/authAPI";
import { ConfirmationModal } from "../../common/index";

const STUDENT_LINKS = [
  { Icon: VscAccount, label: "My Profile", path: "/dashboard/my-profile" },
  { Icon: VscBook, label: "Enrolled Courses", path: "/dashboard/enrolled-courses" },
  { Icon: AiOutlineShoppingCart, label: "My Cart", path: "/dashboard/cart" },
  { Icon: VscSettingsGear, label: "Settings", path: "/dashboard/settings" },
];

const INSTRUCTOR_LINKS = [
  { Icon: VscDashboard, label: "Dashboard", path: "/dashboard/instructor" },
  { Icon: VscAccount, label: "My Profile", path: "/dashboard/my-profile" },
  { Icon: VscListOrdered, label: "My Courses", path: "/dashboard/my-courses" },
  { Icon: VscAdd, label: "Add Course", path: "/dashboard/add-course" },
  { Icon: VscSettingsGear, label: "Settings", path: "/dashboard/settings" },
];

const ADMIN_LINKS = [
  { Icon: VscDashboard,          label: "Overview",    path: "/dashboard/admin" },
  { Icon: HiOutlineMail,         label: "Messages",    path: "/dashboard/admin/messages" },
  { Icon: HiOutlineUsers,        label: "Users",       path: "/dashboard/admin/users" },
  { Icon: VscBook,               label: "Courses",     path: "/dashboard/admin/courses" },
  { Icon: HiOutlineCollection,   label: "Categories",  path: "/dashboard/admin/categories" },
  { Icon: VscSettingsGear,       label: "Settings",    path: "/dashboard/settings" },
];

export default function Sidebar() {
  const { user } = useSelector((s) => s.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const isInstructor = user?.accountType === "Instructor";
  const isAdmin = user?.accountType === "Admin";

  const links = isAdmin ? ADMIN_LINKS : isInstructor ? INSTRUCTOR_LINKS : STUDENT_LINKS;

  const handleLogout = () =>
    setConfirmModal({
      text1: "Log Out?",
      text2: "You'll need to log back in to access your account.",
      btn1Text: "Log Out",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(logout(navigate)),
      btn2Handler: () => setConfirmModal(null),
    });

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 min-h-full"
        style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}>
        {/* Role header */}
        <div className="px-4 py-4"
          style={{
            borderBottom: "1px solid var(--color-border)",
            background: isAdmin
              ? "linear-gradient(to right, rgba(168,85,247,0.1), transparent)"
              : isInstructor
                ? "linear-gradient(to right, rgba(0,212,255,0.07), transparent)"
                : "linear-gradient(to right, rgba(245,166,35,0.07), transparent)",
          }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="w-10 h-10 rounded-xl object-cover border-2 border-richblack-600"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-caribbeangreen-50 rounded-full border-2 border-richblack-800" />
            </div>
            <div className="overflow-hidden">
              <p className="text-richblack-5 font-semibold text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isAdmin
                  ? <HiOutlineShieldCheck size={12} style={{ color: "#a855f7" }} />
                  : <HiOutlineAcademicCap className={isInstructor ? "text-blue-100" : "text-richyellow-50"} size={12} />
                }
                <p className="text-xs font-medium" style={{
                  color: isAdmin ? "#a855f7" : isInstructor ? "#7dd3fc" : "#ffd60a"
                }}>
                  {user?.accountType}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
          <p className="text-richblack-500 text-xs font-medium uppercase tracking-wider px-3 py-2 mt-1">
            {isAdmin ? "Admin Panel" : isInstructor ? "Creator Tools" : "My Learning"}
          </p>
          {links.map(({ Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
                ${isActive
                  ? isAdmin
                    ? "bg-purple-500/15 font-medium"
                    : isInstructor
                      ? "bg-blue-100/15 text-blue-100 font-medium"
                      : "bg-richyellow-50/15 text-richyellow-50 font-medium"
                  : "text-richblack-300 hover:bg-richblack-700 hover:text-richblack-25"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    color: isActive
                      ? isAdmin ? "#a855f7" : isInstructor ? "#7dd3fc" : "#ffd60a"
                      : "var(--color-muted)"
                  }}>
                    <Icon size={17} />
                  </div>
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{
                      background: isAdmin ? "#a855f7" : isInstructor ? "#7dd3fc" : "#ffd60a"
                    }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-richblack-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-richblack-400 hover:bg-richblack-700 hover:text-pink-100 transition-colors"
          >
            <VscSignOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      <ConfirmationModal modalData={confirmModal} />
    </>
  );
}
