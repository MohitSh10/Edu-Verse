import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaShoppingCart, FaLock, FaTag } from "react-icons/fa";
import { HiOutlineShieldCheck, HiOutlineTrendingUp } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { removeFromCart, clearCart } from "../../../redux/slices/cartSlice";
import { RatingStars } from "../../common/index";
import MockPayment from "../../common/MockPayment";
import toast from "react-hot-toast";
import { apiConnector, endpoints } from "../../../services/apiConnector";

export default function Cart() {
  const { cart, totalItems, totalPrice } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);

  // Called after mock payment succeeds
  const handlePaymentSuccess = async (paymentId) => {
    setShowPayment(false);
    const toastId = toast.loading("Enrolling you in courses...");
    try {
      // Try to call the real enrollment endpoint if it exists
      await apiConnector("POST", endpoints.VERIFY_PAYMENT, {
        razorpay_order_id:   "mock_order_" + Date.now(),
        razorpay_payment_id: paymentId,
        razorpay_signature:  "mock_sig_" + Date.now(),
        courses: cart.map(c => c._id),
      });
    } catch {
      // Mock enrollment even if backend doesn't have the endpoint
    }
    dispatch(clearCart());
    toast.success("🎉 Payment successful! You are now enrolled.", { id: toastId });
    navigate("/dashboard/enrolled-courses");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
          <FaShoppingCart size={28} style={{ color: "#f5a623" }} />
        </div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "12px" }}>
          Your cart is empty
        </h1>
        <p style={{ color: "var(--color-muted)", marginBottom: "32px" }}>
          Discover amazing courses and add them to your cart
        </p>
        <button onClick={() => navigate("/")} className="btn-primary px-10 py-4 text-base">
          Browse Courses
        </button>
      </div>
    );
  }

  const savings = Math.round(totalPrice * 0.3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "white" }}>
          Shopping Cart
        </h1>
        <p style={{ color: "var(--color-muted)", marginTop: "6px" }}>{totalItems} course{totalItems !== 1 ? "s" : ""} in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Course list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(course => {
            const avgRating = course.ratingAndReview?.length
              ? course.ratingAndReview.reduce((a, r) => a + r.rating, 0) / course.ratingAndReview.length
              : 4.5;

            return (
              <div key={course._id} className="rounded-2xl p-5 flex gap-4 transition-all hover:border-[rgba(245,166,35,0.2)]"
                style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={course.thumbnail} alt={course.courseName}
                  className="w-28 h-20 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p style={{ color: "white", fontWeight: 600, fontSize: "15px" }} className="line-clamp-1">{course.courseName}</p>
                  <p style={{ color: "var(--color-muted)", fontSize: "12px", marginTop: "4px" }}>
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span style={{ color: "#f5a623", fontWeight: 700, fontSize: "13px" }}>{avgRating.toFixed(1)}</span>
                    <RatingStars review_count={avgRating} Star_Size={12} />
                    <span style={{ color: "var(--color-muted)", fontSize: "11px" }}>({course.ratingAndReview?.length || 0})</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span style={{ color: "#f5a623", fontWeight: 800, fontSize: "18px", fontFamily: "Sora, sans-serif" }}>
                        ₹{course.price?.toLocaleString()}
                      </span>
                      <span style={{ color: "var(--color-muted)", fontSize: "12px", textDecoration: "line-through" }}>
                        ₹{Math.round(course.price * 1.3).toLocaleString()}
                      </span>
                      <span className="badge badge-green text-[10px] py-0.5">30% OFF</span>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(course._id))}
                      className="p-2 rounded-lg transition-colors hover:bg-[#ff4d6d]/10"
                      style={{ color: "var(--color-muted)" }}>
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl p-6 sticky top-24"
            style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}>
            
            {/* Savings badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)" }}>
              <HiOutlineTrendingUp style={{ color: "#00e5a0" }} size={16} />
              <p style={{ color: "#00e5a0", fontSize: "13px", fontWeight: 600 }}>
                You're saving ₹{savings.toLocaleString()}!
              </p>
            </div>

            <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "white", fontSize: "18px", marginBottom: "16px" }}>
              Order Summary
            </h2>

            <div className="space-y-3 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-muted)" }}>Price ({totalItems} items)</span>
                <span style={{ color: "var(--color-text)" }}>₹{Math.round(totalPrice * 1.3).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#00e5a0" }}>Discount (30%)</span>
                <span style={{ color: "#00e5a0" }}>-₹{savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-muted)" }}>Taxes (0%)</span>
                <span style={{ color: "var(--color-muted)" }}>₹0</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span style={{ color: "white", fontWeight: 700, fontSize: "16px", fontFamily: "Sora, sans-serif" }}>Total</span>
              <span style={{ color: "#f5a623", fontWeight: 800, fontSize: "24px", fontFamily: "Sora, sans-serif" }}>₹{totalPrice.toLocaleString()}</span>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-5">
              <input className="form-input text-sm flex-1" placeholder="Promo code" style={{ padding: "10px 14px" }} />
              <button className="btn-secondary text-sm px-4" style={{ padding: "10px 16px" }}>Apply</button>
            </div>

            <button onClick={() => setShowPayment(true)} className="btn-primary w-full justify-center text-base py-4">
              <FaLock size={14} />
              Checkout Now
            </button>

            {/* Trust indicators */}
            <div className="mt-4 space-y-2">
              {[
                { icon: HiOutlineShieldCheck, text: "Secure 256-bit SSL checkout", color: "#00e5a0" },
                { icon: MdVerified, text: "30-day money back guarantee", color: "#00d4ff" },
                { icon: FaTag, text: "Lifetime access after purchase", color: "#f5a623" },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={14} style={{ color, flexShrink: 0 }} />
                  <span style={{ color: "var(--color-muted)", fontSize: "12px" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mock Payment Modal */}
      {showPayment && (
        <MockPayment
          amount={totalPrice}
          courses={cart}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
