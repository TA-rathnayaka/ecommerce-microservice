import React, { useState, useEffect } from "react";
import toast from "../utils/toast";
import {
  onRemoveFromWishlist,
  onViewProfile,
  onAddToCart,
  onRemoveFromCart,
  onCreateAddress,
  onPlaceOrder,
} from "../store/actions";
import { AddressComponent } from "../components/Address-comp";
import { CartItem } from "../components/Cart-comp";
import { WishItem } from "../components/Wishlist-comp";
import { OrderItem } from "../components/Order-comp";
import { useAppDispatch, useAppSelector } from "../store/hooks";

// Icons
const CartTabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const HeartTabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const OrdersTabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const AddressIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const GiftIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/>
    <rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);
const UserCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const TABS = [
  { key: "cart",     label: "Cart",     Icon: CartTabIcon },
  { key: "wishlist", label: "Wishlist", Icon: HeartTabIcon },
  { key: "orders",   label: "Orders",   Icon: OrdersTabIcon },
  { key: "address",  label: "Address",  Icon: AddressIcon },
];

const Profile = () => {
  const { user, wishlist, cart, orders, address } = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("cart");
  const [street, setStreet]       = useState("");
  const [city, setCity]           = useState("");
  const [state, setState]         = useState("");
  const [postalCode, setPostal]   = useState("");
  const [country, setCountry]     = useState("");

  const { token } = user;

  useEffect(() => {
    if (token) dispatch(onViewProfile());
  }, [token, dispatch]);

  const onAdd    = ({ _id, qty }) => dispatch(onAddToCart({ _id, qty }));
  const onRemove = ({ _id })      => dispatch(onRemoveFromCart(_id));

  const removeFromWishlist = (_id) => {
    dispatch(onRemoveFromWishlist(_id));
    toast("Removed from wishlist", { icon: "💔" });
  };

  const addNewAddress = () => {
    if (!street || !city || !country) {
      toast.error("Please fill in at least street, city and country.");
      return;
    }
    dispatch(onCreateAddress({ street, postalCode, city, country }));
    toast.success("Address saved!");
  };

  const onTapPlaceOrder = () => {
    dispatch(onPlaceOrder({ txnId: "TXN-" + Date.now() }));
    toast.success("Order placed successfully! 🎉");
  };

  /* ── Cart total ── */
  const cartTotal = Array.isArray(cart)
    ? cart.reduce((sum, { unit, product }) => sum + unit * product.price, 0)
    : 0;

  /* ── Tab content ── */
  const renderCart = () => (
    Array.isArray(cart) && cart.length
      ? cart.map((item, i) => item && (
          <CartItem key={i} cart={cart} item={item} onAdd={onAdd} onRemove={onRemove} />
        ))
      : <div className="empty-state"><span className="empty-icon">🛒</span><p>Your cart is empty.</p></div>
  );

  const renderWishlist = () => (
    Array.isArray(wishlist) && wishlist.length
      ? wishlist.map((item, i) => <WishItem key={i} item={item} onTapRemove={removeFromWishlist} />)
      : <div className="empty-state"><span className="empty-icon">💛</span><p>Your wishlist is empty.</p></div>
  );

  const renderOrders = () => (
    Array.isArray(orders) && orders.length
      ? orders.map((item, i) => <OrderItem key={i} item={item} onTapViewMore={() => {}} />)
      : <div className="empty-state"><span className="empty-icon">📦</span><p>No orders yet.</p></div>
  );

  const renderAddress = () => (
    Array.isArray(address) && address.length
      ? <AddressComponent address={address} />
      : (
        <div style={addressFormWrap}>
          <h3 style={formTitle}>Add Delivery Address</h3>
          <div style={formGrid}>
            <div className="input-group" style={{ gridColumn: "1/-1" }}>
              <span className="input-icon"><AddressIcon /></span>
              <input className="input-field" placeholder="Street address" value={street} onChange={e => setStreet(e.target.value)} />
            </div>
            <div className="input-group">
              <span className="input-icon">🏙</span>
              <input className="input-field" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="input-group">
              <span className="input-icon">🗺</span>
              <input className="input-field" placeholder="State" value={state} onChange={e => setState(e.target.value)} />
            </div>
            <div className="input-group">
              <span className="input-icon">📮</span>
              <input className="input-field" placeholder="Postal code" value={postalCode} onChange={e => setPostal(e.target.value)} />
            </div>
            <div className="input-group">
              <span className="input-icon">🌍</span>
              <input className="input-field" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addNewAddress} style={{ marginTop: 8 }}>
            Save Address
          </button>
        </div>
      )
  );

  const tabContent = {
    cart: renderCart,
    wishlist: renderWishlist,
    orders: renderOrders,
    address: renderAddress,
  };

  return (
    <div style={pageStyle}>
      {/* ── Profile Header ── */}
      <div style={profileHeaderStyle}>
        <div style={avatarStyle}><UserCircleIcon /></div>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>My Account</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
            {Array.isArray(cart) ? cart.length : 0} cart items · {Array.isArray(orders) ? orders.length : 0} orders
          </p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={tabBarStyle}>
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            style={tabBtnStyle(activeTab === key)}
            onClick={() => setActiveTab(key)}
          >
            <Icon />
            <span>{label}</span>
            {key === "cart" && Array.isArray(cart) && cart.length > 0 && (
              <span style={tabCountBadge}>{cart.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div style={contentArea}>
        {tabContent[activeTab]?.()}
      </div>

      {/* ── Order Bar ── (only when cart has items) */}
      {activeTab === "cart" && Array.isArray(cart) && cart.length > 0 && (
        <div style={orderBarStyle}>
          <div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Total</p>
            <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--accent-light)", margin: "2px 0 0" }}>
              ₹{cartTotal}
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            style={{ paddingLeft: 36, paddingRight: 36 }}
            onClick={onTapPlaceOrder}
          >
            <GiftIcon /> Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export { Profile };

/* ── Styles ── */
const pageStyle = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "36px 24px 100px",
};
const profileHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 28,
  padding: "20px 24px",
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
};
const avatarStyle = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#10B981,#3B82F6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  flexShrink: 0,
};
const tabBarStyle = {
  display: "flex",
  gap: 4,
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: 4,
  marginBottom: 20,
  flexWrap: "wrap",
};
const tabBtnStyle = (active) => ({
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: active ? "var(--bg-elevated)" : "transparent",
  color: active ? "var(--text-primary)" : "var(--text-muted)",
  fontWeight: active ? 700 : 500,
  fontSize: "0.875rem",
  fontFamily: "var(--font)",
  cursor: "pointer",
  transition: "all 0.2s",
  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
  position: "relative",
});
const tabCountBadge = {
  position: "absolute",
  top: 4,
  right: 6,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "#10B981",
  color: "#fff",
  fontSize: "0.62rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const contentArea = {
  minHeight: 300,
};
const orderBarStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(15,23,42,0.95)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  padding: "16px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 500,
  boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
};
const addressFormWrap = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: "28px 24px",
};
const formTitle = {
  fontSize: "1rem",
  fontWeight: 700,
  color: "var(--text-primary)",
  marginBottom: 20,
};
const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0 16px",
};
