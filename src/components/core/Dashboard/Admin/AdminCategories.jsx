import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import { MdOutlineCategory } from "react-icons/md";
import { getAdminCategories, createAdminCategory, deleteAdminCategory } from "../../../../services/adminAPI";
import { Spinner } from "../../../common/index";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("📚");
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminCategories().then(data => { setCategories(data || []); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const cat = await createAdminCategory({ name: newName.trim(), description: newDesc.trim(), icon: newIcon.trim() || "📚" });
    if (cat) {
      setCategories(prev => [...prev, cat]);
      setNewName(""); setNewDesc(""); setNewIcon("📚");
      setAdding(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Courses in it will lose their category.")) return;
    const ok = await deleteAdminCategory(id);
    if (ok) setCategories(prev => prev.filter(c => c._id !== id));
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--color-text)" }}>
            Categories
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "13px" }}>{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(p => !p)} className="btn-primary text-sm flex items-center gap-2">
          <HiOutlinePlus size={16} /> Add Category
        </button>
      </div>

      {adding && (
        <div className="glass-card p-5 space-y-3">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <input className="form-input text-center text-xl" placeholder="📚" value={newIcon} onChange={e => setNewIcon(e.target.value)} />
            <input className="form-input" placeholder="Category name *" value={newName} onChange={e => setNewName(e.target.value)} />
          </div>
          <input className="form-input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleCreate} disabled={saving || !newName.trim()} className="btn-primary text-sm">
              {saving ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat._id} className="glass-card p-4 flex items-center gap-4">
            <span className="text-2xl flex-shrink-0">{cat.icon || "📚"}</span>
            <div className="flex-1 min-w-0">
              <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "14px" }}>{cat.name}</p>
              {cat.description && (
                <p style={{ color: "var(--color-muted)", fontSize: "12px", marginTop: "2px" }} className="truncate">{cat.description}</p>
              )}
            </div>
            <span style={{ color: "var(--color-muted)", fontSize: "12px", flexShrink: 0 }}>
              {cat.courses?.length || 0} courses
            </span>
            <button onClick={() => handleDelete(cat._id)}
              className="p-2 rounded-lg flex-shrink-0 transition-all"
              style={{ background: "rgba(255,77,109,0.08)", color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.15)" }}>
              <HiOutlineTrash size={15} />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="glass-card py-16 text-center">
            <MdOutlineCategory size={40} style={{ color: "var(--color-muted)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--color-muted)" }}>No categories yet. Create the first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
