import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineSchool, MdOutlineComputer } from "react-icons/md";
import { sendOTP } from "../services/authAPI";
import { Spinner } from "../components/common/index";

const PERKS = {
  Student: ["Access 1,200+ courses", "Earn verified certificates", "Join 50K+ community", "Learn at your own pace"],
  Instructor: ["Set your own pricing", "Keep 70% revenue", "Global student reach", "Full creative control"],
};

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountType, setAccountType] = useState("Student");
  const { loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = data => {
    localStorage.setItem("signupData", JSON.stringify({ ...data, accountType }));
    dispatch(sendOTP(data.email, navigate));
  };

  const isInstructor = accountType === "Instructor";

  return (
    <div className="min-h-[calc(100vh-64px)] flex" style={{ background: "var(--color-bg)" }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-center px-16 relative overflow-hidden"
        style={{ width: "42%", background: "linear-gradient(135deg, #061525 0%, #0a2040 100%)" }}>

        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: isInstructor ? "radial-gradient(circle, #00d4ff 0%, transparent 70%)" : "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={20} />
            </div>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "20px", color: "#f5a623" }}>EduVerse</span>
          </div>

          <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "30px", color: "white", marginBottom: "8px", lineHeight: 1.2 }}>
            {isInstructor ? "Share your knowledge,\nearn your worth" : "Your learning\njourney starts here"}
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "15px", marginBottom: "32px", lineHeight: 1.7 }}>
            {isInstructor
              ? "Join 500+ instructors who earn while teaching what they love."
              : "Join 50,000+ learners building skills for tomorrow's world."}
          </p>

          <div className="space-y-3">
            {PERKS[accountType].map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <FaCheckCircle size={16} style={{ color: isInstructor ? "#00d4ff" : "#f5a623", flexShrink: 0 }} />
                <span style={{ color: "var(--color-text)", fontSize: "14px" }}>{perk}</span>
              </div>
            ))}
          </div>

          {/* Floating card */}
          <div className="glass-card p-5 mt-10">
            <div className="flex items-center gap-3 mb-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=neha" className="w-10 h-10 rounded-full bg-[#061525] border-2" style={{ borderColor: isInstructor ? "#00d4ff" : "#f5a623" }} alt="" />
              <div>
                <p style={{ color: "white", fontWeight: 600, fontSize: "13px" }}>{isInstructor ? "Neha Joshi, Instructor" : "Rahul Gupta, Student"}</p>
                <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>{isInstructor ? "₹1.2L/month from EduVerse" : "Got job at TCS after 3 months"}</p>
              </div>
            </div>
            <p style={{ color: "var(--color-muted)", fontSize: "12px", fontStyle: "italic" }}>
              {isInstructor
                ? '"The platform handles everything — I just create great content."'
                : '"Best decision of my career. The certificate got me interviews."'}
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={15} />
            </div>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "16px", color: "#f5a623" }}>EduVerse</span>
          </div>

          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "var(--color-text)", marginBottom: "4px" }}>
            Create your account
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Already have one?{" "}
            <Link to="/login" style={{ color: "#f5a623", fontWeight: 600 }}>Sign in →</Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { type: "Student", icon: MdOutlineSchool, label: "I want to Learn", desc: "Access all courses" },
              { type: "Instructor", icon: MdOutlineComputer, label: "I want to Teach", desc: "Create & sell courses" },
            ].map(({ type, icon: Icon, label, desc }) => (
              <button key={type} onClick={() => setAccountType(type)}
                className="p-4 rounded-2xl text-left transition-all"
                style={{
                  background: accountType === type ? (type === "Instructor" ? "rgba(0,212,255,0.08)" : "rgba(245,166,35,0.08)") : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${accountType === type ? (type === "Instructor" ? "#00d4ff" : "#f5a623") : "rgba(255,255,255,0.08)"}`,
                }}>
                <Icon size={22} style={{ color: accountType === type ? (type === "Instructor" ? "#00d4ff" : "#f5a623") : "var(--color-muted)", marginBottom: "8px" }} />
                <p style={{ color: accountType === type ? "white" : "var(--color-muted)", fontWeight: 700, fontSize: "13px" }}>{label}</p>
                <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>{desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>First Name *</label>
                <input {...register("firstName", { required: "Required" })} className="form-input" placeholder="Rahul" />
                {errors.firstName && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.firstName.message}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Last Name *</label>
                <input {...register("lastName", { required: "Required" })} className="form-input" placeholder="Gupta" />
                {errors.lastName && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Email Address *</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="form-input" placeholder="you@example.com" />
              {errors.email && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"}
                    {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 chars" } })}
                    className="form-input pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }}>
                    {showPass ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.password.message}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Confirm *</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "Required",
                      validate: val => val === watch("password") || "Doesn't match",
                    })}
                    className="form-input pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }}>
                    {showConfirm ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "var(--color-muted)", marginTop: "2px" }}>
              By signing up, you agree to our{" "}
              <Link to="/" style={{ color: "#f5a623" }}>Terms of Service</Link> and{" "}
              <Link to="/" style={{ color: "#f5a623" }}>Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-4" style={{ marginTop: "4px" }}>
              {loading ? <Spinner size="sm" /> : <>Create Account <FaArrowRight size={14} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
