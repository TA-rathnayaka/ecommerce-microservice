import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// SVG Icons
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c0-5.52 4.48-10 10-10s10 4.48 10 10"/>
    <path d="M12 12C12 6.48 7.52 2 2 2c0 5.52 4.48 10 10 10z"/>
  </svg>
);

export const Header = () => {
  const { user, cart } = useSelector((state) => state.userReducer);
  const { token } = user;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = Array.isArray(cart) ? cart.length : 0;

  return (
    <>
      <nav style={navStyle(scrolled)}>
        <div style={innerStyle}>
          {/* Brand */}
          <Link to="/" style={brandStyle}>
            <span style={brandIconStyle}><LeafIcon /></span>
            <span style={{ background: "linear-gradient(90deg,#6EE7B7,#3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.03em" }}>
              FreshMart
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={desktopNavStyle} className="hide-mobile">
          <Link to="/" style={navLinkStyle}>Shop</Link>
            <button style={{ ...navLinkStyle, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)" }}>Categories</button>
            <button style={{ ...navLinkStyle, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)" }}>Offers</button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {token && (
              <button
                onClick={() => navigate("/login")}
                style={cartBtnStyle}
                title="Cart"
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span style={badgeStyle}>{cartCount}</span>
                )}
              </button>
            )}
            <button
              onClick={() => navigate("/login")}
              style={userBtnStyle(!!token)}
              title={token ? "Profile" : "Login"}
            >
              <UserIcon />
              <span className="hide-mobile" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                {token ? "Profile" : "Login"}
              </span>
            </button>
            <button
              className="hide-desktop btn btn-ghost btn-icon"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: "var(--text-primary)" }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={mobileMenuStyle} className="hide-desktop">
            <Link to="/" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>🛒 Shop</Link>
            <Link to="/login" style={mobileNavLinkStyle} onClick={() => setMenuOpen(false)}>👤 {token ? "Profile" : "Login"}</Link>
          </div>
        )}
      </nav>
    </>
  );
};

/* ── Styles ── */
const navStyle = (scrolled) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  height: 72,
  background: scrolled
    ? "rgba(15,23,42,0.92)"
    : "rgba(15,23,42,0.70)",
  backdropFilter: "blur(24px) saturate(1.6)",
  WebkitBackdropFilter: "blur(24px) saturate(1.6)",
  borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
  transition: "background 0.3s ease, border-color 0.3s ease",
  boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.4)" : "none",
});
const innerStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  height: "100%",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
};
const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
};
const brandIconStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "linear-gradient(135deg,#10B981,#059669)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  flexShrink: 0,
};
const desktopNavStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1,
  justifyContent: "center",
};
const navLinkStyle = {
  color: "var(--text-secondary)",
  fontSize: "0.9rem",
  fontWeight: 500,
  padding: "6px 14px",
  borderRadius: 8,
  transition: "all 0.2s",
  textDecoration: "none",
};
const cartBtnStyle = {
  position: "relative",
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "1.5px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.06)",
  color: "var(--text-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
};
const badgeStyle = {
  position: "absolute",
  top: -4,
  right: -4,
  width: 18,
  height: 18,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#10B981,#059669)",
  color: "#fff",
  fontSize: "0.65rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const userBtnStyle = (loggedIn) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 16px",
  borderRadius: 99,
  border: loggedIn ? "1.5px solid rgba(110,231,183,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
  background: loggedIn ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.06)",
  color: loggedIn ? "var(--accent-light)" : "var(--text-primary)",
  cursor: "pointer",
  fontFamily: "var(--font)",
  transition: "all 0.2s",
});
const mobileMenuStyle = {
  background: "rgba(30,41,59,0.98)",
  borderTop: "1px solid rgba(255,255,255,0.07)",
  padding: "16px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};
const mobileNavLinkStyle = {
  color: "var(--text-primary)",
  fontSize: "1rem",
  fontWeight: 500,
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  textDecoration: "none",
};