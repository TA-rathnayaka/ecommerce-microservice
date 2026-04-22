import React, { useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const categoryColors = {
  fruits:     { active: "#10B981", glow: "rgba(16,185,129,0.3)" },
  vegetables: { active: "#3B82F6", glow: "rgba(59,130,246,0.3)" },
  oils:       { active: "#F59E0B", glow: "rgba(245,158,11,0.3)" },
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const Home = () => {
  const { categories, products } = useAppSelector((state) => state.shoppingReducer);
  const dispatch = useAppDispatch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  const filtered = (products || []).filter((p) => {
    const matchCat = !activeCategory || p.type === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section style={heroSection}>
        <div style={heroGlow1} />
        <div style={heroGlow2} />
        <div style={heroContent}>
          <span style={heroBadge}>🌿 Fresh Daily Deliveries</span>
          <h1 style={heroTitle}>
            Farm-Fresh Groceries
            <span style={heroGradient}> Delivered Fast</span>
          </h1>
          <p style={heroSub}>
            Browse hundreds of fresh fruits, vegetables, and pantry essentials —
            all at your fingertips.
          </p>

          {/* Search bar */}
          <div style={searchWrap}>
            <span style={searchIcon}><SearchIcon /></span>
            <input
              style={searchInput}
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      {categories && categories.length > 0 && (
        <section style={catSection}>
          <div style={catInner}>
            <button
              style={pillStyle(!activeCategory, "#6EE7B7", "rgba(16,185,129,0.25)")}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => {
              const c = categoryColors[cat] || { active: "#8B5CF6", glow: "rgba(139,92,246,0.3)" };
              return (
                <button
                  key={cat}
                  style={pillStyle(activeCategory === cat, c.active, c.glow)}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Products Grid ── */}
      <section style={productsSection}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>
            {activeCategory
              ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
              : "All Products"}
          </h2>
          <span style={productCount}>{filtered.length} items</span>
        </div>

        {filtered.length > 0 ? (
          <div style={grid}>
            {filtered.map((item, i) => (
              <div
                key={item._id}
                style={{
                  animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                }}
              >
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No products found{search ? ` for "${search}"` : ""}.</p>
            {(search || activeCategory) && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setSearch(""); setActiveCategory(null); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export { Home };

/* ── Styles ── */
const heroSection = {
  position: "relative",
  overflow: "hidden",
  padding: "80px 24px 60px",
  textAlign: "center",
  borderBottom: "1px solid var(--border)",
  background: "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 100%)",
};
const heroGlow1 = {
  position: "absolute", top: -80, left: "20%", width: 500, height: 500,
  borderRadius: "50%", background: "rgba(16,185,129,0.08)", filter: "blur(80px)", pointerEvents: "none",
};
const heroGlow2 = {
  position: "absolute", top: -40, right: "15%", width: 350, height: 350,
  borderRadius: "50%", background: "rgba(59,130,246,0.07)", filter: "blur(60px)", pointerEvents: "none",
};
const heroContent = {
  position: "relative",
  maxWidth: 640,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 20,
};
const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 16px",
  background: "rgba(16,185,129,0.12)",
  border: "1px solid rgba(16,185,129,0.25)",
  borderRadius: 99,
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#6EE7B7",
};
const heroTitle = {
  fontSize: "clamp(2rem, 5vw, 3.25rem)",
  fontWeight: 900,
  lineHeight: 1.1,
  letterSpacing: "-0.04em",
  color: "var(--text-primary)",
  margin: 0,
};
const heroGradient = {
  display: "block",
  background: "linear-gradient(135deg,#6EE7B7,#3B82F6)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
const heroSub = {
  color: "var(--text-secondary)",
  fontSize: "1rem",
  lineHeight: 1.6,
  maxWidth: 500,
  margin: 0,
};
const searchWrap = {
  position: "relative",
  width: "100%",
  maxWidth: 460,
};
const searchIcon = {
  position: "absolute",
  left: 16,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-muted)",
  display: "flex",
};
const searchInput = {
  width: "100%",
  padding: "14px 20px 14px 48px",
  background: "rgba(255,255,255,0.05)",
  border: "1.5px solid var(--border)",
  borderRadius: 99,
  color: "var(--text-primary)",
  fontSize: "0.9375rem",
  fontFamily: "var(--font)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const catSection = {
  padding: "24px 24px 0",
  position: "sticky",
  top: 72,
  zIndex: 100,
  background: "rgba(15,23,42,0.9)",
  backdropFilter: "blur(16px)",
  borderBottom: "1px solid var(--border)",
};
const catInner = {
  maxWidth: 1280,
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  paddingBottom: 18,
};
const pillStyle = (active, color, glow) => ({
  padding: "8px 20px",
  borderRadius: 99,
  border: active ? `1.5px solid ${color}` : "1.5px solid rgba(255,255,255,0.1)",
  background: active ? `rgba(${color === "#10B981" ? "16,185,129" : color === "#3B82F6" ? "59,130,246" : color === "#F59E0B" ? "245,158,11" : "110,231,183"},0.15)` : "rgba(255,255,255,0.04)",
  color: active ? color : "var(--text-secondary)",
  fontWeight: active ? 700 : 500,
  fontSize: "0.875rem",
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
  boxShadow: active ? `0 0 16px ${glow}` : "none",
  transform: active ? "scale(1.02)" : "scale(1)",
});
const productsSection = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "36px 24px 60px",
};
const sectionHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
};
const sectionTitle = {
  fontSize: "1.375rem",
  fontWeight: 800,
  color: "var(--text-primary)",
  letterSpacing: "-0.02em",
  margin: 0,
};
const productCount = {
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--text-muted)",
  background: "var(--bg-surface)",
  padding: "4px 12px",
  borderRadius: 99,
  border: "1px solid var(--border)",
};
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 20,
};
