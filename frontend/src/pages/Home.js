import React, { useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { X } from "lucide-react";
import { HomeSlider } from "../components/HomeSlider";

const categoryColors = {
  fruits:     { active: "#000000", glow: "rgba(0,0,0,0.2)" },
  vegetables: { active: "#333333", glow: "rgba(0,0,0,0.15)" },
  oils:       { active: "#555555", glow: "rgba(0,0,0,0.12)" },
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
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  // Close overlay on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  const filtered = (products || []).filter((p) => {
    const matchCat = !activeCategory || p.type === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const searchResults = (products || []).filter((p) =>
    search && p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
   <div style={{ minHeight: "100vh", background: "var(--hero-bg)" }}>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div style={overlayStyle}>
          {/* Overlay Header */}
          <div style={overlayHeader}>
            <div style={overlaySearchWrap}>
              <span style={overlaySearchIcon}><SearchIcon /></span>
              <input
                style={overlaySearchInput}
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  style={clearBtn}
                  onClick={() => setSearch("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              style={overlayCloseBtn}
              onClick={() => { setSearchOpen(false); setSearch(""); }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <X size={20} />
            </button>
          </div>

          {/* Overlay Results */}
          <div style={overlayBody}>
            {search === "" ? (
              <div style={overlayHint}>
                <span style={{ fontSize: "2rem" }}>🔍</span>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: 12 }}>
                  Start typing to search products…
                </p>
              </div>
            ) : searchResults.length === 0 ? (
              <div style={overlayHint}>
                <span style={{ fontSize: "2rem" }}>😕</span>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: 12 }}>
                  No results for "<strong>{search}</strong>"
                </p>
              </div>
            ) : (
              <>
                <p style={overlayResultCount}>
                  {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "<strong>{search}</strong>"
                </p>
                <div style={overlayGrid}>
                  {searchResults.map((item, i) => (
                    <div
                      key={item._id}
                      style={{ animation: `fadeInUp 0.3s ease ${i * 0.04}s both` }}
                    >
                      <ProductCard item={item} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
<HomeSlider />
      {/* ── Hero ── */}
      <section style={heroSection}>
        <div style={heroContent}>   
          <h1 style={heroTitle}>
            Farm-Fresh Groceries
            <span style={heroGradient}> Delivered Fast</span>
          </h1>
          <p style={heroSub}>
            Browse hundreds of fresh fruits, vegetables, and pantry essentials —
            all at your fingertips.
          </p>

          {/* Search trigger */}
          <div
            style={searchTrigger}
            onClick={() => setSearchOpen(true)}
          >
            <span style={searchIcon}><SearchIcon /></span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
              Search products…
            </span>
          </div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      {/* {categories && categories.length > 0 && (
        <section style={catSection}>
          <div style={catInner}>
            <button
              style={pillStyle(!activeCategory)}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                style={pillStyle(activeCategory === cat)}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </section>
      )} */}

      {/* ── Products Grid ── */}
      {/* <section style={productsSection}>
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
                style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}
              >
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No products found.</p>
            {activeCategory && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setActiveCategory(null)}
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </section> */}
    </div>
  );
};

export { Home };

/* ── Styles ── */

// Search Overlay
const overlayStyle = {
  position: "fixed",
  inset: 0,
  zIndex: 2000,
  background: "var(--bg-base)",
  display: "flex",
  flexDirection: "column",
  animation: "fadeInUp 0.2s ease both",
};
const overlayHeader = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "16px 24px",
  borderBottom: "1px solid var(--border)",
  background: "var(--bg-surface)",
  boxShadow: "0 2px 12px rgba(54, 97, 43, 0.1)",
};
const overlaySearchWrap = {
  flex: 1,
  position: "relative",
  display: "flex",
  alignItems: "center",
};
const overlaySearchIcon = {
  position: "absolute",
  left: 16,
  color: "var(--text-muted)",
  display: "flex",
};
const overlaySearchInput = {
  width: "100%",
  padding: "13px 44px 13px 48px",
  background: "var(--bg-base)",
  border: "1.5px solid var(--border-strong)",
  borderRadius: 99,
  color: "var(--text-inputtext)",
  fontSize: "1rem",
  fontFamily: "var(--font)",
  outline: "none",
};
const clearBtn = {
  position: "absolute",
  right: 14,
  background: "rgba(111,191,58,0.12)",
  border: "none",
  borderRadius: "50%",
  width: 26,
  height: 26,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "var(--accent-hover)",
};
const overlayCloseBtn = {
  width: 40,
  height: 40,
  borderRadius: 10,
  border: "1px solid var(--border-strong)",
  background: "transparent",
  color: "var(--text-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  transition: "opacity 0.2s",
};
const overlayBody = {
  flex: 1,
  overflowY: "auto",
  padding: "32px 24px",
  maxWidth: 1280,
  width: "100%",
  margin: "0 auto",
};
const overlayHint = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 300,
};
const overlayResultCount = {
  fontSize: "0.875rem",
  color: "var(--text-secondary)",
  marginBottom: 24,
};
const overlayGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 20,
};

// Hero
const heroSection = {
  position: "relative",
  overflow: "hidden",
  padding: "40px 24px 40px",
  textAlign: "center",
 // borderBottom: "1px solid rgba(0,0,0,0.08)",
  background: "linear-gradient(180deg, rgba(111,191,58,0.09) 0%, transparent 100%)",
};
const heroContent = {
  position: "relative",
  maxWidth: 640,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
};
const heroBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 16px",
  background: "rgba(111,191,58,0.12)",
  border: "1px solid var(--border-accent)",
  borderRadius: 99,
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--accent-hover)",
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
  background: "linear-gradient(135deg, var(--hero-grad-start), var(--hero-grad-end))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};
const heroSub = {
  color: "var(--text-secondary)",
  fontSize: "1rem",
  lineHeight: 1.6,
  maxWidth: 500,
  margin: 0,
};
const searchTrigger = {
  position: "relative",
  width: "100%",
  maxWidth: 460,
  padding: "14px 20px 14px 48px",
  background: "var(--bg-surface)",
  border: "1.5px solid var(--border-strong)",
  borderRadius: 99,
  cursor: "text",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 2px 12px rgba(54, 97, 43, 0.12)",
  transition: "box-shadow 0.2s",
};
const searchIcon = {
  position: "absolute",
  left: 16,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-muted)",
  display: "flex",
};
const searchWrap = {
  position: "relative",
  width: "100%",
  maxWidth: 460,
};
const searchInput = {
  width: "100%",
  padding: "14px 20px 14px 48px",
  background: "var(--bg-surface)",
  border: "1.5px solid var(--border-strong)",
  borderRadius: 99,
  color: "var(--text-inputtext)",
  fontSize: "0.9375rem",
  fontFamily: "var(--font)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

// Categories
const catSection = {
  padding: "24px 24px 0",
  position: "sticky",
  top: 72,
  zIndex: 100,
  background: "rgba(245,248,239,0.97)",
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
const pillStyle = (active) => ({
  padding: "8px 20px",
  borderRadius: 99,
  border: active ? "1.5px solid var(--accent-hover)" : "1.5px solid var(--border-strong)",
  background: active ? "var(--accent)" : "rgba(111,191,58,0.08)",
  color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
  fontWeight: active ? 700 : 500,
  fontSize: "0.875rem",
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
  boxShadow: active ? "0 2px 12px rgba(111,191,58,0.28)" : "none",
  transform: active ? "scale(1.02)" : "scale(1)",
});

// Products
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
  color: "var(--text-secondary)",
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