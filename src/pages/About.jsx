import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineLightBulb, HiOutlineGlobeAlt, HiOutlineHeart, HiOutlineTrendingUp } from "react-icons/hi";
import { MdOutlineVerified } from "react-icons/md";
import Footer from "../components/common/Footer";
import { useTheme } from "../context/ThemeContext";

const STATS = [
  { value: "50K+", label: "Students Worldwide", color: "#f5a623" },
  { value: "1,200+", label: "Courses Available", color: "#00d4ff" },
  { value: "500+", label: "Expert Instructors", color: "#00e5a0" },
  { value: "40+", label: "Countries Reached", color: "#ff4d6d" },
];

const VALUES = [
  { icon: HiOutlineLightBulb, title: "Innovation First", desc: "We constantly push the boundaries of online learning with cutting-edge tools, live sessions, and AI-assisted feedback." },
  { icon: HiOutlineGlobeAlt, title: "Accessible Learning", desc: "Quality education shouldn't be a privilege. We offer free courses, scholarships, and affordable pricing for every learner." },
  { icon: HiOutlineHeart, title: "Community Driven", desc: "Learning together is better. Our forums, peer projects, and mentorship programs build real connections." },
  { icon: HiOutlineTrendingUp, title: "Career Focused", desc: "Every course is designed with the job market in mind. We track outcomes and partner with 200+ hiring companies." },
];

const TEAM = [
  { name: "Priya Sharma", role: "Founder & CEO", desc: "Ex-Google engineer. 12 years in EdTech.", seed: "priya", x: "@priyasharma", li: "#" },
  { name: "Arjun Mehta", role: "CTO", desc: "Built platforms serving 10M+ users.", seed: "arjun", x: "@arjunmehta", li: "#" },
  { name: "Sara Khan", role: "Head of Curriculum", desc: "Former IIT professor. PhD in CS Education.", seed: "sara", x: "@sarakhan", li: "#" },
  { name: "Vikram Rao", role: "Head of Partnerships", desc: "Connected 200+ companies to our platform.", seed: "vikram", x: "@vikramrao", li: "#" },
];

const TIMELINE = [
  { year: "2020", title: "Founded", desc: "EduVerse launched with 10 courses and a dream to democratize learning." },
  { year: "2021", title: "First 10K Students", desc: "Reached our first milestone. Expanded to 5 new categories." },
  { year: "2022", title: "Live Sessions Launch", desc: "Introduced real-time tutoring, changing how online learning works." },
  { year: "2023", title: "Global Expansion", desc: "Reached 40+ countries. Partnered with 200+ hiring companies." },
  { year: "2024", title: "50K+ Learners", desc: "Today, EduVerse is India's fastest growing EdTech platform." },
];

