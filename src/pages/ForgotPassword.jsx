import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authAPI";
import { Spinner } from "../components/common/index";
import { HiOutlineKey, HiOutlineLightningBolt } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";

export default function ForgotPassword() {
  const { loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = ({ email }) => dispatch(forgotPassword(email));

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}>
            <HiOutlineKey size={28} style={{ color: "#00d4ff" }} />
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={13} />
            </div>
            <span style={{ color: "#f5a623", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "13px" }}>EduVerse</span>
          </div>

          <h1 className="text-center" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "26px", color: "white", marginBottom: "8px" }}>
            Forgot your password?
          </h1>
          <p className="text-center" style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "28px", lineHeight: "1.6" }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "8px" }}>
                Email Address
              </label>
              <input type="email" {...register("email", { required: "Email is required" })}
                className="form-input" placeholder="you@example.com" />
              {errors.email && <p style={{ color: "#ff4d6d", fontSize: "12px", marginTop: "6px" }}>{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4">
              {loading ? <Spinner size="sm" /> : <>Send Reset Link <FaArrowRight size={14} /></>}
            </button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-2 mt-5" style={{ color: "var(--color-muted)", fontSize: "13px" }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
