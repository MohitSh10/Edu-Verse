import { apiConnector, endpoints } from "./apiConnector";
import toast from "react-hot-toast";

export const getAdminStats = async () => {
  try {
    const res = await apiConnector("GET", endpoints.ADMIN_STATS);
    return res.data.data;
  } catch (err) {
    toast.error("Failed to fetch stats");
    return null;
  }
};

export const getAdminMessages = async (filters = {}) => {
  try {
    const res = await apiConnector("GET", endpoints.ADMIN_MESSAGES, null, {}, filters);
    return res.data;
  } catch (err) {
    return { data: [], total: 0 };
  }
};

export const updateAdminMessage = async (id, update) => {
  try {
    const res = await apiConnector("PUT", `${endpoints.ADMIN_MESSAGES}/${id}`, update);
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update message");
    return null;
  }
};

export const deleteAdminMessage = async (id) => {
  try {
    await apiConnector("DELETE", `${endpoints.ADMIN_MESSAGES}/${id}`);
    toast.success("Message deleted");
    return true;
  } catch (err) {
    toast.error("Failed to delete message");
    return false;
  }
};

export const getAdminUsers = async (filters = {}) => {
  try {
    const res = await apiConnector("GET", endpoints.ADMIN_USERS, null, {}, filters);
    return res.data;
  } catch (err) {
    return { data: [], total: 0 };
  }
};

export const toggleUserStatus = async (id) => {
  try {
    const res = await apiConnector("PUT", `${endpoints.ADMIN_USERS}/${id}/toggle-status`);
    toast.success(res.data.message);
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update user");
    return null;
  }
};

export const changeUserRole = async (id, accountType) => {
  try {
    const res = await apiConnector("PUT", `${endpoints.ADMIN_USERS}/${id}/role`, { accountType });
    toast.success("Role updated");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to change role");
    return null;
  }
};

export const deleteAdminUser = async (id) => {
  try {
    await apiConnector("DELETE", `${endpoints.ADMIN_USERS}/${id}`);
    toast.success("User deleted");
    return true;
  } catch (err) {
    toast.error("Failed to delete user");
    return false;
  }
};

export const getAdminCourses = async (filters = {}) => {
  try {
    const res = await apiConnector("GET", endpoints.ADMIN_COURSES, null, {}, filters);
    return res.data;
  } catch (err) {
    return { data: [], total: 0 };
  }
};

export const deleteAdminCourse = async (id) => {
  try {
    await apiConnector("DELETE", `${endpoints.ADMIN_COURSES}/${id}`);
    toast.success("Course deleted");
    return true;
  } catch (err) {
    toast.error("Failed to delete course");
    return false;
  }
};

export const updateCourseStatus = async (id, status) => {
  try {
    const res = await apiConnector("PUT", `${endpoints.ADMIN_COURSES}/${id}/status`, { status });
    toast.success(`Course ${status === "Published" ? "published" : "unpublished"}`);
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update status");
    return null;
  }
};

export const getAdminCategories = async () => {
  try {
    const res = await apiConnector("GET", endpoints.ADMIN_CATEGORIES);
    return res.data.data;
  } catch (err) {
    return [];
  }
};

export const createAdminCategory = async (data) => {
  try {
    const res = await apiConnector("POST", endpoints.ADMIN_CATEGORIES, data);
    toast.success("Category created");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create category");
    return null;
  }
};

export const deleteAdminCategory = async (id) => {
  try {
    await apiConnector("DELETE", `${endpoints.ADMIN_CATEGORIES}/${id}`);
    toast.success("Category deleted");
    return true;
  } catch (err) {
    toast.error("Failed to delete category");
    return false;
  }
};
