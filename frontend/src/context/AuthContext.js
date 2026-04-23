import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "auth_token";

function getInitialToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getInitialToken);

  const login = (nextToken) => {
    setToken(nextToken);
    try {
      sessionStorage.setItem(TOKEN_KEY, nextToken);
    } catch {
      // no-op when storage is unavailable
    }
  };

  const logout = () => {
    setToken(null);
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // no-op when storage is unavailable
    }
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
