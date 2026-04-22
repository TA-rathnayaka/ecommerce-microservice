import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import toast from "../utils/toast";
import {
  onGetProductDetails,
  onAddToWishlist,
  onAddToCart,
  onRemoveFromWishlist,
  onRemoveFromCart,
} from "../store/actions";

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const HeartFilled = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const HeartOutline = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const categoryColors = {
  fruits:     { bg: "rgba(16,185,129,0.12)", color: "#6EE7B7", border: "rgba(16,185,129,0.3)" },
  vegetables: { bg: "rgba(59,130,246,0.12)", color: "#93C5FD", border: "rgba(59,130,246,0.3)" },
  oils:       { bg: "rgba(245,158,11,0.12)", color: "#FCD34D", border: "rgba(245,158,11,0.3)" },
  default:    { bg: "rgba(139,92,246,0.12)", color: "#C4B5FD", border: "rgba(139,92,246,0.3)" },
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentProduct } = useAppSelector((state) => state.shoppingReducer);
  const { wishlist, cart } = useAppSelector((state) => state.userReducer);

  const [currentUnit, setCurrentUnit] = useState(0);
  const [imgError, setImgError] = useState(false);

  const { _id, banner, price, name, desc, type, available } = currentProduct;

  useEffect(() => { dispatch(onGetProductDetails(id)); }, [id, dispatch]);

  useEffect(() => {
    if (Array.isArray(cart) && cart.length) {
      const exist = cart.filter(({ product }) => product._id === _id);
      if (exist.length) setCurrentUnit(exist[0].unit);
      else setCurrentUnit(0);
    }
  }, [currentProduct, cart, _id]);

  const inCart = Array.isArray(cart) && cart.some(({ product }) => product._id === _id);
  const inWishlist = Array.isArray(wishlist) && wishlist.some((item) => item._id === _id);
  const cat = categoryColors[type] || categoryColors.default;

  const addCart = () => {
    const newUnit = currentUnit + 1;
    setCurrentUnit(newUnit);
    setTimeout(() => dispatch(onAddToCart({ _id, qty: newUnit })), 0);
    if (currentUnit === 0) toast.success(`${name} added to cart!`);
  };
  const removeCart = () => {
    if (currentUnit <= 0) return;
    const newUnit = currentUnit - 1;
    setCurrentUnit(newUnit);
    setTimeout(() => {
      newUnit > 0 ? dispatch(onAddToCart({ _id, qty: newUnit })) : dispatch(onRemoveFromCart(_id));
    }, 0);
    if (newUnit === 0) toast.success(`${name} removed from cart.`);
  };
  const toggleWishlist = () => {
    if (inWishlist) {
      dispatch(onRemoveFromWishlist(_id));
      toast("Removed from wishlist", { icon: "💔" });
    } else {
      dispatch(onAddToWishlist(_id));
      toast.success("Added to wishlist!");
    }
  };

  if (!name) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
        <div className="skeleton" style={{ width: 60, height: 60, borderRadius: "50%" }} />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* Back button */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 28, alignSelf: "flex-start" }}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft /> Back
      </button>

      <div style={contentGrid}>
        {/* ── Left: Image ── */}
        <div style={imagePanelStyle}>
          <div style={imageWrap}>
            {!imgError && banner ? (
              <img src={banner} alt={name} style={imageStyle} onError={() => setImgError(true)} />
            ) : (
              <div style={imgFallback}>🛒</div>
            )}
          </div>
        </div>

        {/* ── Right: Info ── */}
        <div style={infoPanelStyle}>
          {/* Category badge */}
          <span style={{ ...catBadge, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
            <TagIcon />&nbsp;{type}
          </span>

          {/* Name */}
          <h1 style={productName}>{name}</h1>

          {/* Availability */}
          <span style={available ? availBadgeGreen : availBadgeRed}>
            {available ? "✓ In Stock" : "✗ Out of Stock"}
          </span>

          {/* Price */}
          <div style={priceBlock}>
            <span style={priceLabel}>Price</span>
            <span style={priceValue}>₹{price}</span>
            <span style={priceUnit}>per unit</span>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Description */}
          {desc && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600, margin: "0 0 8px" }}>Description</p>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9375rem", margin: 0 }}>{desc}</p>
            </div>
          )}

          {/* Delivery note */}
          <div style={deliveryNote}>
            <TruckIcon />
            <span>Standard delivery available across all regions</span>
          </div>

          {/* Actions */}
          <div style={actionsRow}>
            {/* Cart control */}
            {inCart ? (
              <div className="qty-ctrl" style={{ height: 50, borderRadius: 14 }}>
                <button className="qty-btn" style={{ width: 50, height: 50 }} onClick={removeCart}><MinusIcon /></button>
                <span className="qty-value" style={{ minWidth: 44, fontSize: "1.1rem" }}>{currentUnit}</span>
                <button className="qty-btn" style={{ width: 50, height: 50 }} onClick={addCart}><PlusIcon /></button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={addCart}
                disabled={!available}
              >
                <CartIcon /> Add to Cart
              </button>
            )}

            {/* Wishlist toggle */}
            <button
              style={wishBtnStyle(inWishlist)}
              onClick={toggleWishlist}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? <HeartFilled /> : <HeartOutline />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };

/* ── Styles ── */
const pageStyle = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "40px 24px 80px",
  display: "flex",
  flexDirection: "column",
};
const contentGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
  gap: 48,
  alignItems: "start",
};
const imagePanelStyle = {
  position: "sticky",
  top: 100,
};
const imageWrap = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: 20,
  overflow: "hidden",
  aspectRatio: "1/1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};
const imgFallback = {
  fontSize: "5rem",
  color: "var(--text-muted)",
};
const infoPanelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  animation: "fadeInUp 0.4s ease both",
};
const catBadge = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 13px",
  borderRadius: 99,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "capitalize",
  alignSelf: "flex-start",
};
const productName = {
  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
  fontWeight: 900,
  color: "var(--text-primary)",
  letterSpacing: "-0.03em",
  lineHeight: 1.15,
  margin: 0,
};
const availBadgeGreen = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 12px",
  borderRadius: 99,
  fontSize: "0.78rem",
  fontWeight: 700,
  background: "rgba(16,185,129,0.12)",
  color: "#6EE7B7",
  alignSelf: "flex-start",
};
const availBadgeRed = {
  ...availBadgeGreen,
  background: "rgba(244,63,94,0.12)",
  color: "#FDA4AF",
};
const priceBlock = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "16px 20px",
};
const priceLabel = {
  fontSize: "0.875rem",
  color: "var(--text-muted)",
  fontWeight: 500,
};
const priceValue = {
  fontSize: "2.25rem",
  fontWeight: 900,
  color: "var(--accent-light)",
  letterSpacing: "-0.03em",
};
const priceUnit = {
  fontSize: "0.875rem",
  color: "var(--text-muted)",
};
const deliveryNote = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: "0.8125rem",
  color: "var(--text-muted)",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "10px 14px",
};
const actionsRow = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};
const wishBtnStyle = (active) => ({
  width: 50,
  height: 50,
  flexShrink: 0,
  borderRadius: 14,
  border: active ? "1.5px solid rgba(244,63,94,0.4)" : "1.5px solid var(--border)",
  background: active ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.04)",
  color: active ? "#F43F5E" : "var(--text-muted)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
});