export default function About() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 px-6"
        style={{
          background: isLight
            ? "linear-gradient(135deg, #dce8f5 0%, #ccd8ec 100%)"
            : "linear-gradient(135deg, #061525 0%, #020b18 100%)",
          borderBottom: "1px solid var(--color-border)"
        }}>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }} />

        <div className="max-w-maxContent mx-auto text-center relative z-10">
          <div className="badge badge-gold mb-6 mx-auto">🎓 Our Story</div>
          <h1 className="section-heading text-5xl md:text-6xl mb-6">
            Driving Innovation in<br />
            <span className="gradient-text">Online Education</span>
          </h1>
          <p className="mx-auto" style={{ color: "var(--color-muted)", fontSize: "18px", maxWidth: "620px", lineHeight: "1.8" }}>
            EduVerse was born from a simple belief: everyone deserves access to world-class education,
            regardless of where they live or how much they earn.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6" style={{ background: "var(--color-surface)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-maxContent mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label, color }) => (
            <div key={label} className="glass-card p-6 text-center hover:scale-105 transition-transform">
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "36px", color, marginBottom: "6px" }}>{value}</p>
              <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="max-w-maxContent mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="badge badge-blue mb-6">🚀 Our Mission</div>
            <h2 className="section-heading mb-6">
              Education Without<br />
              <span className="gradient-text-blue">Boundaries</span>
            </h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "16px", lineHeight: "1.8", fontSize: "15px" }}>
              We partner with the world's best educators and industry professionals to create immersive,
              project-based learning experiences that prepare you for the real world — not just theory.
            </p>
            <p style={{ color: "var(--color-muted)", marginBottom: "32px", lineHeight: "1.8", fontSize: "15px" }}>
              From absolute beginners to senior professionals looking to upskill, our platform adapts to
              your pace and learning style. Every course is practical, engaging, and immediately applicable.
            </p>
            <Link to="/signup" className="btn-primary px-8 py-4 inline-flex">
              Start Learning Free <FaArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-5 hover:border-[rgba(245,166,35,0.2)] transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(245,166,35,0.1)" }}>
                  <Icon size={20} style={{ color: "#f5a623" }} />
                </div>
                <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "14px", marginBottom: "8px" }}>{title}</h3>
                <p style={{ color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.7" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-6" style={{ background: "var(--color-surface)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-maxContent mx-auto">
          <div className="text-center mb-14">
            <div className="badge badge-green mb-4 mx-auto">📅 Our Journey</div>
            <h2 className="section-heading">How We Got Here</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
              style={{ background: "linear-gradient(180deg, transparent, #f5a623, transparent)" }} />

            <div className="space-y-8">
              {TIMELINE.map(({ year, title, desc }, i) => (
                <div key={year} className={`flex gap-8 items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`glass-card p-5 inline-block text-left max-w-sm ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
                      <p style={{ color: "#f5a623", fontWeight: 700, fontSize: "12px", marginBottom: "4px" }}>{year}</p>
                      <h3 style={{ fontFamily: "Sora, sans-serif", color: "var(--color-text)", fontWeight: 700, marginBottom: "6px" }}>{title}</h3>
                      <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.6" }}>{desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hidden md:flex"
                    style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)", boxShadow: "0 0 20px rgba(245,166,35,0.4)" }}>
                    <span style={{ color: "#020b18", fontSize: "12px", fontWeight: 800, fontFamily: "Sora, sans-serif" }}>{(i + 1)}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="max-w-maxContent mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="badge badge-gold mb-4 mx-auto">👥 The People</div>
          <h2 className="section-heading mb-4">Meet Our Team</h2>
          <p style={{ color: "var(--color-muted)", maxWidth: "480px", margin: "0 auto" }}>
            Passionate educators, engineers, and creators working to transform online learning
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(({ name, role, desc, seed, x, li }) => (
            <div key={name} className="glass-card p-6 text-center group hover:border-[rgba(245,166,35,0.25)] transition-all">
              <div className="relative inline-block mb-4">
                <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`}
                  className="w-20 h-20 rounded-2xl mx-auto bg-[var(--color-surface)] border-2"
                  style={{ borderColor: "rgba(245,166,35,0.3)" }} alt={name} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#f5a623" }}>
                  <MdOutlineVerified size={14} className="text-black" />
                </div>
              </div>
              <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "15px", marginBottom: "2px" }}>{name}</h3>
              <p style={{ color: "#f5a623", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>{role}</p>
              <p style={{ color: "var(--color-muted)", fontSize: "12px", lineHeight: "1.6", marginBottom: "14px" }}>{desc}</p>
              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={li} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623" }}>
                  <FaLinkedin size={13} />
                </a>
                <a href={x} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff" }}>
                  <FaTwitter size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center" style={{ background: "var(--color-surface)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-maxContent mx-auto">
          <h2 className="section-heading mb-4">Ready to Join Our Community?</h2>
          <p style={{ color: "var(--color-muted)", marginBottom: "32px", fontSize: "16px" }}>
            50,000+ learners can't be wrong. Start your journey today — it's free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="btn-primary px-10 py-4 text-base">
              Get Started Free <FaArrowRight size={14} />
            </Link>
            <Link to="/contact" className="btn-secondary px-10 py-4 text-base">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
