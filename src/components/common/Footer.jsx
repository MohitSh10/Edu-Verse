import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub, FaYoutube, FaInstagram } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";

const LINKS = {
  Platform: [
    { label: "Browse Courses", path: "/catalog" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Blog", path: "/" },
  ],
  "For Learners": [
    { label: "Student Dashboard", path: "/dashboard/my-profile" },
    { label: "My Courses", path: "/dashboard/enrolled-courses" },
    { label: "Certificates", path: "/" },
    { label: "Learning Paths", path: "/" },
  ],
  "For Instructors": [
    { label: "Start Teaching", path: "/signup" },
    { label: "Instructor Dashboard", path: "/dashboard/instructor" },
    { label: "Course Builder", path: "/dashboard/add-course" },
    { label: "Revenue Reports", path: "/" },
  ],
};

const SOCIALS = [
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { Icon: FaYoutube, href: "#", label: "YouTube" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaGithub, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-surface)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      
      {/* Top section */}
      <div className="max-w-maxContent mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
              <HiOutlineLightningBolt className="text-black" size={20} />
            </div>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "22px" }}>
              <span style={{ color: "#f5a623" }}>Edu</span>
              <span style={{ color: "var(--color-text)" }}>Verse</span>
            </span>
          </Link>
          
          <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.8", maxWidth: "280px", marginBottom: "24px" }}>
            India's leading online learning platform. Empowering 50,000+ learners with skills that matter.
          </p>

          {/* Newsletter */}
          <div className="mb-6">
            <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "13px", marginBottom: "10px" }}>Get weekly course updates</p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-text)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                onFocus={e => e.target.style.borderColor = "#f5a623"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button className="btn-primary text-sm px-4 py-2.5">Subscribe</button>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--color-muted)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,166,35,0.1)"; e.currentTarget.style.borderColor = "rgba(245,166,35,0.3)"; e.currentTarget.style.color = "#f5a623"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--color-muted)"; }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title}>
            <h4 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "13px", color: "white", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {title}
            </h4>
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.label}>
                  <Link to={item.path}
                    style={{ color: "var(--color-muted)", fontSize: "13px", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#f5a623"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-maxContent mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>
          © {new Date().getFullYear()} EduVerse Technologies Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
            <Link key={item} to="/" style={{ color: "var(--color-muted)", fontSize: "12px", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#f5a623"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--color-muted)"}>
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
