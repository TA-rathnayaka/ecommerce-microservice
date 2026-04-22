import React, { useState } from "react";
import { Link } from "react-router-dom";

const categoryColors = {
  fruits:     { bg: "rgba(16,185,129,0.15)", color: "#6EE7B7", border: "rgba(16,185,129,0.3)" },
  vegetables: { bg: "rgba(59,130,246,0.15)", color: "#93C5FD", border: "rgba(59,130,246,0.3)" },
  oils:       { bg: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "rgba(245,158,11,0.3)" },
  default:    { bg: "rgba(139,92,246,0.15)", color: "#C4B5FD", border: "rgba(139,92,246,0.3)" },
};

const CartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const ProductCard = ({ item }) => {
  const { _id, banner, price, name, desc, type } = item;
  const [imgError, setImgError] = useState(false);
  const cat = categoryColors[type] || categoryColors.default;

  return (
    <Link
      to={"/details/" + _id}
      style={{ textDecoration: "none" }}
      className="animate-fade-in-up"
    >
      <article style={cardStyle}>
        {/* Image */}
        <div style={imgWrapStyle}>
          {!imgError ? (
            <img
              src={banner}
              alt={name}
              style={imgStyle}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={imgFallback}>🛒</div>
          )}
          {/* Category badge */}
          <span style={{ ...badgeStyle, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
            {type}
          </span>
          {/* Hover CTA */}
          <div style={ctaOverlayStyle}>
            <span style={ctaBtnStyle}>
              <CartIcon /> Add to Cart
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={infoStyle}>
          <p style={nameStyle}>{name}</p>
          <p style={descStyle} title={desc}>{desc}</p>
          <div style={priceRowStyle}>
            <span style={priceStyle}>₹{price}</span>
            <span style={unitStyle}>/ unit</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export { ProductCard };

/* ── Styles ── */
const cardStyle = {
  width: 210,
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 18,
  overflow: "hidden",
  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
};
const imgWrapStyle = {
  position: "relative",
  width: "100%",
  height: 180,
  overflow: "hidden",
  background: "rgba(255,255,255,0.03)",
};
const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s ease",
};
const imgFallback = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "2.5rem",
  color: "var(--text-muted)",
};
const badgeStyle = {
  position: "absolute",
  top: 10,
  left: 10,
  padding: "3px 10px",
  borderRadius: 99,
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "capitalize",
  letterSpacing: "0.04em",
};
const ctaOverlayStyle = {
  position: "absolute",
  inset: 0,
  background: "rgba(15,23,42,0.65)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.25s ease",
};
const ctaBtnStyle = {
  background: "linear-gradient(135deg,#10B981,#059669)",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 99,
  fontWeight: 700,
  fontSize: "0.8125rem",
  display: "flex",
  alignItems: "center",
  gap: 7,
  boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
};
const infoStyle = {
  padding: "14px 16px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 5,
  flex: 1,
};
const nameStyle = {
  fontSize: "0.9375rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  lineHeight: 1.3,
  margin: 0,
};
const descStyle = {
  fontSize: "0.78rem",
  color: "var(--text-muted)",
  margin: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
const priceRowStyle = {
  display: "flex",
  alignItems: "baseline",
  gap: 4,
  marginTop: 4,
};
const priceStyle = {
  fontSize: "1.125rem",
  fontWeight: 800,
  color: "var(--accent-light)",
};
const unitStyle = {
  fontSize: "0.75rem",
  color: "var(--text-muted)",
};