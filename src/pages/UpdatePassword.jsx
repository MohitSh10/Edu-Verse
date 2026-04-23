import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineLockClosed, HiOutlineLightningBolt } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";
import { resetPassword } from "../services/authAPI";
import { Spinner } from "../components/common/index";

export default function UpdatePassword() {
  const [showPass, setShowPass] = useState(false);
  const { loading } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = data => dispatch(resetPassword(token, data.password, data.confirmPassword, navigate));

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4"
      style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.3)" }}>
            <HiOutlineLockClosed size={28} style={{ color: "#00e5a0" }} />
          </div>
        </div>
        <div className="glass-card p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f5a623,#f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={13} />
            </div>
            <span style={{ color:"#f5a623",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:"13px" }}>EduVerse</span>
          </div>
          <h1 className="text-center" style={{ fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:"26px",color:"white",marginBottom:"8px" }}>
            Reset Password
          </h1>
          <p className="text-center" style={{ color:"var(--color-muted)",fontSize:"14px",marginBottom:"28px" }}>
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label style={{ display:"block",fontSize:"12px",fontWeight:600,color:"var(--color-muted)",marginBottom:"6px" }}>New Password</label>
              <div className="relative">
                <input type={showPass?"text":"password"}
                  {...register("password",{required:"Required",minLength:{value:8,message:"Min 8 characters"}})}
                  className="form-input pr-12" placeholder="••••••••" />
                <button type="button" onClick={()=>setShowPass(p=>!p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{color:"var(--color-muted)"}}>
                  {showPass?<AiOutlineEyeInvisible size={17}/>:<AiOutlineEye size={17}/>}
                </button>
              </div>
              {errors.password&&<p style={{color:"#ff4d6d",fontSize:"11px",marginTop:"4px"}}>{errors.password.message}</p>}
            </div>
            <div>
              <label style={{ display:"block",fontSize:"12px",fontWeight:600,color:"var(--color-muted)",marginBottom:"6px" }}>Confirm Password</label>
              <input type="password"
                {...register("confirmPassword",{required:"Required",validate:v=>v===watch("password")||"Doesn't match"})}
                className="form-input" placeholder="••••••••" />
              {errors.confirmPassword&&<p style={{color:"#ff4d6d",fontSize:"11px",marginTop:"4px"}}>{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
              {loading?<Spinner size="sm"/>:<>Reset Password <FaArrowRight size={14}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
