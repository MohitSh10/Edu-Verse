import { Link } from "react-router-dom";
import { FaArrowRight, FaHome } from "react-icons/fa";
import { HiOutlineEmojiSad } from "react-icons/hi";

export default function Error() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--color-bg)" }}>

      {/* Big 404 */}
      <div className="relative mb-6 select-none">
        <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 900, fontSize: "clamp(100px, 20vw, 200px)", lineHeight: 1,
          background: "linear-gradient(135deg, rgba(245,166,35,0.15) 0%, rgba(0,212,255,0.1) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <HiOutlineEmojiSad size={60} style={{ color: "rgba(245,166,35,0.4)" }} />
        </div>
      </div>

      <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "28px", color: "white", marginBottom: "12px" }}>
        Page Not Found
      </h1>
      <p style={{ color: "var(--color-muted)", fontSize: "16px", maxWidth: "400px", marginBottom: "40px", lineHeight: "1.7" }}>
        Looks like you've ventured into uncharted territory. This page doesn't exist or has been moved.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="btn-primary px-8 py-3.5 text-base">
          <FaHome size={16} /> Go Home
        </Link>
        <Link to="/catalog" className="btn-secondary px-8 py-3.5 text-base">
          Browse Courses <FaArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
