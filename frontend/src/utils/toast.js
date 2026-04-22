import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastCtx = createContext(null);

let _addToast = null;

export const toast = {
  success: (msg) => _addToast && _addToast(msg, "success"),
  error:   (msg) => _addToast && _addToast(msg, "error"),
  info:    (msg) => _addToast && _addToast(msg, "info"),
};
// Allow toast("msg", {icon}) pattern
const callableToast = (msg, opts = {}) =>
  _addToast && _addToast(msg, "info", opts.icon);
callableToast.success = toast.success;
callableToast.error   = toast.error;
callableToast.info    = toast.info;

export { callableToast as default };

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((msg, type = "info", icon = null) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev, { id, msg, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  _addToast = addToast;

  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={toastStyle(t.type)}>
            <span style={{ fontSize: "1.1rem" }}>{t.icon || icons[t.type]}</span>
            <span style={{ flex: 1, fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.4 }}>{t.msg}</span>
            <button
              style={closeBtn}
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            >×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

const containerStyle = {
  position: "fixed",
  bottom: 90,
  right: 24,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  pointerEvents: "none",
  maxWidth: 340,
};
const toastStyle = (type) => ({
  background: "#2D3F55",
  border: `1px solid rgba(255,255,255,0.07)`,
  borderLeft: `3px solid ${type === "success" ? "#10B981" : type === "error" ? "#F43F5E" : "#3B82F6"}`,
  borderRadius: 12,
  padding: "12px 14px",
  color: "#F1F5F9",
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  pointerEvents: "auto",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  animation: "fadeInUp 0.3s ease both",
});
const closeBtn = {
  background: "none",
  border: "none",
  color: "#94A3B8",
  cursor: "pointer",
  fontSize: "1.1rem",
  lineHeight: 1,
  padding: "0 2px",
  fontFamily: "inherit",
};
