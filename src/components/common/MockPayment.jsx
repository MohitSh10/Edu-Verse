/**
 * MockPayment.jsx
 * A beautiful, realistic mock payment modal.
 * Simulates Card, UPI, and Net Banking flows.
 * Triggers onSuccess(paymentId) after a realistic delay.
 */
import { useState, useEffect } from "react";
import { FaLock, FaCreditCard, FaMobileAlt, FaUniversity, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { SiVisa, SiMastercard, SiRazorpay } from "react-icons/si";
import { HiOutlineX, HiOutlineShieldCheck } from "react-icons/hi";
import { MdVerified } from "react-icons/md";

// ── Card number formatter ────────────────────────────────────────────────────
function formatCard(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(val) {
  const v = val.replace(/\D/g, "").slice(0, 4);
  return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
}

// ── UPI Apps ─────────────────────────────────────────────────────────────────
const UPI_APPS = [
  { name: "Google Pay", emoji: "🟡", id: "gpay" },
  { name: "PhonePe", emoji: "🟣", id: "phonepe" },
  { name: "Paytm", emoji: "🔵", id: "paytm" },
  { name: "BHIM", emoji: "🟢", id: "bhim" },
];

// ── Banks ─────────────────────────────────────────────────────────────────────
const BANKS = [
  "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda",
];

// ── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = {
  SELECT: "select",
  FORM: "form",
  PROCESSING: "processing",
  SUCCESS: "success",
};

export default function MockPayment({ amount, courses = [], onSuccess, onClose }) {
  const [tab, setTab] = useState("card");
  const [step, setStep] = useState(STEPS.SELECT);
  const [progress, setProgress] = useState(0);

  // Card form state
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId, setUpiId] = useState("");
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [selectedBank, setSelectedBank] = useState("");

  // ── Simulate payment ──────────────────────────────────────────────────────
  const simulatePayment = () => {
    setStep(STEPS.PROCESSING);
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep(STEPS.SUCCESS), 400);
      }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  // ── Success: notify parent ─────────────────────────────────────────────────
  useEffect(() => {
    if (step === STEPS.SUCCESS) {
      const payId = "pay_mock_" + Math.random().toString(36).slice(2, 14).toUpperCase();
      setTimeout(() => onSuccess(payId), 1800);
    }
  }, [step]);

  // ── Card validation ────────────────────────────────────────────────────────
  const isCardValid = card.number.replace(/\s/g, "").length === 16 && card.expiry.length === 5 && card.cvv.length >= 3 && card.name.length >= 2;
  const isUpiValid = selectedUpi || upiId.includes("@");
  const isBankValid = selectedBank !== "";

  const canProceed = tab === "card" ? isCardValid : tab === "upi" ? isUpiValid : isBankValid;

  // ── Detect card brand ──────────────────────────────────────────────────────
  const cardNum = card.number.replace(/\s/g, "");
  const isVisa = cardNum.startsWith("4");
  const isMaster = cardNum.startsWith("5");

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}>

      <div className="w-full max-w-lg relative mx-auto my-auto" style={{ animation: "fadeUp 0.4s ease", minHeight: "100%", display: "flex", alignItems: "center" }}>
      <div className="w-full">
        
        {/* ── Processing overlay ── */}
        {step === STEPS.PROCESSING && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl"
            style={{ background: "rgba(2, 11, 24, 0.97)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-[#f5a623]/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{
                  background: `conic-gradient(#f5a623 ${progress * 3.6}deg, rgba(245,166,35,0.1) 0deg)`,
                  transition: "background 0.2s"
                }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: "#f5a623", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: "16px" }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <h3 style={{ fontFamily: "Sora, sans-serif", color: "white", fontWeight: 700, fontSize: "20px", marginBottom: "8px" }}>
              Processing Payment...
            </h3>
            <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>Please don't close this window</p>
            <div className="mt-6 flex items-center gap-2">
              <FaLock size={12} style={{ color: "#00e5a0" }} />
              <span style={{ color: "#00e5a0", fontSize: "12px" }}>256-bit SSL Encrypted</span>
            </div>
          </div>
        )}

        {/* ── Success overlay ── */}
        {step === STEPS.SUCCESS && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl"
            style={{ background: "rgba(2, 11, 24, 0.97)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center" style={{ background: "rgba(0,229,160,0.15)", border: "2px solid #00e5a0" }}>
              <FaCheckCircle size={36} style={{ color: "#00e5a0" }} />
            </div>
            <h3 style={{ fontFamily: "Sora, sans-serif", color: "white", fontWeight: 800, fontSize: "24px", marginBottom: "8px" }}>
              Payment Successful!
            </h3>
            <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "6px" }}>₹{amount?.toLocaleString()} paid</p>
            <p style={{ color: "#00e5a0", fontSize: "13px" }}>Redirecting you to your courses...</p>
          </div>
        )}

        {/* ── Main modal ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>
          
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "white", fontSize: "18px" }}>
                Complete Purchase
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "2px" }}>
                {courses.length} course{courses.length !== 1 ? "s" : ""} · <span style={{ color: "#f5a623", fontWeight: 700 }}>₹{amount?.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)" }}>
                <HiOutlineShieldCheck style={{ color: "#00e5a0" }} size={14} />
                <span style={{ color: "#00e5a0", fontSize: "11px", fontWeight: 600 }}>Secure</span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: "var(--color-muted)" }}>
                <HiOutlineX size={20} />
              </button>
            </div>
          </div>

          {/* Course list */}
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
            {courses.slice(0, 2).map(c => (
              <div key={c._id} className="flex items-center gap-3 py-2">
                <img src={c.thumbnail} alt={c.courseName} className="w-10 h-7 rounded-lg object-cover flex-shrink-0" />
                <p style={{ color: "var(--color-text)", fontSize: "13px", flex: 1, fontWeight: 500 }} className="truncate">{c.courseName}</p>
                <p style={{ color: "#f5a623", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>₹{c.price?.toLocaleString()}</p>
              </div>
            ))}
            {courses.length > 2 && <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>+{courses.length - 2} more courses</p>}
          </div>

          <div className="px-6 py-5">
            {/* Payment method tabs */}
            <div className="flex gap-2 mb-6 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { id: "card", icon: FaCreditCard, label: "Card" },
                { id: "upi", icon: FaMobileAlt, label: "UPI" },
                { id: "netbanking", icon: FaUniversity, label: "Net Banking" },
              ].map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: tab === id ? "linear-gradient(135deg, #f5a623, #f7c94b)" : "transparent",
                    color: tab === id ? "#020b18" : "var(--color-muted)",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                  }}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* ── Card Tab ── */}
            {tab === "card" && (
              <div className="space-y-4">
                {/* Card preview */}
                <div className="relative p-5 rounded-2xl overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #0a2040, #061525)", border: "1px solid rgba(255,255,255,0.1)", minHeight: "140px" }}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-10 h-7 rounded-md" style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }} />
                    <div className="flex gap-2">
                      {isVisa && <SiVisa size={28} color="white" />}
                      {isMaster && <SiMastercard size={24} color="#f5a623" />}
                      {!isVisa && !isMaster && <div className="text-white/30 text-sm">CARD</div>}
                    </div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "JetBrains Mono, monospace", fontSize: "16px", letterSpacing: "4px", marginBottom: "12px" }}>
                    {card.number || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between">
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", textTransform: "uppercase" }}>Card Holder</p>
                      <p style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>{card.name || "YOUR NAME"}</p>
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", textTransform: "uppercase" }}>Expires</p>
                      <p style={{ color: "white", fontSize: "12px", fontWeight: 600 }}>{card.expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                <input className="form-input" placeholder="Cardholder Name"
                  value={card.name}
                  onChange={e => setCard(p => ({ ...p, name: e.target.value }))} />
                <input className="form-input" placeholder="Card Number"
                  value={card.number}
                  style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: "2px" }}
                  onChange={e => setCard(p => ({ ...p, number: formatCard(e.target.value) }))} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="form-input" placeholder="MM/YY"
                    value={card.expiry}
                    onChange={e => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
                  <input className="form-input" placeholder="CVV" maxLength={4}
                    value={card.cvv}
                    onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
                </div>

                {/* Test card hint */}
                <div className="p-3 rounded-xl" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}>
                  <p style={{ color: "#00d4ff", fontSize: "11px", fontWeight: 600 }}>💳 Test Card: 4111 1111 1111 1111 · 12/26 · 123</p>
                </div>
              </div>
            )}

            {/* ── UPI Tab ── */}
            {tab === "upi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {UPI_APPS.map(app => (
                    <button key={app.id} onClick={() => setSelectedUpi(app.id)}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
                      style={{
                        background: selectedUpi === app.id ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedUpi === app.id ? "rgba(245,166,35,0.4)" : "rgba(255,255,255,0.08)"}`,
                      }}>
                      <span style={{ fontSize: "24px" }}>{app.emoji}</span>
                      <span style={{ color: selectedUpi === app.id ? "#f5a623" : "var(--color-muted)", fontSize: "10px", fontWeight: 600 }}>{app.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <span style={{ color: "var(--color-muted)", fontSize: "12px" }}>or enter UPI ID</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
                <input className="form-input" placeholder="username@upi (e.g. demo@okaxis)"
                  value={upiId}
                  onChange={e => { setUpiId(e.target.value); setSelectedUpi(null); }} />
                <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>
                  💡 Any valid UPI ID works for this demo
                </p>
              </div>
            )}

            {/* ── Net Banking Tab ── */}
            {tab === "netbanking" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {BANKS.map(bank => (
                    <button key={bank} onClick={() => setSelectedBank(bank)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                      style={{
                        background: selectedBank === bank ? "rgba(245,166,35,0.08)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedBank === bank ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.06)"}`,
                      }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)" }}>
                        <FaUniversity size={14} style={{ color: "#00d4ff" }} />
                      </div>
                      <span style={{ color: selectedBank === bank ? "#f5a623" : "var(--color-text)", fontSize: "13px", fontWeight: 500, flex: 1 }}>
                        {bank}
                      </span>
                      {selectedBank === bank && <MdVerified style={{ color: "#f5a623" }} size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pay button ── */}
            <button
              onClick={simulatePayment}
              disabled={!canProceed}
              className="btn-primary w-full justify-center text-base mt-5"
              style={{ padding: "16px", opacity: canProceed ? 1 : 0.4, cursor: canProceed ? "pointer" : "not-allowed" }}>
              <FaLock size={14} />
              Pay ₹{amount?.toLocaleString()} Securely
              <FaArrowRight size={14} />
            </button>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-5 mt-4">
              {["SSL Secure", "PCI Compliant", "Instant Access"].map(label => (
                <div key={label} className="flex items-center gap-1.5">
                  <HiOutlineShieldCheck size={12} style={{ color: "#00e5a0" }} />
                  <span style={{ color: "var(--color-muted)", fontSize: "11px" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
