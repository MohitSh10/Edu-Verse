import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper: make API call with loading toast
export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
};

// API endpoint map
export const endpoints = {
  // Auth
  SEND_OTP:           "/auth/send-otp",
  SIGNUP:             "/auth/signup",
  LOGIN:              "/auth/login",
  LOGOUT:             "/auth/logout",
  FORGOT_PASSWORD:    "/auth/forgot-password",
  RESET_PASSWORD:     "/auth/reset-password",
  CHANGE_PASSWORD:    "/auth/change-password",
  // Profile
  GET_PROFILE:        "/profile/me",
  UPDATE_PROFILE:     "/profile/update",
  UPDATE_PICTURE:     "/profile/picture",
  DELETE_ACCOUNT:     "/profile/delete",
  ENROLLED_COURSES:   "/profile/enrolled-courses",
  INSTRUCTOR_STATS:   "/profile/instructor-stats",
  // Courses
  GET_ALL_COURSES:    "/course",
  GET_COURSE_DETAILS: "/course",
  CREATE_COURSE:      "/course",
  EDIT_COURSE:        "/course",
  DELETE_COURSE:      "/course",
  INSTRUCTOR_COURSES: "/course/instructor/my-courses",
  CREATE_SECTION:     "/course/section/add",
  UPDATE_SECTION:     "/course/section/update",
  DELETE_SECTION:     "/course/section/delete",
  CREATE_SUBSECTION:  "/course/subsection/add",
  UPDATE_SUBSECTION:  "/course/subsection/update",
  DELETE_SUBSECTION:  "/course/subsection/delete",
  // Categories
  ALL_CATEGORIES:     "/course/categories/all",
  CATEGORY_DETAILS:   "/course/categories",
  // Reviews
  ALL_REVIEWS:        "/course/reviews/all",
  CREATE_REVIEW:      "/course/review",
  // Payment
  CAPTURE_PAYMENT:    "/payment/capture",
  VERIFY_PAYMENT:     "/payment/verify",
  ENROLL_FREE:        "/payment/enroll-free",
  UPDATE_PROGRESS:    "/payment/progress",
  UNENROLL_COURSE:    "/payment/unenroll",
  // Contact
  CONTACT_US:         "/contact",
  // Admin
  ADMIN_STATS:        "/admin/stats",
  ADMIN_MESSAGES:     "/admin/messages",
  ADMIN_USERS:        "/admin/users",
  ADMIN_COURSES:      "/admin/courses",
  ADMIN_CATEGORIES:   "/admin/categories",
};
