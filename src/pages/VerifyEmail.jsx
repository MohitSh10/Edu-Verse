import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OtpInput from "react-otp-input";
import { signup, sendOTP } from "../services/authAPI";
import { Spinner } from "../components/common/index";
import { HiOutlineMail, HiOutlineLightningBolt } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const { loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signupData = (() => { try { return JSON.parse(localStorage.getItem("signupData")); } catch { return null; } })();

  useEffect(() => { if (!signupData) navigate("/signup"); }, []);
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleVerify = () => {
    if (!signupData) return navigate("/signup");
    dispatch(signup({ ...signupData, otp }, navigate));
  };

  const handleResend = () => {
    if (signupData) { dispatch(sendOTP(signupData.email, navigate)); setTimer(30); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)" }}>
            <HiOutlineMail size={30} style={{ color: "#f5a623" }} />
          </div>
        </div>

        <div className="glass-card p-8 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={13} />
            </div>
            <span style={{ color: "#f5a623", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "13px" }}>EduVerse</span>
          </div>

          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "26px", color: "white", marginBottom: "8px" }}>
            Check your email
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "8px" }}>
            We sent a 6-digit code to
          </p>
          <p style={{ color: "#f5a623", fontWeight: 600, fontSize: "15px", marginBottom: "32px" }}>
            {signupData?.email || "your email"}
          </p>

          {/* OTP inputs */}
          <div className="flex justify-center mb-8">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={props => (
                <input {...props}
                  style={{
                    width: "48px", height: "56px",
                    margin: "0 4px",
                    background: otp[props["data-index"]] ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${otp[props["data-index"]] ? "#f5a623" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                    fontFamily: "JetBrains Mono, monospace",
                    transition: "all 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#f5a623"}
                  onBlur={e => e.target.style.borderColor = otp[e.target.dataset?.index] ? "#f5a623" : "rgba(255,255,255,0.1)"}
                />
              )}
            />
          </div>

          <button onClick={handleVerify} disabled={loading || otp.length !== 6}
            className="btn-primary w-full justify-center text-base py-4"
            style={{ opacity: otp.length === 6 ? 1 : 0.4 }}>
            {loading ? <Spinner size="sm" /> : <>Verify & Continue <FaArrowRight size={14} /></>}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2" style={{ fontSize: "13px" }}>
            {timer > 0 ? (
              <span style={{ color: "var(--color-muted)" }}>
                Resend in <span style={{ color: "#f5a623", fontWeight: 700 }}>{timer}s</span>
              </span>
            ) : (
              <button onClick={handleResend}
                style={{ color: "#f5a623", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                Resend OTP →
              </button>
            )}
          </div>

          <p style={{ color: "var(--color-muted)", fontSize: "12px", marginTop: "16px" }}>
            Wrong email?{" "}
            <button onClick={() => navigate("/signup")}
              style={{ color: "#f5a623", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              Go back
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
