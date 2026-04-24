import React, { useEffect, useMemo } from "react";
import { ProductCard } from "../components/ProductCard";
import { onGetProducts } from "../store/actions";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const sectionStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "34px 24px 56px",
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
  marginBottom: 22,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
  gap: 20,
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  marginBottom: 16,
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "var(--accent-hover)",
  border: "1px solid var(--border-accent)",
  background: "rgba(111,191,58,0.12)",
};

export const Offers = () => {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.shoppingReducer);

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  const offerProducts = useMemo(() => {
    return (products || []).slice(0, 8);
  }, [products]);

  return (
    <section style={sectionStyle}>
      <h1 style={titleStyle}>Today&apos;s Offers</h1>
      <p style={subtitleStyle}>Handpicked deal picks curated for quick checkout.</p>
      <span style={badgeStyle}>Up to 20% off selected products</span>

      {offerProducts.length > 0 ? (
        <div style={gridStyle}>
          {offerProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🏷️</span>
          <p>Offers will appear as products load.</p>
        </div>
      )}
    </section>
  );
};
