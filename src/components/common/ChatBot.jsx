/**
 * ChatBot.jsx — EduVerse AI Assistant
 * A floating chatbot that guides users through the platform.
 * Handles: login help, signup guide, student vs instructor FAQ,
 * course info, payment queries, and contact info.
 */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRobot, FaTimes, FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { HiOutlineLightningBolt, HiOutlineRefresh } from "react-icons/hi";

// ── Knowledge base ──────────────────────────────────────────────────────────
const BOT_NAME = "EduBot";

const QUICK_REPLIES = [
  "How do I sign up?",
  "What's the difference between Student and Instructor?",
  "How does payment work?",
  "How do I enroll in a course?",
  "I forgot my password",
  "Contact support",
];

function matchIntent(text) {
  const t = text.toLowerCase();
  if (/(sign.?up|register|creat|join|account)/i.test(t)) return "signup";
  if (/(log.?in|sign.?in|login|password)/i.test(t)) return "login";
  if (/(forgot|reset|recover|can't log)/i.test(t)) return "forgotPassword";
  if (/(instructor|teach|creat.* course|earn)/i.test(t)) return "instructor";
  if (/(student|learn|enroll|take course)/i.test(t)) return "student";
  if (/(pay|checkout|cart|buy|price|cost|razorpay|refund|money)/i.test(t)) return "payment";
  if (/(certif)/i.test(t)) return "certificate";
  if (/(contact|support|help|email|phone|reach)/i.test(t)) return "contact";
  if (/(course|catalog|browse|find)/i.test(t)) return "courses";
  if (/(differ|compare|student vs|vs instructor)/i.test(t)) return "difference";
  if (/(hi|hello|hey|good|helo|hii)/i.test(t)) return "greeting";
  if (/(thanks|thank you|thx)/i.test(t)) return "thanks";
  return "default";
}

const RESPONSES = {
  greeting: {
    text: "Hello! 👋 I'm **EduBot**, your EduVerse guide. I can help you with:",
    links: [],
    suggestions: ["Sign up guide", "How courses work", "Payment help"],
  },
  signup: {
    text: "Creating an account is super easy! Here's how:\n\n1. Click **Get Started** in the top navbar\n2. Choose your role — **Student** (to learn) or **Instructor** (to teach)\n3. Fill in your name, email, and password\n4. Verify your email with the OTP we send\n5. You're in! 🎉",
    links: [{ label: "Create Account →", to: "/signup" }],
    suggestions: ["Student vs Instructor?", "How does payment work?"],
  },
  login: {
    text: "To sign in:\n\n1. Click **Log In** in the top-right\n2. Enter your email and password\n3. Click **Sign In**\n\nIf you've forgotten your password, I can help with that too!",
    links: [{ label: "Go to Login →", to: "/login" }],
    suggestions: ["Forgot password?", "Create new account"],
  },
  forgotPassword: {
    text: "No worries! To reset your password:\n\n1. Click **Log In** → **Forgot password?**\n2. Enter your registered email\n3. Check your inbox for a reset link\n4. Click the link and create a new password\n\nThe reset link expires in 15 minutes.",
    links: [{ label: "Reset Password →", to: "/forgot-password" }],
    suggestions: ["Login help", "Contact support"],
  },
  student: {
    text: "As a **Student** on EduVerse, you can:\n\n📚 Browse 1,200+ expert courses\n🎯 Track your learning progress\n🏆 Earn industry certificates\n💬 Join community discussions\n📱 Learn on any device, anytime\n\nStart with a free course — no credit card needed!",
    links: [{ label: "Browse Courses →", to: "/" }, { label: "Sign Up Free →", to: "/signup" }],
    suggestions: ["How does payment work?", "What about certificates?"],
  },
  instructor: {
    text: "As an **Instructor** on EduVerse, you can:\n\n🎬 Create unlimited courses\n💰 Set your own price & earn 70% revenue\n🌍 Reach 50,000+ learners globally\n📊 Track earnings & student analytics\n🚀 Use our course builder tools\n\nAverage instructor earns ₹80,000/month!",
    links: [{ label: "Start Teaching →", to: "/signup" }],
    suggestions: ["How does payment work?", "Sign up as instructor"],
  },
  difference: {
    text: "Here's the key difference:\n\n**🎓 Student Account**\n• Browse & enroll in courses\n• Track learning progress\n• Earn certificates\n• Access community\n\n**👩‍💻 Instructor Account**\n• Create & publish courses\n• Earn 70% revenue\n• Manage students\n• Access analytics dashboard\n\nYou choose your role when signing up!",
    links: [{ label: "Create Account →", to: "/signup" }],
    suggestions: ["How do I sign up?", "Payment for instructors"],
  },
  payment: {
    text: "EduVerse offers a safe mock payment system for demo:\n\n💳 **Credit/Debit Card** — Fill in card details\n📱 **UPI** — GPay, PhonePe, Paytm, BHIM\n🏦 **Net Banking** — All major Indian banks\n\n**Test Card:** 4111 1111 1111 1111 · 12/26 · CVV: 123\n\n✅ 30-day money-back guarantee on all courses!",
    links: [{ label: "Browse Courses →", to: "/" }],
    suggestions: ["Do I get a refund?", "What's included in paid courses?"],
  },
  certificate: {
    text: "EduVerse certificates are:\n\n🏆 **Industry Recognized** — Trusted by 200+ companies\n♾️ **Lifetime Valid** — Never expire\n🔗 **Shareable** — Add to LinkedIn, resume\n✅ **Verified** — Includes unique verification ID\n\nYou earn a certificate after completing all course content and passing the final assessment.",
    links: [{ label: "Browse Courses →", to: "/" }],
    suggestions: ["How do I enroll?", "Student account info"],
  },
  contact: {
    text: "You can reach our support team through:\n\n📧 **Email:** support@eduverse.com\n📞 **Phone:** +91 98765 43210\n🕐 **Hours:** Mon–Fri, 9am–6pm IST\n⚡ **Avg Response:** Under 4 hours\n\nOr fill out our contact form for the fastest response!",
    links: [{ label: "Contact Form →", to: "/contact" }],
    suggestions: ["Forgot password?", "Payment help"],
  },
  courses: {
    text: "EduVerse has 1,200+ courses across:\n\n⚡ Web Development (128 courses)\n📊 Data Science (96 courses)\n🎨 UI/UX Design (74 courses)\n🤖 Machine Learning (82 courses)\n📱 Mobile Development (61 courses)\n☁️ Cloud & DevOps (53 courses)\n\nAll courses include lifetime access and a certificate!",
    links: [{ label: "Browse All Courses →", to: "/" }, { label: "Sign Up Free →", to: "/signup" }],
    suggestions: ["How do I enroll?", "Payment options"],
  },
  thanks: {
    text: "You're welcome! 😊 Is there anything else I can help you with? I'm here whenever you need guidance on EduVerse!",
    links: [],
    suggestions: ["Browse courses", "How to sign up?"],
  },
  default: {
    text: "I'm not sure about that, but I can help you with these common topics. What would you like to know?",
    links: [{ label: "Browse Courses →", to: "/" }],
    suggestions: ["How do I sign up?", "Payment help", "Contact support"],
  },
};

// ── Message component ────────────────────────────────────────────────────────
function Message({ msg }) {
  const isBot = msg.role === "bot";

  const parseText = text =>
    text.split("\n").map((line, i) => {
      const parsed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} dangerouslySetInnerHTML={{ __html: parsed }} style={{ marginBottom: "2px", lineHeight: "1.6" }} />;
    });

  return (
    <div className={`flex gap-2.5 ${isBot ? "" : "flex-row-reverse"}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
          <FaRobot size={14} className="text-black" />
        </div>
      )}

      <div style={{ maxWidth: "82%" }}>
        <div className="rounded-2xl px-4 py-3"
          style={{
            background: isBot ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg, #f5a623, #f7c94b)",
            color: isBot ? "var(--color-text)" : "#020b18",
            borderRadius: isBot ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            fontSize: "13px",
          }}>
          {parseText(msg.text)}
        </div>

        {/* Links */}
        {isBot && msg.links?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {msg.links.map(link => (
              <Link key={link.label} to={link.to}
                className="text-xs px-3 py-1.5 rounded-full font-semibold"
                style={{ background: "rgba(245,166,35,0.12)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.25)" }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ChatBot ──────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState(QUICK_REPLIES);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useSelector(s => s.profile);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Welcome message when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = user
        ? { role: "bot", text: `Welcome back, ${user.firstName}! 👋 How can I help you today?`, links: [], suggestions: QUICK_REPLIES }
        : { role: "bot", text: `Hi there! 👋 I'm **${BOT_NAME}**, your EduVerse guide. I can help you with signing up, finding courses, payment, and more!\n\nWhat brings you here today?`, links: [], suggestions: QUICK_REPLIES };
      setMessages([greeting]);
      setSuggestions(greeting.suggestions || QUICK_REPLIES);
    }
  }, [open]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setTyping(true);
    setSuggestions([]);

    // Simulate typing delay
    setTimeout(() => {
      const intent = matchIntent(msg);
      const response = RESPONSES[intent] || RESPONSES.default;
      setMessages(prev => [...prev, { role: "bot", ...response }]);
      setSuggestions(response.suggestions || []);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  const resetChat = () => {
    setMessages([]);
    setSuggestions(QUICK_REPLIES);
    setTyping(false);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-glow transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)", boxShadow: "0 8px 30px rgba(245,166,35,0.4)" }}
        aria-label="Chat with EduBot">
        {open
          ? <FaChevronDown size={18} className="text-black" />
          : <FaRobot size={22} className="text-black" />
        }

        {/* Notification dot when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
            style={{ background: "#ff4d6d", color: "white" }}>!</span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[100] w-[360px] max-h-[560px] flex flex-col rounded-3xl overflow-hidden"
          style={{
            background: "rgba(6, 21, 37, 0.98)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(245,166,35,0.1)",
            animation: "fadeUp 0.3s ease",
          }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(0,212,255,0.08))", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
                <FaRobot size={16} className="text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p style={{ color: "white", fontWeight: 700, fontSize: "14px", fontFamily: "Sora, sans-serif" }}>{BOT_NAME}</p>
                  <span className="w-2 h-2 rounded-full bg-[#00e5a0] animate-pulse" />
                </div>
                <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>EduVerse AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={resetChat} title="Restart chat"
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "var(--color-muted)" }}>
                <HiOutlineRefresh size={15} />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "var(--color-muted)" }}>
                <FaTimes size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: "0" }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}

            {/* Typing indicator */}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
                  <FaRobot size={14} className="text-black" />
                </div>
                <div className="rounded-2xl px-4 py-3 flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px 16px 16px 16px" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} className="w-2 h-2 rounded-full"
                      style={{ background: "#f5a623", animation: `bounce 1s ${delay}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && !typing && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--color-muted)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex gap-2">
              <input ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--color-text)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }} />
              <button onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}>
                <FaPaperPlane size={13} className="text-black" />
              </button>
            </div>
            <p style={{ color: "var(--color-muted)", fontSize: "10px", textAlign: "center", marginTop: "8px" }}>
              Powered by EduVerse AI · 
              <Link to="/contact" style={{ color: "#f5a623", marginLeft: "4px" }}>Talk to a human →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
