import { apiConnector, endpoints } from "./apiConnector";
import { setCourse } from "../redux/slices/courseSlice";
import toast from "react-hot-toast";

// ─── Fetch all published courses ──────────────────────────────────────────────
export const fetchAllCourses = async (filters = {}) => {
  try {
    const res = await apiConnector("GET", endpoints.GET_ALL_COURSES, null, {}, filters);
    return res.data;
  } catch (err) {
    toast.error("Could not fetch courses");
    return null;
  }
};

// ─── Fetch single course details ──────────────────────────────────────────────
export const fetchCourseDetails = async (courseId) => {
  try {
    const res = await apiConnector("GET", `${endpoints.GET_COURSE_DETAILS}/${courseId}`);
    return res.data;
  } catch (err) {
    toast.error("Could not fetch course details");
    return null;
  }
};

// ─── Get all categories ───────────────────────────────────────────────────────
export const fetchCategories = async () => {
  try {
    const res = await apiConnector("GET", endpoints.ALL_CATEGORIES);
    return res.data.data;
  } catch (err) {
    return [];
  }
};

// ─── Get category page details ────────────────────────────────────────────────
export const fetchCategoryDetails = async (categoryId) => {
  try {
    const res = await apiConnector("GET", `${endpoints.CATEGORY_DETAILS}/${categoryId}`);
    return res.data.data;
  } catch (err) {
    toast.error("Could not fetch category details");
    return null;
  }
};

// ─── Fetch all top reviews ────────────────────────────────────────────────────
export const fetchAllReviews = async () => {
  try {
    const res = await apiConnector("GET", endpoints.ALL_REVIEWS);
    return res.data.data;
  } catch (err) {
    return [];
  }
};

// ─── Create course ────────────────────────────────────────────────────────────
export const createCourse = (courseData) => async (dispatch) => {
  try {
    const res = await apiConnector("POST", endpoints.CREATE_COURSE, courseData, {
      "Content-Type": "multipart/form-data",
    });
    if (!res.data.success) throw new Error(res.data.message);
    dispatch(setCourse(res.data.data));
    toast.success("Course created!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create course");
    return null;
  }
};

// ─── Edit course ──────────────────────────────────────────────────────────────
export const editCourse = (courseId, courseData) => async (dispatch) => {
  try {
    const isFormData = courseData instanceof FormData;
    const res = await apiConnector(
      "PUT",
      `${endpoints.EDIT_COURSE}/${courseId}`,
      courseData,
      isFormData ? { "Content-Type": "multipart/form-data" } : {}
    );
    if (!res.data.success) throw new Error(res.data.message);
    dispatch(setCourse(res.data.data));
    toast.success("Course updated!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update course");
    return null;
  }
};

// ─── Delete course ────────────────────────────────────────────────────────────
export const deleteCourse = async (courseId) => {
  try {
    const res = await apiConnector("DELETE", `${endpoints.DELETE_COURSE}/${courseId}`);
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Course deleted");
    return true;
  } catch (err) {
    toast.error("Failed to delete course");
    return false;
  }
};

// ─── Publish course ───────────────────────────────────────────────────────────
export const publishCourse = async (courseId) => {
  try {
    const res = await apiConnector("PATCH", `${endpoints.EDIT_COURSE}/${courseId}/publish`);
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Course published!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to publish course");
    return null;
  }
};

// ─── Fetch instructor's courses ───────────────────────────────────────────────
export const fetchInstructorCourses = async () => {
  try {
    const res = await apiConnector("GET", endpoints.INSTRUCTOR_COURSES);
    return res.data.data;
  } catch (err) {
    toast.error("Could not fetch your courses");
    return [];
  }
};

// ─── Section CRUD ─────────────────────────────────────────────────────────────
export const createSection = async (sectionName, courseId) => {
  try {
    const res = await apiConnector("POST", endpoints.CREATE_SECTION, { sectionName, courseId });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Section added");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to add section");
    return null;
  }
};

export const updateSection = async (sectionId, sectionName, courseId) => {
  try {
    const res = await apiConnector("PUT", endpoints.UPDATE_SECTION, { sectionId, sectionName, courseId });
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update section");
    return null;
  }
};

export const deleteSection = async (sectionId, courseId) => {
  try {
    const res = await apiConnector("DELETE", endpoints.DELETE_SECTION, { sectionId, courseId });
    return res.data.data;
  } catch (err) {
    toast.error("Failed to delete section");
    return null;
  }
};

// ─── SubSection CRUD ──────────────────────────────────────────────────────────
export const createSubSection = async (formData) => {
  try {
    const res = await apiConnector("POST", endpoints.CREATE_SUBSECTION, formData, {
      "Content-Type": "multipart/form-data",
    });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Lecture added");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to add lecture");
    return null;
  }
};

export const updateSubSection = async (formData) => {
  try {
    const res = await apiConnector("PUT", endpoints.UPDATE_SUBSECTION, formData, {
      "Content-Type": "multipart/form-data",
    });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Lecture updated");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update lecture");
    return null;
  }
};

export const deleteSubSection = async (subSectionId, sectionId) => {
  try {
    const res = await apiConnector("DELETE", endpoints.DELETE_SUBSECTION, { subSectionId, sectionId });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Lecture deleted");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to delete lecture");
    return null;
  }
};

// ─── Submit a review ─────────────────────────────────────────────────────────
export const createReview = async (rating, review, courseId) => {
  try {
    const res = await apiConnector("POST", endpoints.CREATE_REVIEW, { rating, review, courseId });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Review submitted!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to submit review");
    return null;
  }
};
