import { apiConnector, endpoints } from "./apiConnector";
import { setPaymentLoading } from "../redux/slices/courseSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { setUser } from "../redux/slices/profileSlice";
import toast from "react-hot-toast";

// Load Razorpay script dynamically
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const buyCourses = (token, courses, userDetails, navigate, dispatch) => async () => {
  const toastId = toast.loading("Processing payment...");
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway", { id: toastId });
      return;
    }

    // Create order
    const orderRes = await apiConnector("POST", endpoints.CAPTURE_PAYMENT, {
      courses: courses.map((c) => c._id),
    });
    if (!orderRes.data.success) throw new Error(orderRes.data.message);

    const { orderId, currency, amount, keyId } = orderRes.data.data;

    const options = {
      key: keyId,
      currency,
      amount,
      name: "EdTech Platform",
      description: "Course Enrollment",
      order_id: orderId,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      theme: { color: "#FFD60A" },
      handler: async function (response) {
        // Verify payment
        try {
          const verifyRes = await apiConnector("POST", endpoints.VERIFY_PAYMENT, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courses: courses.map((c) => c._id),
          });
          if (!verifyRes.data.success) throw new Error(verifyRes.data.message);
          toast.success("Payment successful! You are now enrolled.", { id: toastId });
          dispatch(clearCart());
          navigate("/dashboard/enrolled-courses");
        } catch (err) {
          toast.error("Payment verification failed", { id: toastId });
        }
      },
    };

    const razor = new window.Razorpay(options);
    razor.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.", { id: toastId });
    });
    razor.open();
    toast.dismiss(toastId);
  } catch (err) {
    toast.error(err.response?.data?.message || "Could not initiate payment", { id: toastId });
  }
};

export const enrollFreeCourse = (courseId, navigate) => async (dispatch) => {
  const toastId = toast.loading("Enrolling...");
  try {
    const res = await apiConnector("POST", endpoints.ENROLL_FREE, { courseId });
    if (!res.data.success) throw new Error(res.data.message);
    // Refresh user profile so isEnrolled updates immediately
    const profileRes = await apiConnector("GET", endpoints.GET_PROFILE);
    if (profileRes.data.success) {
      dispatch(setUser(profileRes.data.data));
      localStorage.setItem("user", JSON.stringify(profileRes.data.data));
    }
    toast.success("Enrolled successfully!", { id: toastId });
    navigate("/dashboard/enrolled-courses");
  } catch (err) {
    toast.error(err.response?.data?.message || "Enrollment failed", { id: toastId });
  }
};

export const markLectureComplete = async (courseId, subSectionId, sectionId) => {
  try {
    const res = await apiConnector("POST", endpoints.UPDATE_PROGRESS, {
      courseId,
      subSectionId,
      sectionId,
    });
    return res.data.data;
  } catch (err) {
    return null;
  }
};
