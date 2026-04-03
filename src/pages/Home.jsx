import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import {
  FaArrowRight, FaStar, FaQuoteLeft, FaCheckCircle,
  FaUsers, FaBookOpen, FaTrophy, FaGlobe
} from "react-icons/fa";
import {
  HiOutlineClock, HiOutlineBookOpen,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { MdOutlineVerified, MdPlayLesson, MdWorkspacePremium } from "react-icons/md";
import CourseCard from "../components/common/CourseCard";
import Footer from "../components/common/Footer";
import { RatingStars } from "../components/common/index";
import { fetchAllCourses, fetchAllReviews } from "../services/courseAPI";
import { useTheme } from "../context/ThemeContext";

// ── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Active Learners", icon: FaUsers, color: "#f5a623" },
  { value: "1,200+", label: "Expert Courses", icon: FaBookOpen, color: "#00d4ff" },
  { value: "98%", label: "Satisfaction Rate", icon: FaTrophy, color: "#00e5a0" },
  { value: "40+", label: "Countries", icon: FaGlobe, color: "#ff4d6d" },
];

const CATEGORIES = [
  { label: "Web Development",  slug: "web-development",  emoji: "⚡", desc: "HTML, CSS, JS, React", gradient: "from-[#00d4ff]/20 to-[#00d4ff]/5", border: "border-[#00d4ff]/20", text: "text-[#00d4ff]" },
  { label: "Data Science",     slug: "data-science",     emoji: "📊", desc: "Python, ML, AI",        gradient: "from-[#f5a623]/20 to-[#f5a623]/5", border: "border-[#f5a623]/20", text: "text-[#f5a623]" },
  { label: "Cybersecurity",    slug: "cybersecurity",    emoji: "🔒", desc: "Ethical hacking, Security", gradient: "from-[#ff4d6d]/20 to-[#ff4d6d]/5", border: "border-[#ff4d6d]/20", text: "text-[#ff4d6d]" },
  { label: "Cloud Computing",  slug: "cloud-computing",  emoji: "☁️", desc: "AWS, Azure, GCP",      gradient: "from-[#00e5a0]/20 to-[#00e5a0]/5", border: "border-[#00e5a0]/20", text: "text-[#00e5a0]" },
  { label: "Mobile Development", slug: "mobile-development", emoji: "📱", desc: "iOS, Android, Flutter", gradient: "from-[#a855f7]/20 to-[#a855f7]/5", border: "border-[#a855f7]/20", text: "text-[#a855f7]" },
  { label: "DevOps",           slug: "devops",           emoji: "⚙️", desc: "CI/CD, Docker, K8s",  gradient: "from-[#f97316]/20 to-[#f97316]/5", border: "border-[#f97316]/20", text: "text-[#f97316]" },
];

const WHY_US = [
  { icon: MdPlayLesson, title: "Live Tutoring Sessions", desc: "Real-time sessions with expert instructors. Ask questions, get instant feedback.", tag: "NEW" },
  { icon: HiOutlineClock, title: "Learn at Your Pace", desc: "Lifetime access to all content. Study on your schedule, from any device." },
  { icon: MdOutlineVerified, title: "Verified Certificates", desc: "Industry-recognized certificates that employers trust and respect worldwide." },
  { icon: MdWorkspacePremium, title: "Premium Community", desc: "Join 50,000+ learners. Peer discussions, projects, and networking events." },
];

