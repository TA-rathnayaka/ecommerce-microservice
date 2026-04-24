import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { onLogin, onSignup } from "../store/actions";
import { onViewProfile } from "../store/actions";
import { Profile } from "./Profile";
import toast from "../utils/toast";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,12 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.18 2 2 0 0 1 3.57 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22c0-5.52 4.48-10 10-10s10 4.48 10 10"/>
    <path d="M12 12C12 6.48 7.52 2 2 2c0 5.52 4.48 10 10 10z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const { token } = user;

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(onViewProfile());
    }
  }, [token, dispatch]);
  useEffect(() => {
  setEmail("");
  setPassword("");
  setPhone("");
}, [isSignup]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(onLogin({ email, password }));
      toast.success("Welcome back!");
    } catch {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await dispatch(onSignup({ email, password, phone }));
      toast.success("Account created! Please log in.");
      setIsSignup(false);
    } catch {
      toast.error("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (token) return <Profile />;

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* ── Close Button ── */}
        <button
          style={closeBtn}
          onClick={() => navigate(-1)}
          aria-label="Close"
          onMouseEnter={e => e.currentTarget.style.opacity = "0.5"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <X size={18} />
        </button>

        {/* Logo */}
        <div style={logoWrap}>
          <div style={logoIcon}><LeafIcon /></div>
          <span style={logoText}>FreshMart</span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={heading}>{isSignup ? "Create Account" : "Welcome Back"}</h1>
          <p style={subheading}>
            {isSignup
              ? "Sign up to start shopping fresh."
              : "Sign in to your account to continue."}
          </p>
        </div>

        {/* Tabs */}
        <div style={tabsWrap}>
          <button
            style={tabBtn(!isSignup)}
            onClick={() => setIsSignup(false)}
            onMouseEnter={e => { if (isSignup) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            Login
          </button>
          <button
            style={tabBtn(isSignup)}
            onClick={() => setIsSignup(true)}
            onMouseEnter={e => { if (!isSignup) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div className="input-group">
            <span className="input-icon"><EmailIcon /></span>
            <input
              className="input-field"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (isSignup ? handleSignup() : handleLogin())}
            />
          </div>
          <div className="input-group">
            <span className="input-icon"><LockIcon /></span>
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (isSignup ? handleSignup() : handleLogin())}
            />
          </div>
          {isSignup && (
            <div className="input-group">
              <span className="input-icon"><PhoneIcon /></span>
              <input
                className="input-field"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          style={{
            ...primaryBtn,
            opacity: loading ? 0.5 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={isSignup ? handleSignup : handleLogin}
          disabled={loading}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.75"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = "1"; }}
        >
          {loading ? "Please wait…" : isSignup ? "Create Account" : "Sign In"}
        </button>

        {/* Toggle */}
        <p style={{ textAlign: "center", marginTop: 22, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            style={linkBtn}
            onClick={() => setIsSignup(!isSignup)}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.5"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export { Login };

/* ── Styles ── */
const pageStyle = {
  position: "relative",
  minHeight: "calc(100vh - 72px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
  background: "var(--hero-bg)",
};
const cardStyle = {
  position: "relative",
  width: "100%",
  maxWidth: 440,
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: 24,
  padding: "40px 36px",
  boxShadow: "0 10px 40px rgba(54, 97, 43, 0.12)",
  animation: "fadeInUp 0.5s ease both",
};
const closeBtn = {
  position: "absolute",
  top: 16,
  right: 16,
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "1px solid var(--border-strong)",
  background: "transparent",
  color: "var(--text-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "opacity 0.2s",
};
const logoWrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  marginBottom: 28,
};
const logoIcon = {
  width: 46,
  height: 46,
  borderRadius: 12,
  background: "var(--accent)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-on-accent)",
};
const logoText = {
  fontSize: "1.375rem",
  fontWeight: 800,
  color: "var(--text-primary)",
  letterSpacing: "-0.03em",
};
const heading = {
  fontSize: "1.625rem",
  fontWeight: 800,
  color: "var(--text-primary)",
  letterSpacing: "-0.03em",
  margin: "0 0 8px",
};
const subheading = {
  fontSize: "0.9rem",
  color: "var(--text-secondary)",
  margin: 0,
};
const tabsWrap = {
  display: "flex",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 4,
  marginBottom: 28,
  gap: 4,
};
const tabBtn = (active) => ({
  flex: 1,
  padding: "9px 0",
  borderRadius: 9,
  border: "none",
  background: active ? "var(--accent)" : "transparent",
  color: active ? "var(--text-on-accent)" : "var(--text-secondary)",
  fontWeight: active ? 700 : 500,
  fontSize: "0.875rem",
  fontFamily: "var(--font)",
  cursor: "pointer",
  transition: "opacity 0.2s",
});
const primaryBtn = {
  width: "100%",
  marginTop: 8,
  padding: "12px 0",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
  color: "var(--text-on-accent)",
  fontWeight: 700,
  fontSize: "1rem",
  fontFamily: "var(--font)",
  cursor: "pointer",
  transition: "opacity 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const linkBtn = {
  background: "none",
  border: "none",
  color: "var(--accent-hover)",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font)",
  fontSize: "0.875rem",
  padding: 0,
  transition: "opacity 0.2s",
};