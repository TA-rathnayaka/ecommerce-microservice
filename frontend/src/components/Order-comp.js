import React from "react";

const statusColor = {
  pending:   { bg: "rgba(245,158,11,0.15)", color: "#FCD34D" },
  delivered: { bg: "rgba(16,185,129,0.15)", color: "#6EE7B7" },
  cancelled: { bg: "rgba(244,63,94,0.15)",  color: "#FDA4AF" },
  default:   { bg: "rgba(148,163,184,0.1)", color: "#94A3B8" },
};

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

export const OrderItem = ({ item, onTapViewMore }) => {
  const { _id, orderId, amount, status } = item;
  const sc = statusColor[status] || statusColor.default;

  return (
    <div style={cardStyle} className="animate-fade-in">
      <div style={headerRow}>
        {/* Icon */}
        <div style={iconWrap}><BoxIcon /></div>

        {/* IDs */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Order ID</p>
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", margin: "2px 0 0", fontFamily: "monospace" }}>
            {orderId || _id?.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Status */}
        {status && (
          <span style={{ ...statusBadge, background: sc.bg, color: sc.color }}>
            {status}
          </span>
        )}
      </div>

      <div style={footerRow}>
        <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--accent-light)" }}>
          ₹{amount}
        </span>
        <button
          style={viewBtnStyle}
          onClick={() => onTapViewMore(_id)}
        >
          <EyeIcon /> View Details
        </button>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "16px",
  marginBottom: 10,
};
const headerRow = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 14,
};
const iconWrap = {
  width: 42,
  height: 42,
  borderRadius: 10,
  background: "rgba(59,130,246,0.12)",
  color: "#93C5FD",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const statusBadge = {
  padding: "4px 12px",
  borderRadius: 99,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "capitalize",
};
const footerRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const viewBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "8px 16px",
  borderRadius: 99,
  border: "1.5px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "var(--text-primary)",
  fontSize: "0.8125rem",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
};