import { apiConnector, endpoints } from "./apiConnector";
import { setToken, setLoading } from "../redux/slices/authSlice";
import { setUser } from "../redux/slices/profileSlice";
import { clearCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

export const sendOTP = (email, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.SEND_OTP, { email });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("OTP sent to your email");
    navigate("/verify-email");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send OTP");
  } finally {
    dispatch(setLoading(false));
  }
};

export const signup = (signupData, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.SIGNUP, signupData);
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Account created! Please log in.");
    navigate("/login");
  } catch (err) {
    toast.error(err.response?.data?.message || "Signup failed");
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (email, password, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.LOGIN, { email, password });
    if (!res.data.success) throw new Error(res.data.message);
    const { token, user } = res.data;
    dispatch(setToken(token));
    dispatch(setUser(user));
    localStorage.setItem("token", token);
    toast.success(`Welcome back, ${user.firstName}!`);
    navigate("/dashboard/my-profile");
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = (navigate) => async (dispatch) => {
  try {
    await apiConnector("POST", endpoints.LOGOUT);
  } catch (_) {}
  dispatch(setToken(null));
  dispatch(setUser(null));
  dispatch(clearCart());
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
  navigate("/");
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.FORGOT_PASSWORD, { email });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Password reset link sent to your email");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send reset email");
  } finally {
    dispatch(setLoading(false));
  }
};

export const resetPassword = (token, password, confirmPassword, navigate) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.RESET_PASSWORD, { token, password, confirmPassword });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Password reset successfully!");
    navigate("/login");
  } catch (err) {
    toast.error(err.response?.data?.message || "Password reset failed");
  } finally {
    dispatch(setLoading(false));
  }
};

export const changePassword = (oldPassword, newPassword, confirmNewPassword) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await apiConnector("POST", endpoints.CHANGE_PASSWORD, { oldPassword, newPassword, confirmNewPassword });
    if (!res.data.success) throw new Error(res.data.message);
    toast.success("Password updated successfully");
  } catch (err) {
    toast.error(err.response?.data?.message || "Password change failed");
  } finally {
    dispatch(setLoading(false));
  }
};
