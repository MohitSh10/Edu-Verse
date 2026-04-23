import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
import { VscDashboard, VscSettingsGear, VscSignOut } from "react-icons/vsc";
import { logout } from "../../services/authAPI";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileDropdown() {
  const { user } = useSelector(s => s.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;
  const dashPath = user.accountType === "Instructor" ? "/dashboard/instructor" : "/dashboard/my-profile";

  const panelStyle = {
    background: isLight ? "rgba(255,255,255,0.99)" : "rgba(6,21,37,0.98)",
    border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}`,
    backdropFilter: "blur(20px)",
    boxShadow: isLight ? "0 20px 60px rgba(0,0,0,0.15)" : "0 20px 60px rgba(0,0,0,0.5)",
  };

  const dividerStyle = { borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)"}` };
  const nameColor = isLight ? "#0d1f30" : "white";
  const mutedColor = isLight ? "#5a7a95" : "var(--color-muted)";

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)} className="flex items-center gap-2">
        <img
          src={user.image} alt={user.firstName}
          className="w-9 h-9 rounded-xl object-cover transition-all"
          style={{ border: "2px solid rgba(245,166,35,0.4)" }}
        />
        <BsChevronDown
          size={11}
          style={{ color: "var(--color-muted)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl overflow-hidden z-50" style={panelStyle}>
          {/* User info */}
          <div className="px-4 py-3" style={dividerStyle}>
            <p style={{ color: nameColor, fontWeight: 700, fontSize: "14px" }}>{user.firstName} {user.lastName}</p>
            <p style={{ color: mutedColor, fontSize: "11px" }} className="truncate">{user.email}</p>
            <span
              className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: user.accountType === "Instructor" ? "rgba(0,212,255,0.1)" : "rgba(245,166,35,0.1)",
                color: user.accountType === "Instructor" ? "#00d4ff" : "#f5a623",
                border: `1px solid ${user.accountType === "Instructor" ? "rgba(0,212,255,0.25)" : "rgba(245,166,35,0.25)"}`,
              }}
            >
              {user.accountType}
            </span>
          </div>

          {/* Nav links */}
          {[
            { to: dashPath, icon: VscDashboard, label: "Dashboard" },
            { to: "/dashboard/settings", icon: VscSettingsGear, label: "Settings" },
          ].map(({ to, icon: Icon, label }) => (
            <Link
              key={to} to={to} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
              style={{ color: mutedColor }}
              onMouseEnter={e => { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)"; e.currentTarget.style.color = nameColor; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = mutedColor; }}
            >
              <Icon size={15} /> {label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={() => { dispatch(logout(navigate)); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
            style={{ color: "#ff4d6d", borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}` }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,77,109,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <VscSignOut size={15} /> Log Out
          </button>
        </div>
      )}
    </div>
  );
}
