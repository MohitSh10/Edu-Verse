import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { HiOutlineLightningBolt, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { fetchCategories } from "../../services/courseAPI";
import { logout } from "../../services/authAPI";
import ProfileDropdown from "./ProfileDropdown";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { token } = useSelector(s => s.auth);
  const { user } = useSelector(s => s.profile);
  const { totalItems } = useSelector(s => s.cart);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const catalogRef = useRef(null);
  const { theme, toggle } = useTheme();

  const isLight = theme === "light";

  useEffect(() => { fetchCategories().then(setCategories); }, []);

  useEffect(() => {
    const handler = e => {
      if (catalogRef.current && !catalogRef.current.contains(e.target)) setCatalogOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = path => location.pathname === path;

  // Theme-aware color helpers
  const dropdownBg = isLight
    ? "rgba(255,255,255,0.99)"
    : "rgba(6,21,37,0.98)";
  const dropdownBorder = isLight
    ? "1px solid rgba(0,0,0,0.1)"
    : "1px solid rgba(255,255,255,0.1)";
  const dropdownShadow = isLight
    ? "0 20px 60px rgba(0,0,0,0.15)"
    : "0 20px 60px rgba(0,0,0,0.5)";
  const mobileBg = isLight
    ? "rgba(248,250,252,0.99)"
    : "rgba(6,21,37,0.99)";
  const mobileBorder = isLight
    ? "rgba(0,0,0,0.08)"
    : "rgba(255,255,255,0.06)";
  const hoverBg = isLight
    ? "rgba(0,0,0,0.04)"
    : "rgba(245,166,35,0.08)";
  const hoverText = isLight ? "#0d1f30" : "#ffffff";

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: "var(--color-nav-bg)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div className="max-w-maxContent mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f5a623, #f7c94b)" }}
          >
            <HiOutlineLightningBolt className="text-black" size={18} />
          </div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "20px" }}>
            <span style={{ color: "#f5a623" }}>Edu</span>
            <span style={{ color: "var(--color-text)" }}>Verse</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-1">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(link.path) ? "#f5a623" : "var(--color-muted)",
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "#f5a623" }}
                  />
                )}
              </Link>
            </li>
          ))}

          {/* Catalog Dropdown */}
          <li className="relative" ref={catalogRef}>
            <button
              onClick={() => setCatalogOpen(p => !p)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: catalogOpen ? "#f5a623" : "var(--color-muted)",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                background: catalogOpen ? (isLight ? "rgba(245,166,35,0.08)" : "rgba(245,166,35,0.08)") : "transparent",
              }}
            >
              Catalog
              <BsChevronDown
                size={12}
                className={`transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
              />
            </button>

            {catalogOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-64 rounded-2xl overflow-hidden py-2"
                style={{
                  background: dropdownBg,
                  border: dropdownBorder,
                  backdropFilter: "blur(20px)",
                  boxShadow: dropdownShadow,
                }}
              >
                {/* Dropdown header */}
                <div
                  className="px-4 py-2 mb-1"
                  style={{ borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
                    Browse Categories
                  </p>
                </div>

                {categories.length === 0 ? (
                  <p className="px-4 py-3 text-sm" style={{ color: "var(--color-muted)" }}>
                    No categories yet
                  </p>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat._id}
                      to={`/catalog/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setCatalogOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-all"
                      style={{ color: "var(--color-text)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = hoverBg;
                        e.currentTarget.style.color = isLight ? "#e69500" : "#f5a623";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--color-text)";
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: isLight ? "rgba(230,149,0,0.1)" : "rgba(245,166,35,0.1)" }}
                      >
                        📚
                      </span>
                      <span className="font-medium">{cat.name}</span>
                    </Link>
                  ))
                )}

                {/* View all link */}
                {categories.length > 0 && (
                  <div
                    className="px-4 pt-2 mt-1"
                    style={{ borderTop: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}` }}
                  >
                    <Link
                      to="/catalog/all"
                      onClick={() => setCatalogOpen(false)}
                      className="flex items-center gap-1 text-xs font-semibold py-1.5"
                      style={{ color: "#f5a623" }}
                    >
                      View all categories →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl transition-all"
            style={{
              color: isLight ? "#5a7a95" : "var(--color-muted)",
              background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`,
            }}
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
          >
            {isLight ? <HiOutlineMoon size={18} /> : <HiOutlineSun size={18} />}
          </button>

          {user?.accountType === "Student" && (
            <Link
              to="/dashboard/cart"
              className="relative p-2 rounded-xl transition-all"
              style={{
                color: "var(--color-muted)",
                background: "transparent",
              }}
            >
              <AiOutlineShoppingCart size={22} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "#f5a623", color: "#020b18" }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {!token ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login" className="btn-secondary text-sm px-5 py-2.5">Log In</Link>
              <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
            </div>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: "var(--color-muted)" }}
          onClick={() => setMenuOpen(p => !p)}
        >
          {menuOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-1"
          style={{ background: mobileBg, borderColor: mobileBorder }}
        >
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
          ].map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-xl text-sm font-medium transition-colors"
              style={{
                color: isActive(link.path) ? "#f5a623" : "var(--color-text)",
                background: isActive(link.path) ? "rgba(245,166,35,0.08)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile categories */}
          <div>
            <button
              onClick={() => setCatalogOpen(p => !p)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              <span>Catalog</span>
              <BsChevronDown
                size={12}
                className={`transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
                style={{ color: "var(--color-muted)" }}
              />
            </button>
            {catalogOpen && (
              <div
                className="ml-4 mb-2 rounded-xl overflow-hidden"
                style={{
                  background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {categories.length === 0 ? (
                  <p className="px-4 py-3 text-sm" style={{ color: "var(--color-muted)" }}>No categories</p>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat._id}
                      to={`/catalog/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => { setMenuOpen(false); setCatalogOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      <span>📚</span>
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Theme toggle in mobile */}
          <button
            onClick={toggle}
            className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "var(--color-text)" }}
          >
            {isLight ? <HiOutlineMoon size={16} /> : <HiOutlineSun size={16} />}
            {isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          </button>

          <div
            className="flex gap-3 pt-3 mt-1 border-t"
            style={{ borderColor: mobileBorder }}
          >
            {!token ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-secondary text-sm flex-1 justify-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-sm flex-1 justify-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => { dispatch(logout(navigate)); setMenuOpen(false); }}
                className="btn-secondary text-sm w-full justify-center"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
