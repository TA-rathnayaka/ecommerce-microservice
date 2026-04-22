import React from "react";

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  </svg>
);

export const AddressComponent = ({ address }) => {
  const addressCard = ({ street, postalCode, city, country }, idx) => (
    <div key={idx} style={cardStyle}>
      <div style={topRow}>
        <div style={pinIcon}><MapPinIcon /></div>
        <div>
          <span style={{ ...badgeStyle, ...(idx === 0 ? defaultBadge : altBadge) }}>
            {idx === 0 ? "Default" : `Address ${idx + 1}`}
          </span>
        </div>
      </div>

      <p style={streetStyle}>{street}</p>
      <p style={subStyle}>{[postalCode, city, country].filter(Boolean).join(", ")}</p>

      <div style={actionsRow}>
        <button style={iconBtn("info")} title="Edit"><EditIcon /></button>
        <button style={iconBtn("danger")} title="Remove"><TrashIcon /></button>
      </div>
    </div>
  );

  const list = Array.isArray(address)
    ? address.map(addressCard)
    : <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No address saved.</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
      {list}
    </div>
  );
};

const cardStyle = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "18px",
  minWidth: 220,
  maxWidth: 280,
  flex: "1 1 220px",
};
const topRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 12,
};
const pinIcon = {
  width: 34,
  height: 34,
  borderRadius: 8,
  background: "rgba(59,130,246,0.12)",
  color: "#93C5FD",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const badgeStyle = {
  padding: "3px 10px",
  borderRadius: 99,
  fontSize: "0.72rem",
  fontWeight: 700,
};
const defaultBadge = {
  background: "rgba(16,185,129,0.15)",
  color: "#6EE7B7",
};
const altBadge = {
  background: "rgba(148,163,184,0.1)",
  color: "#94A3B8",
};
const streetStyle = {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  margin: 0,
};
const subStyle = {
  fontSize: "0.8rem",
  color: "var(--text-muted)",
  marginTop: 4,
  marginBottom: 12,
};
const actionsRow = {
  display: "flex",
  gap: 8,
};
const iconBtn = (variant) => ({
  width: 30,
  height: 30,
  borderRadius: 7,
  border: `1px solid ${variant === "danger" ? "rgba(244,63,94,0.3)" : "rgba(59,130,246,0.3)"}`,
  background: variant === "danger" ? "rgba(244,63,94,0.1)" : "rgba(59,130,246,0.1)",
  color: variant === "danger" ? "#F43F5E" : "#93C5FD",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontFamily: "var(--font)",
});