import React, { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const sectionStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "34px 24px 56px",
};

const headerStyle = {
  marginBottom: 20,
};

const titleStyle = {
  fontSize: "1.8rem",
  fontWeight: 800,
  color: "var(--text-primary)",
  letterSpacing: "-0.02em",
  margin: 0,
};

const subtitleStyle = {
  marginTop: 8,
  fontSize: "0.95rem",
  color: "var(--text-secondary)",
};

const chipsWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  margin: "0 0 20px",
};

const chipStyle = (active) => ({
  border: active ? "1.5px solid var(--accent-hover)" : "1.5px solid var(--border-strong)",
  background: active ? "var(--accent)" : "rgba(111,191,58,0.08)",
  color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
  borderRadius: 999,
  padding: "8px 18px",
  fontSize: "0.86rem",
  fontWeight: active ? 700 : 600,
  cursor: "pointer",
  fontFamily: "var(--font)",
});

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 20,
};

export const Categories = () => {
  const dispatch = useAppDispatch();
  const { categories, products } = useAppSelector((state) => state.shoppingReducer);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!activeCategory && Array.isArray(categories) && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return products || [];
    return (products || []).filter((item) => item.type === activeCategory);
  }, [products, activeCategory]);

  return (
    <section style={sectionStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Browse By Category</h1>
        <p style={subtitleStyle}>Pick a category and explore matching products.</p>
      </header>

      <div style={chipsWrapStyle}>
        {(categories || []).map((cat) => (
          <button key={cat} style={chipStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div style={gridStyle}>
          {filteredProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <p>No products found in this category yet.</p>
        </div>
      )}
    </section>
  );
};
