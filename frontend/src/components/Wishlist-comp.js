import React from "react";

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const WishItem = ({ item, onTapRemove }) => {
  const { _id, name, desc, price, banner } = item;

  return (
    <div style={rowStyle} className="animate-fade-in">
      {/* Thumbnail */}
      <div style={thumbWrap}>
        <img
          src={banner}
          alt={name}
          style={thumbImg}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", margin: 0 }}>{name}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "3px 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{desc}</p>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--accent-light)" }}>₹{price}</span>
      </div>

      {/* Wishlist icon */}
      <span style={{ color: "#F43F5E", fontSize: "1.1rem" }}><HeartIcon /></span>

      {/* Remove */}
      <button
        style={removeBtnStyle}
        onClick={() => onTapRemove(_id)}
        title="Remove from Wishlist"
      >
        <TrashIcon />
        <span>Remove</span>
      </button>
    </div>
  );
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "14px 16px",
  background: "var(--bg-surface)",
  borderRadius: 14,
  border: "1px solid var(--border)",
  marginBottom: 10,
};
const thumbWrap = {
  width: 64,
  height: 64,
  borderRadius: 10,
  overflow: "hidden",
  background: "rgba(255,255,255,0.04)",
  flexShrink: 0,
};
const thumbImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const removeBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 99,
  border: "1.5px solid rgba(244,63,94,0.3)",
  background: "rgba(244,63,94,0.1)",
  color: "#F43F5E",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
  flexShrink: 0,
};