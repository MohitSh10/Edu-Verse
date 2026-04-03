import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCategories, fetchCategoryDetails } from "../services/courseAPI";
import CourseCard from "../components/common/CourseCard";
import { Spinner } from "../components/common/index";
import Footer from "../components/common/Footer";
import { HiOutlineBookOpen } from "react-icons/hi";

export default function Catalog() {
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchCategories().then(cats => {
      setCategories(cats || []);
      const match = cats?.find(c => c.name.toLowerCase().replace(/\s+/g, "-") === categoryName);
      if (match) {
        setActiveCategory(match);
        fetchCategoryDetails(match._id).then(d => { setData(d); setLoading(false); });
      } else setLoading(false);
    });
  }, [categoryName]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Spinner size="lg" />
    </div>
  );
  if (!activeCategory) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: "var(--color-bg)" }}>
      <p style={{ color: "var(--color-muted)", fontSize: "18px" }}>Category not found.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );

  const courseCount = data?.selectedCategory?.courses?.length || 0;

  return (
    <div style={{ background: "var(--color-bg)" }}>
      {/* Hero */}
      <section className="py-14 px-6" style={{ background: "var(--color-hero-bg)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-maxContent mx-auto">
          <p style={{ color: "var(--color-muted)", fontSize: "13px", marginBottom: "10px" }}>
            <Link to="/" style={{ color: "var(--color-muted)" }}>Home</Link>
            {" › "}
            <span style={{ color: "var(--color-text)" }}>Catalog</span>
            {" › "}
            <span style={{ color: "var(--color-accent)" }}>{activeCategory.name}</span>
          </p>
          <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "clamp(28px,4vw,42px)", color: "var(--color-text)", marginBottom: "10px" }}>
            {activeCategory.name}
          </h1>
          {activeCategory.description && (
            <p style={{ color: "var(--color-muted)", fontSize: "15px", maxWidth: "600px", lineHeight: "1.7" }}>
              {activeCategory.description}
            </p>
          )}
          <p style={{ color: "var(--color-accent)", fontWeight: 600, fontSize: "14px", marginTop: "12px" }}>
            {courseCount} course{courseCount !== 1 ? "s" : ""} available
          </p>
        </div>
      </section>

      <div className="max-w-maxContent mx-auto px-6 py-10">
        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-10 pb-2 overflow-x-auto">
            {categories.map(cat => (
              <a key={cat._id}
                href={`/catalog/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: cat._id === activeCategory._id
                    ? "linear-gradient(135deg,var(--color-accent),#f7c94b)"
                    : "var(--color-surface)",
                  color: cat._id === activeCategory._id ? "#020b18" : "var(--color-muted)",
                  border: `1px solid ${cat._id === activeCategory._id ? "transparent" : "var(--color-border)"}`,
                  fontFamily: "Plus Jakarta Sans,sans-serif",
                  boxShadow: cat._id === activeCategory._id ? "0 2px 12px rgba(212,137,10,0.2)" : "none",
                }}>
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Courses */}
        <section className="mb-14">
          <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "22px", marginBottom: "20px" }}>
            Courses in {activeCategory.name}
          </h2>
          {!courseCount ? (
            <div className="glass-card py-16 text-center">
              <HiOutlineBookOpen size={44} style={{ color: "var(--color-muted)", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--color-muted)" }}>No courses available in this category yet.</p>
              <Link to="/" className="btn-primary mt-5 inline-flex">Browse All Courses</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.selectedCategory.courses.map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          )}
        </section>

        {/* Trending */}
        {data?.topCourses?.length > 0 && (
          <section>
            <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "var(--color-text)", fontSize: "22px", marginBottom: "20px" }}>
              🔥 Trending Across All Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {data.topCourses.slice(0, 4).map(course => <CourseCard key={course._id} course={course} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
