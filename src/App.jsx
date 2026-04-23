import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/common/Navbar";
import ChatBot from "./components/common/ChatBot";
import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import ViewCourse from "./pages/ViewCourse";
import Error from "./pages/Error";

import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import MyCourses from "./components/core/Dashboard/MyCourses";
import Instructor from "./components/core/Dashboard/Instructor";
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import AdminRoute from "./components/core/Auth/AdminRoute";
import AdminOverview from "./components/core/Dashboard/Admin/AdminOverview";
import AdminMessages from "./components/core/Dashboard/Admin/AdminMessages";
import AdminUsers from "./components/core/Dashboard/Admin/AdminUsers";
import AdminCourses from "./components/core/Dashboard/Admin/AdminCourses";
import AdminCategories from "./components/core/Dashboard/Admin/AdminCategories";

const STUDENT = "Student";
const INSTRUCTOR = "Instructor";

export default function App() {
  const { user } = useSelector(s => s.profile);

  return (
    <div className="w-screen min-h-screen flex flex-col" style={{ background: "var(--color-bg)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/catalog" element={<Navigate to="/catalog/web-development" replace />} />
        <Route path="/catalog/:categoryName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        {/* Auth */}
        <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
        <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>} />
        <Route path="/verify-email" element={<OpenRoute><VerifyEmail /></OpenRoute>} />
        <Route path="/forgot-password" element={<OpenRoute><ForgotPassword /></OpenRoute>} />
        <Route path="/update-password/:token" element={<OpenRoute><UpdatePassword /></OpenRoute>} />

        {/* Dashboard */}
        <Route element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          {/* Student */}
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          {/* Instructor */}
          <Route path="/dashboard/instructor" element={<Instructor />} />
          <Route path="/dashboard/my-courses" element={<MyCourses />} />
          <Route path="/dashboard/add-course" element={<AddCourse />} />
          <Route path="/dashboard/edit-course/:courseId" element={<EditCourse />} />
          {/* Admin */}
          <Route path="/dashboard/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
          <Route path="/dashboard/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
          <Route path="/dashboard/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/dashboard/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/dashboard/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        </Route>

        {/* View Course */}
        <Route element={<PrivateRoute><ViewCourse /></PrivateRoute>}>
          <Route
            path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>

      {/* Global floating chatbot — visible on all pages */}
      <ChatBot />
    </div>
  );
}
