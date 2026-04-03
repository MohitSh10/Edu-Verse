import { useState, useEffect, useCallback } from "react";
import {
  HiOutlineSearch, HiOutlineUserRemove, HiOutlineBan,
  HiOutlineCheckCircle, HiOutlineTrash,
} from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { getAdminUsers, toggleUserStatus, changeUserRole, deleteAdminUser } from "../../../../services/adminAPI";
import { Spinner } from "../../../common/index";

const ROLE_COLORS = {
  Student: { bg: "rgba(245,166,35,0.12)", text: "#f5a623" },
  Instructor: { bg: "rgba(0,212,255,0.12)", text: "#00d4ff" },
  Admin: { bg: "rgba(168,85,247,0.12)", text: "#a855f7" },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const load = useCallback(async (s = search, r = roleFilter) => {
    setLoading(true);
    const res = await getAdminUsers({
      search: s || undefined,
      accountType: r === "all" ? undefined : r,
      limit: 50,
    });
    setUsers(res.data || []);
    setTotal(res.total || 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, []);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => load(val, roleFilter), 400));
  };

  const handleRoleFilter = (r) => {
    setRoleFilter(r);
    load(search, r);
  };

  const handleToggleStatus = async (id) => {
    const updated = await toggleUserStatus(id);
    if (updated) setUsers(prev => prev.map(u => u._id === id ? { ...u, active: updated.active } : u));
  };

  const handleRoleChange = async (id, accountType) => {
    const updated = await changeUserRole(id, accountType);
    if (updated) setUsers(prev => prev.map(u => u._id === id ? { ...u, accountType: updated.accountType } : u));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    const ok = await deleteAdminUser(id);
    if (ok) setUsers(prev => prev.filter(u => u._id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-text)" }}>
          User Management
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "13px" }}>{total} users total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--color-muted)" }} />
          <input
            className="form-input pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "Student", "Instructor", "Admin"].map(r => (
            <button key={r} onClick={() => handleRoleFilter(r)}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: roleFilter === r ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
                color: roleFilter === r ? "#f5a623" : "var(--color-muted)",
                border: `1px solid ${roleFilter === r ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="glass-card py-16 text-center">
          <p style={{ color: "var(--color-muted)" }}>No users found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div key={user._id} className="glass-card p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {user.image ? (
                  <img src={user.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: ROLE_COLORS[user.accountType]?.bg, color: ROLE_COLORS[user.accountType]?.text }}>
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-richblack-800 ${user.active ? "bg-caribbeangreen-50" : "bg-pink-100"}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>
                    {user.firstName} {user.lastName}
                  </p>
                  {!user.active && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,77,109,0.12)", color: "#ff4d6d" }}>Banned</span>
                  )}
                </div>
                <p style={{ color: "var(--color-muted)", fontSize: "12px" }}>{user.email}</p>
              </div>

              {/* Role Badge */}
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                style={{ background: ROLE_COLORS[user.accountType]?.bg, color: ROLE_COLORS[user.accountType]?.text }}>
                {user.accountType}
              </span>

              {/* Joined */}
              <span style={{ color: "var(--color-muted)", fontSize: "11px", flexShrink: 0 }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Change Role */}
                <select
                  value={user.accountType}
                  onChange={e => handleRoleChange(user._id, e.target.value)}
                  className="text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--color-muted)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                  <option value="Admin">Admin</option>
                </select>

                {/* Toggle Ban */}
                <button
                  onClick={() => handleToggleStatus(user._id)}
                  title={user.active ? "Ban User" : "Unban User"}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: user.active ? "rgba(255,77,109,0.1)" : "rgba(0,229,160,0.1)",
                    color: user.active ? "#ff4d6d" : "#00e5a0",
                    border: `1px solid ${user.active ? "rgba(255,77,109,0.2)" : "rgba(0,229,160,0.2)"}`,
                  }}>
                  {user.active ? <HiOutlineBan size={15} /> : <HiOutlineCheckCircle size={15} />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(user._id)}
                  title="Delete User"
                  className="p-2 rounded-lg transition-all"
                  style={{ background: "rgba(255,77,109,0.08)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.15)" }}>
                  <HiOutlineTrash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
