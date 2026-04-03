import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { login } from "../services/authAPI";
import { Spinner } from "../components/common/index";

const REVIEWS = [
  { name: "Aarav M.", text: "EduVerse completely changed my career trajectory. Got hired at Google after 6 months!", rating: 5 },
  { name: "Sneha P.", text: "The best investment I ever made. Went from ₹30K to ₹1.2L monthly salary.", rating: 5 },
];

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const { loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = data => dispatch(login(data.email, data.password, navigate));

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{ background: "var(--color-bg)" }}>
      
      {/* Left panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={18} />
            </div>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "18px", color: "#f5a623" }}>EduVerse</span>
          </div>

          <h1 className="mb-2" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "32px", color: "var(--color-text)" }}>
            Welcome back 👋
          </h1>
          <p style={{ color: "var(--color-muted)", marginBottom: "32px", fontSize: "15px" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#f5a623", fontWeight: 600 }}>Create one free →</Link>
          </p>

          {/* Social login buttons (visual only) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { name: "Google", color: "#4285f4", logo: "🇬" },
              { name: "GitHub", color: "#333", logo: "⚫" },
            ].map(provider => (
              <button key={provider.name} type="button"
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-text)" }}>
                <span>{provider.logo}</span>
                {provider.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "var(--color-muted)", fontSize: "12px" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "8px", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Email Address
              </label>
              <input type="email" {...register("email", { required: "Email is required" })}
                className="form-input" placeholder="you@example.com" />
              {errors.email && <p style={{ color: "#ff4d6d", fontSize: "12px", marginTop: "6px" }}>{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-muted)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "12px", color: "#f5a623", fontWeight: 600 }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="form-input pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--color-muted)" }}>
                  {showPass ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                </button>
              </div>
              {errors.password && <p style={{ color: "#ff4d6d", fontSize: "12px", marginTop: "6px" }}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 mt-2 justify-center text-base"
              style={{ marginTop: "8px" }}>
              {loading ? <Spinner size="sm" /> : <>Sign In <FaArrowRight size={14} /></>}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)" }}>
            <p style={{ color: "#00d4ff", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>💡 Quick Demo Access</p>
            <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>Create a free account to explore all features as Student or Instructor</p>
          </div>
        </div>
      </div>

      {/* Right panel — testimonial/branding */}
      <div className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden"
        style={{ width: "45%", background: "linear-gradient(135deg, #061525 0%, #0a2040 100%)" }}>

        {/* Decorative orb */}
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-0 w-60 h-60 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="badge badge-gold mb-8">⭐ 4.9 / 5 from 12,000+ reviews</div>
          
          {/* Review card */}
          <div className="glass-card p-8 mb-6" style={{ maxWidth: "400px" }}>
            <FaStar style={{ color: "#f5a623", marginBottom: "16px" }} size={20} />
            <div className="flex mb-3">
              {[1,2,3,4,5].map(i => <FaStar key={i} size={14} style={{ color: "#f5a623" }} />)}
            </div>
            <p style={{ color: "var(--color-text)", fontSize: "17px", lineHeight: "1.7", marginBottom: "20px", fontStyle: "italic" }}>
              "{REVIEWS[reviewIdx].text}"
            </p>
            <div className="flex items-center gap-3">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${REVIEWS[reviewIdx].name}`}
                className="w-10 h-10 rounded-full border-2 bg-[#061525]" style={{ borderColor: "#f5a623" }} alt="" />
              <div>
                <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>{REVIEWS[reviewIdx].name}</p>
                <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>EduVerse Graduate</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setReviewIdx(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === reviewIdx ? "#f5a623" : "rgba(255,255,255,0.2)", width: i === reviewIdx ? "24px" : "8px" }} />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[["50K+", "Active Learners"], ["1,200+", "Courses"], ["98%", "Success Rate"], ["₹80K+", "Avg Salary Boost"]].map(([v, l]) => (
              <div key={l} className="glass-card p-4">
                <p style={{ color: "#f5a623", fontWeight: 800, fontSize: "22px", fontFamily: "Sora, sans-serif" }}>{v}</p>
                <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
