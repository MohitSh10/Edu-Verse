import { useState, useEffect } from "react";
import {
  HiOutlineMail, HiOutlineMailOpen, HiOutlineCheckCircle, HiOutlineTrash,
  HiOutlineReply, HiOutlinePhone, HiOutlineX,
} from "react-icons/hi";
import { getAdminMessages, updateAdminMessage, deleteAdminMessage } from "../../../../services/adminAPI";
import { Spinner } from "../../../common/index";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  unread: { bg: "rgba(255,77,109,0.12)", text: "#ff4d6d" },
  read:   { bg: "rgba(245,166,35,0.12)", text: "#f5a623" },
  resolved: { bg: "rgba(0,229,160,0.12)", text: "#00e5a0" },
};

function ReplyModal({ msg, onClose, onSaved }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    const updated = await updateAdminMessage(msg._id, { adminReply: reply.trim() });
    if (updated) {
      toast.success("Reply sent to " + msg.email);
      onSaved(updated);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-4" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center justify-between">
          <h3 style={{ color: "var(--color-text)", fontWeight: 700, fontFamily: "Sora, sans-serif" }}>Reply to {msg.firstName}</h3>
          <button onClick={onClose} style={{ color: "var(--color-muted)" }}><HiOutlineX size={20} /></button>
        </div>
        <div className="rounded-xl p-4 space-y-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
          <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>Original message from {msg.email}</p>
          <p style={{ color: "var(--color-text)", fontSize: "13px", lineHeight: "1.6" }}>{msg.message}</p>
        </div>
        <textarea
          className="form-input"
          rows={5}
          placeholder="Type your reply..."
          value={reply}
          onChange={e => setReply(e.target.value)}
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
          <button onClick={handleSend} disabled={loading || !reply.trim()} className="btn-primary text-sm">
            {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);

  const load = async (status = filter) => {
    setLoading(true);
    const res = await getAdminMessages({ status: status === "all" ? undefined : status, limit: 50 });
    setMessages(res.data || []);
    setTotal(res.total || 0);
    setLoading(false);
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleStatusChange = async (id, status) => {
    const updated = await updateAdminMessage(id, { status });
    if (updated) setMessages(prev => prev.map(m => m._id === id ? updated : m));
  };

  const handleDelete = async (id) => {
    const ok = await deleteAdminMessage(id);
    if (ok) setMessages(prev => prev.filter(m => m._id !== id));
  };

  const counts = {
    all: messages.length,
    unread: messages.filter(m => m.status === "unread").length,
    read: messages.filter(m => m.status === "read").length,
    resolved: messages.filter(m => m.status === "resolved").length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-text)" }}>
            Contact Messages
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "13px" }}>{total} total messages</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["all", "unread", "read", "resolved"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
            style={{
              background: filter === s ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
              color: filter === s ? "#f5a623" : "var(--color-muted)",
              border: `1px solid ${filter === s ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`,
            }}>
            {s} {s === "unread" && counts.unread > 0 && (
              <span className="ml-1 inline-flex w-5 h-5 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "#ff4d6d", color: "#fff" }}>{counts.unread}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : messages.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <HiOutlineMail size={40} style={{ color: "var(--color-muted)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--color-muted)" }}>No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg._id} className="glass-card p-5 space-y-3"
              style={{ borderLeft: `3px solid ${STATUS_COLORS[msg.status]?.text}` }}>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm"
                    style={{ background: STATUS_COLORS[msg.status]?.bg, color: STATUS_COLORS[msg.status]?.text }}>
                    {msg.firstName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>
                      {msg.firstName} {msg.lastName}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span style={{ color: "var(--color-muted)", fontSize: "12px" }}>{msg.email}</span>
                      {msg.phoneNumber && (
                        <span className="flex items-center gap-1" style={{ color: "var(--color-muted)", fontSize: "12px" }}>
                          <HiOutlinePhone size={12} /> {msg.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                    style={{ background: STATUS_COLORS[msg.status]?.bg, color: STATUS_COLORS[msg.status]?.text }}>
                    {msg.status}
                  </span>
                  <span style={{ color: "var(--color-muted)", fontSize: "11px" }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              <p style={{ color: "var(--color-text)", fontSize: "14px", lineHeight: "1.7", paddingLeft: "48px" }}>
                {msg.message}
              </p>

              {/* Previous reply */}
              {msg.adminReply && (
                <div className="ml-12 rounded-xl p-3" style={{ background: "rgba(0,229,160,0.06)", border: "1px solid rgba(0,229,160,0.2)" }}>
                  <p style={{ color: "#00e5a0", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>Your reply · {new Date(msg.repliedAt).toLocaleDateString()}</p>
                  <p style={{ color: "var(--color-muted)", fontSize: "13px" }}>{msg.adminReply}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap pl-12">
                {msg.status === "unread" && (
                  <button onClick={() => handleStatusChange(msg._id, "read")}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)" }}>
                    <HiOutlineMailOpen size={13} /> Mark as Read
                  </button>
                )}
                {msg.status !== "resolved" && (
                  <button onClick={() => handleStatusChange(msg._id, "resolved")}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.2)" }}>
                    <HiOutlineCheckCircle size={13} /> Resolve
                  </button>
                )}
                <button onClick={() => setReplyModal(msg)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
                  <HiOutlineReply size={13} /> Reply
                </button>
                <button onClick={() => handleDelete(msg._id)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: "rgba(255,77,109,0.1)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.2)" }}>
                  <HiOutlineTrash size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyModal && (
        <ReplyModal
          msg={replyModal}
          onClose={() => setReplyModal(null)}
          onSaved={updated => setMessages(prev => prev.map(m => m._id === updated._id ? updated : m))}
        />
      )}
    </div>
  );
}
