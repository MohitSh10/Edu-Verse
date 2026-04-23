import { apiConnector, endpoints } from "./apiConnector";
import { setUser, updateUserImage, setLoading } from "../redux/slices/profileSlice";
import toast from "react-hot-toast";

export const getUserProfile = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("GET", endpoints.GET_PROFILE);
    dispatch(setUser(res.data.data));
    return res.data.data;
  } catch (err) {
    toast.error("Could not load profile");
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProfile = (profileData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("PUT", endpoints.UPDATE_PROFILE, profileData);
    if (!res.data.success) throw new Error(res.data.message);
    dispatch(setUser(res.data.data));
    toast.success("Profile updated!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update profile");
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProfilePicture = (formData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("PUT", endpoints.UPDATE_PICTURE, formData, {
      "Content-Type": "multipart/form-data",
    });
    if (!res.data.success) throw new Error(res.data.message);
    dispatch(updateUserImage(res.data.data.image));
    toast.success("Profile picture updated!");
    return res.data.data;
  } catch (err) {
    toast.error("Failed to update picture");
  } finally {
    dispatch(setLoading(false));
  }
};

export const getEnrolledCourses = async () => {
  try {
    const res = await apiConnector("GET", endpoints.ENROLLED_COURSES);
    return res.data.data;
  } catch (err) {
    toast.error("Could not fetch enrolled courses");
    return [];
  }
};

export const getInstructorStats = async () => {
  try {
    const res = await apiConnector("GET", endpoints.INSTRUCTOR_STATS);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const deleteAccount = (navigate) => async (dispatch) => {
  try {
    const res = await apiConnector("DELETE", endpoints.DELETE_ACCOUNT);
    if (!res.data.success) throw new Error(res.data.message);
    dispatch(setUser(null));
    localStorage.clear();
    toast.success("Account deleted");
    navigate("/");
  } catch (err) {
    toast.error("Failed to delete account");
  }
};
