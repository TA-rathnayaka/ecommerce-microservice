import React, { useState, useEffect } from "react";

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const CartItem = ({ item, cart, onAdd, onRemove }) => {
  const { _id } = item.product;
  const [currentUnit, setCurrentUnit] = useState(0);

  useEffect(() => {
    if (Array.isArray(cart) && cart.length) {
      const exist = cart.filter(({ product }) => product._id === _id);
      if (exist.length) setCurrentUnit(exist[0].unit);
    }
  }, [cart, _id]);

  const addCart = () => {
    const newUnit = currentUnit + 1;
    setCurrentUnit(newUnit);
    setTimeout(() => onAdd({ _id, qty: newUnit }), 0);
  };

  const removeCart = () => {
    if (currentUnit <= 0) return;
    const newUnit = currentUnit - 1;
    setCurrentUnit(newUnit);
    setTimeout(() => {
      newUnit > 0 ? onAdd({ _id, qty: newUnit }) : onRemove({ _id });
    }, 0);
  };

  if (!item || !item.product) return null;

  const { product } = item;
  const { name, desc, price, banner } = product;

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
      <div style={infoStyle}>
        <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text-primary)", margin: 0 }}>{name}</p>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "3px 0 0" }}>{desc}</p>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--accent-light)", marginTop: 4, display: "block" }}>₹{price}</span>
      </div>

      {/* Quantity control */}
      <div className="qty-ctrl">
        <button className="qty-btn" onClick={removeCart} title="Decrease"><MinusIcon /></button>
        <span className="qty-value">{currentUnit}</span>
        <button className="qty-btn" onClick={addCart} title="Increase"><PlusIcon /></button>
      </div>

      {/* Line total */}
      <div style={{ minWidth: 70, textAlign: "right" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>₹{price * currentUnit}</span>
      </div>
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
  transition: "border-color 0.2s",
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
const infoStyle = {
  flex: 1,
  minWidth: 0,
};