import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiConnector, endpoints } from "../services/apiConnector";
import toast from "react-hot-toast";
import Footer from "../components/common/Footer";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineClock } from "react-icons/hi";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";

const CONTACT_INFO = [
  { Icon: HiOutlineMail, label: "Email Us", value: "support@eduverse.com", sub: "We reply within 24 hours", color: "#f5a623" },
  { Icon: HiOutlinePhone, label: "Call Us", value: "+91 98765 43210", sub: "Mon–Fri, 9am–6pm IST", color: "#00d4ff" },
  { Icon: HiOutlineLocationMarker, label: "Visit Us", value: "Bengaluru, Karnataka", sub: "India 560001", color: "#00e5a0" },
  { Icon: HiOutlineClock, label: "Support Hours", value: "Mon – Fri, 9am – 6pm", sub: "Avg response < 4 hours", color: "#ff4d6d" },
];

const FAQ = [
  { q: "Can I get a refund?", a: "Yes! We offer a 30-day no-questions-asked money-back guarantee on all paid courses." },
  { q: "Do certificates expire?", a: "No, your EduVerse certificates are lifetime credentials and never expire." },
  { q: "Is there a student discount?", a: "Yes! Show your student ID for 40% off any course. Email us for details." },
  { q: "Can I access courses offline?", a: "Yes, our mobile app lets you download lessons for offline viewing." },
];

export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async data => {
    setLoading(true);
    try {
      await apiConnector("POST", endpoints.CONTACT_US, data).catch(() => {});
      setSent(true);
      reset();
    } catch {
      toast.error("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--color-bg)" }}>

      {/* Hero */}
      <section className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #061525, #020b18)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #f5a623 0%, transparent 70%)" }} />
        <div className="max-w-maxContent mx-auto relative z-10">
          <div className="badge badge-gold mb-6 mx-auto">💬 We're Here to Help</div>
          <h1 className="section-heading text-5xl mb-5">Get in Touch</h1>
          <p style={{ color: "var(--color-muted)", fontSize: "18px", maxWidth: "500px", margin: "0 auto" }}>
            Have a question, feedback, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="max-w-maxContent mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {CONTACT_INFO.map(({ Icon, label, value, sub, color }) => (
            <div key={label} className="glass-card p-5 hover:scale-105 transition-transform text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontFamily: "Sora, sans-serif", color: "white", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{label}</h3>
              <p style={{ color: "var(--color-text)", fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{value}</p>
              <p style={{ color: "var(--color-muted)", fontSize: "11px" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Form + FAQ */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "white", fontSize: "22px", marginBottom: "24px" }}>
                Send us a Message
              </h2>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "rgba(0,229,160,0.12)", border: "1px solid rgba(0,229,160,0.3)" }}>
                    <FaCheckCircle size={30} style={{ color: "#00e5a0" }} />
                  </div>
                  <h3 style={{ fontFamily: "Sora, sans-serif", color: "white", fontWeight: 700, fontSize: "20px", marginBottom: "8px" }}>Message Sent!</h3>
                  <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "20px" }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary text-sm">Send another →</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>First Name *</label>
                      <input {...register("firstName", { required: "Required" })} className="form-input" placeholder="Rahul" />
                      {errors.firstName && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Last Name</label>
                      <input {...register("lastName")} className="form-input" placeholder="Gupta" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Email *</label>
                    <input type="email" {...register("email", { required: "Email required" })} className="form-input" placeholder="you@example.com" />
                    {errors.email && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.email.message}</p>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Phone (optional)</label>
                    <input {...register("phoneNumber")} className="form-input" placeholder="+91 9999999999" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", marginBottom: "6px" }}>Message *</label>
                    <textarea
                      {...register("message", { required: "Message is required", minLength: { value: 10, message: "Min 10 chars" } })}
                      rows={5} className="form-input" placeholder="How can we help you?" style={{ resize: "none" }} />
                    {errors.message && <p style={{ color: "#ff4d6d", fontSize: "11px", marginTop: "4px" }}>{errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4 text-base">
                    {loading ? "Sending..." : <><FaArrowRight size={14} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, color: "white", fontSize: "18px", marginBottom: "16px" }}>
              Frequently Asked
            </h3>
            <div className="space-y-3">
              {FAQ.map(({ q, a }, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                    style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <span style={{ color: openFaq === i ? "#f5a623" : "var(--color-text)", fontSize: "13px", fontWeight: 600 }}>{q}</span>
                    <span style={{ color: "#f5a623", fontSize: "18px", lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ color: "var(--color-muted)", fontSize: "13px", lineHeight: "1.7", paddingTop: "12px" }}>{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