const FEATURED_INSTRUCTORS = [
  { name: "Dr. Aryan Kapoor", role: "ML & AI Engineer", company: "ex-Google DeepMind", courses: 14, students: "12.4k", rating: 4.9, color: "#00d4ff", seed: "aryan" },
  { name: "Priya Nair", role: "Full Stack Architect", company: "ex-Netflix", courses: 9, students: "8.7k", rating: 4.8, color: "#f5a623", seed: "priya" },
  { name: "Rohit Verma", role: "Data Science Lead", company: "ex-Amazon", courses: 11, students: "6.2k", rating: 4.9, color: "#00e5a0", seed: "rohit" },
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    fetchAllCourses({ limit: 8, sort: "popular" }).then(d => { if (d?.data) setCourses(d.data); });
    fetchAllReviews().then(setReviews);
  }, []);

  // Theme-aware section backgrounds
  const heroBg = isLight
    ? "linear-gradient(135deg, #dce8f8 0%, #cfddf5 50%, #dce8f8 100%)"
    : "linear-gradient(135deg, #020b18 0%, #061525 50%, #020b18 100%)";
  const statsBg = isLight
    ? "linear-gradient(90deg, #e4eef8 0%, #eaf4fc 50%, #e4eef8 100%)"
    : "linear-gradient(90deg, #061525 0%, #081e33 50%, #061525 100%)";
  const sectionBg = isLight
    ? "linear-gradient(180deg, #eaf4fc 0%, #f0f6ff 100%)"
    : "linear-gradient(180deg, #061525 0%, #020b18 100%)";
  const altSectionBg = isLight
    ? "linear-gradient(135deg, #e8f2fc 0%, #dce8f8 100%)"
    : "linear-gradient(135deg, #061525 0%, #081e33 100%)";
  const ctaBg = isLight
    ? "linear-gradient(135deg, #d8e8f5 0%, #c8d8ec 50%, #d8e8f5 100%)"
    : "linear-gradient(135deg, #061525 0%, #0a2040 50%, #061525 100%)";
  const borderColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════ HERO ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: heroBg }}>

        {/* Animated background orbs */}
        <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-maxContent mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left: Text content */}
            <div>
              <div className="badge badge-gold mb-6 fade-up-1">
                <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
                🎓 India's #1 Online Learning Platform
              </div>

              <h1 className="section-heading text-5xl md:text-6xl xl:text-7xl mb-6 fade-up-2" style={{ lineHeight: 1.1 }}>
                Learn{" "}
                <span className="relative">
                  <TypeAnimation
                    sequence={["Coding", 2000, "Design", 2000, "Data Science", 2000, "AI & ML", 2000]}
                    wrapper="span"
                    repeat={Infinity}
                    className="gradient-text"
                  />
                </span>
                <br />
                <span style={{ color: "var(--color-muted)" }}>from the Best</span>
              </h1>

              <p className="text-[#7a9ab8] text-xl leading-relaxed mb-8 max-w-xl fade-up-3">
                Join 50,000+ learners building real-world skills with live tutoring,
                hands-on projects, and mentor support. Start free — no credit card needed.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-3 mb-8 fade-up-3">
                {[
                  { icon: "🎓", label: "Expert Instructors", sub: "Industry veterans" },
                  { icon: "🏆", label: "Verified Certificates", sub: "Employer trusted" },
                  { icon: "⚡", label: "Live Sessions", sub: "Real-time support" },
                  { icon: "📱", label: "Learn Anywhere", sub: "Any device, anytime" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{label}</p>
                      <p className="text-[#7a9ab8] text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-10 fade-up-4">
                <Link to="/signup" className="btn-primary text-base px-8 py-4 pulse-glow">
                  Start Learning Free <FaArrowRight size={14} />
                </Link>
                <Link to="/catalog/web-development" className="btn-secondary text-base px-8 py-4 group">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
                    <FaBookOpen size={10} className="text-black" />
                  </div>
                  Explore Courses
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex items-center gap-4 fade-up-4">
                <div className="flex -space-x-3">
                  {["alice", "bob", "carol", "dave", "eve"].map((seed) => (
                    <img key={seed} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                      className="w-9 h-9 rounded-full border-2 border-[#020b18] bg-[var(--color-surface)]" alt="" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <FaStar key={i} size={12} color="#f5a623" />)}
                    <span className="text-[#f5a623] font-bold text-sm ml-1">4.9</span>
                  </div>
                  <p className="text-[#7a9ab8] text-xs">from 12,000+ reviews</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-white font-bold text-sm">50K+</p>
                  <p className="text-[#7a9ab8] text-xs">happy learners</p>
                </div>
              </div>
            </div>

            {/* Right: Educational Showcase */}
            <div className="relative lg:block float">

              {/* Main large image */}
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(245,166,35,0.12)" }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=85"
                  alt="Students collaborating and learning"
                  className="w-full object-cover"
                  style={{ height: "320px" }}
                  onError={e => e.target.src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                />
              </div>

              {/* Bottom two images */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80"
                    alt="Student studying online"
                    className="w-full object-cover"
                    style={{ height: "150px" }}
                    onError={e => e.target.src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"}
                  />
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
                  <img
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&q=80"
                    alt="Instructor teaching online"
                    className="w-full object-cover"
                    style={{ height: "150px" }}
                    onError={e => e.target.src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"}
                  />
                </div>
              </div>

              {/* Skill chips row */}
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {["React", "Python", "Machine Learning", "UI/UX", "AWS", "Node.js"].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.25)", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* Floating: enrolled today */}
              <div className="absolute -top-5 -right-5 glass-card px-4 py-3 flex items-center gap-3 shadow-glow z-20 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[#00e5a0]/20 flex items-center justify-center">
                  <HiOutlineTrendingUp className="text-[#00e5a0]" size={20} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">+2,340</p>
                  <p className="text-[#7a9ab8] text-xs">enrolled today</p>
                </div>
              </div>

              {/* Floating: certificate */}
              <div className="absolute -bottom-5 -left-5 glass-card px-4 py-3 flex items-center gap-3 z-20 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[#f5a623]/20 flex items-center justify-center">
                  <FaTrophy className="text-[#f5a623]" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Certificate Ready</p>
                  <p className="text-[#7a9ab8] text-xs">Industry recognized</p>
                </div>
              </div>

              {/* Floating: rating */}
              <div className="absolute top-1/2 -left-6 -translate-y-1/2 glass-card px-4 py-3 flex items-center gap-3 z-20 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[#f5a623]/20 flex items-center justify-center">
                  <FaStar className="text-[#f5a623]" size={18} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">4.9 / 5.0</p>
                  <p className="text-[#7a9ab8] text-xs">12K+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ══════════════════════════════════════════════════ */}
      <section style={{ background: statsBg, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-maxContent mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon, color }) => (
            <div key={label} className="text-center group">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: "Sora, sans-serif", color }}>{value}</p>
              <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═════════════════════════════════════════════ */}
      <section className="max-w-maxContent mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="badge badge-blue mb-4 mx-auto">📚 Explore Topics</div>
          <h2 className="section-heading mb-4">Find Your Perfect Course</h2>
          <p style={{ color: "var(--color-muted)", maxWidth: "500px", margin: "0 auto" }}>
            From beginner to expert — we have the course that fits your goals
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(({ label, slug, emoji, desc, gradient, border, text }) => (
            <Link key={label} to={`/catalog/${slug}`}
              className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-5 text-center hover:scale-105 transition-all duration-300 hover:shadow-card group`}>
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{emoji}</div>
              <p className={`text-xs font-bold mb-1 ${text}`}>{label}</p>
              <p className="text-[10px]" style={{ color: "var(--color-muted)" }}>{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════════════════════════════════════ */}
      <section style={{ background: sectionBg, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-maxContent mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <div className="badge badge-green mb-4 mx-auto">🚀 Get Started</div>
            <h2 className="section-heading mb-4">Your Journey in 3 Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px" style={{ background: "linear-gradient(90deg, transparent, #f5a623, transparent)" }} />
            {[
              { step: "01", title: "Sign Up Free", desc: "Create your account in 60 seconds. No credit card required.", icon: "👤", color: "#f5a623" },
              { step: "02", title: "Pick Your Course", desc: "Browse 1,200+ courses from world-class instructors.", icon: "📚", color: "#00d4ff" },
              { step: "03", title: "Learn & Certify", desc: "Complete projects, pass assessments, earn your certificate.", icon: "🏆", color: "#00e5a0" },
            ].map(({ step, title, desc, icon, color }) => (
              <div key={step} className="glass-card p-8 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: color, color: "#020b18", fontFamily: "Sora, sans-serif" }}>{step}</div>
                <div className="text-5xl mb-4 mt-2">{icon}</div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h3>
                <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ POPULAR COURSES ════════════════════════════════════════ */}
      <section className="max-w-maxContent mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="badge badge-gold mb-3">🔥 Trending Now</div>
            <h2 className="section-heading">Popular Courses</h2>
            <p style={{ color: "var(--color-muted)", marginTop: "8px" }}>Hand-picked by our editorial team</p>
          </div>
          <Link to="/catalog/web-development" className="btn-secondary text-sm">View all courses →</Link>
        </div>

        {courses.length === 0 ? (
          <div className="glass-card py-20 text-center">
            <HiOutlineBookOpen size={48} style={{ color: "var(--color-muted)", margin: "0 auto 16px" }} />
            <p style={{ color: "var(--color-muted)" }}>No courses available yet. Check back soon!</p>
            <Link to="/signup" className="btn-primary mt-6 inline-flex">Add the First Course</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </section>

      {/* ═══════════ WHY EDUVERSE ═══════════════════════════════════════════ */}
      <section style={{ background: isLight ? "#f0f6ff" : "#061525", borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-maxContent mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge badge-gold mb-6">⭐ Why We're Different</div>
              <h2 className="section-heading mb-6">Learning That Actually Works</h2>
              <p style={{ color: "var(--color-muted)", marginBottom: "32px", lineHeight: "1.7" }}>
                We combine the best of live instruction with the flexibility of self-paced learning.
                Get mentor support, peer community, and industry connections — all in one platform.
              </p>
              <div className="space-y-4">
                {["Live tutoring with real instructors", "Project-based curriculum", "Career support & job referrals", "Lifetime content access"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <FaCheckCircle style={{ color: "#00e5a0", flexShrink: 0 }} size={18} />
                    <span style={{ color: "var(--color-text)", fontSize: "15px" }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-primary mt-8 inline-flex">Get Started Free <FaArrowRight size={14} /></Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {WHY_US.map(({ icon: Icon, title, desc, tag }) => (
                <div key={title} className="glass-card p-5 hover:border-[rgba(245,166,35,0.3)] transition-colors" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  {tag && <div className="badge badge-gold text-[10px] mb-3 py-0.5">{tag}</div>}
                  <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: "rgba(245,166,35,0.1)" }}>
                    <Icon className="text-[#f5a623]" size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h3>
                  <p style={{ color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.6" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED INSTRUCTORS ═══════════════════════════════════ */}
      <section className="max-w-maxContent mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="badge badge-blue mb-4 mx-auto">👨‍🏫 Expert Faculty</div>
          <h2 className="section-heading mb-4">Learn from Industry Leaders</h2>
          <p style={{ color: "var(--color-muted)", maxWidth: "500px", margin: "0 auto" }}>
            Our instructors have worked at top tech companies and bring real-world experience to every lesson
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURED_INSTRUCTORS.map(inst => (
            <div key={inst.name} className="glass-card p-6 text-center hover:border-[rgba(245,166,35,0.2)] transition-all hover:shadow-glow group">
              <div className="relative inline-block mb-4">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inst.seed}`}
                  className="w-20 h-20 rounded-full mx-auto border-2 bg-[var(--color-surface)]"
                  style={{ borderColor: inst.color }}
                  alt={inst.name} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: inst.color }}>
                  <MdOutlineVerified size={14} className="text-black" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-0.5" style={{ fontFamily: "Sora, sans-serif" }}>{inst.name}</h3>
              <p style={{ color: inst.color, fontSize: "13px", fontWeight: 600 }}>{inst.role}</p>
              <p style={{ color: "var(--color-muted)", fontSize: "12px", marginBottom: "12px" }}>{inst.company}</p>
              <div className="flex justify-center gap-4 text-xs mb-4" style={{ color: "var(--color-muted)" }}>
                <span><strong className="text-white">{inst.courses}</strong> courses</span>
                <span><strong className="text-white">{inst.students}</strong> students</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1,2,3,4,5].map(i => <FaStar key={i} size={12} style={{ color: i <= 4 ? "#f5a623" : "#7a9ab8" }} />)}
                <span className="text-[#f5a623] font-bold text-sm ml-1">{inst.rating}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/signup" className="btn-secondary px-10 py-4 text-base inline-flex">
            Become an Instructor <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ═══════════ INSTRUCTOR CTA ═════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 px-6" style={{ background: ctaBg, borderTop: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />
        <div className="max-w-maxContent mx-auto relative z-10">
          <div className="glass-card p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="badge badge-gold mb-4">💰 Earn While You Teach</div>
              <h2 className="section-heading mb-4">Turn Your Expertise Into Income</h2>
              <p style={{ color: "var(--color-muted)", marginBottom: "24px", lineHeight: "1.7" }}>
                Join 500+ instructors who earn an average of ₹80,000/month sharing their knowledge.
                Set your price, keep 70% revenue, and reach learners worldwide.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[["70%", "Revenue share"], ["₹80K+", "Avg/month"], ["100%", "Creative control"]].map(([v, l]) => (
                  <div key={l} className="text-center p-3 rounded-xl" style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.15)" }}>
                    <p className="text-[#f5a623] font-bold text-xl" style={{ fontFamily: "Sora, sans-serif" }}>{v}</p>
                    <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>{l}</p>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn-primary px-10 py-4 text-base inline-flex">
                Start Teaching Today <FaArrowRight size={14} />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="space-y-3">
                {["Create course content", "Set your own schedule", "Get marketing support", "Receive monthly payouts"].map((step, i) => (
                  <div key={step} className="flex items-center gap-4 glass-card p-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)", color: "#020b18", fontFamily: "Sora, sans-serif" }}>
                      {i + 1}
                    </div>
                    <span style={{ color: "var(--color-text)", fontSize: "14px" }}>{step}</span>
                    <FaCheckCircle style={{ color: "#00e5a0", marginLeft: "auto", flexShrink: 0 }} size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ REVIEWS ════════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="max-w-maxContent mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="badge badge-gold mb-4 mx-auto">💬 Student Love</div>
            <h2 className="section-heading mb-4">What Our Learners Say</h2>
            <p style={{ color: "var(--color-muted)" }}>Real results from real students</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {reviews.slice(0, 6).map(review => (
              <div key={review._id} className="glass-card p-6 relative hover:border-[rgba(245,166,35,0.2)] transition-colors">
                <FaQuoteLeft size={24} style={{ color: "rgba(245,166,35,0.2)", position: "absolute", top: "20px", right: "20px" }} />
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.user?.image} alt={review.user?.firstName} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">{review.user?.firstName} {review.user?.lastName}</p>
                    <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>{review.course?.courseName}</p>
                  </div>
                </div>
                <RatingStars review_count={review.rating} Star_Size={14} />
                <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "12px", lineHeight: "1.7" }} className="line-clamp-3">
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ FINAL CTA ══════════════════════════════════════════════ */}
      <section style={{ background: altSectionBg, borderTop: `1px solid ${borderColor}` }}>
        <div className="max-w-maxContent mx-auto px-6 py-24 text-center">
          <div className="badge badge-gold mb-6 mx-auto">🎯 Your Future Starts Now</div>
          <h2 className="section-heading text-5xl mb-6">
            Ready to Transform<br />
            <span className="gradient-text">Your Career?</span>
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "18px", maxWidth: "500px", margin: "0 auto 40px", lineHeight: "1.7" }}>
            Join 50,000+ learners who have already taken the leap. 
            Start with a free course today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-12 py-5 pulse-glow">
              Get Started — It's Free <FaArrowRight size={16} />
            </Link>
            <Link to="/catalog/web-development" className="btn-secondary text-lg px-12 py-5">
              Browse Courses
            </Link>
          </div>
          <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "24px" }}>
            ✓ No credit card &nbsp; ✓ Cancel anytime &nbsp; ✓ 30-day guarantee
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
