import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const toast = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }
    try {
      const data = await api.getWishlist(token);
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!token) throw new Error("Please log in to manage wishlist");
      try {
        await api.addToWishlist(token, productId);
        await refreshWishlist();
      } catch (error) {
        toast.error(error.message || "Failed to update wishlist");
        throw error;
      }
    },
    [token, refreshWishlist, toast]
  );

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item._id === productId);
    },
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider value={{ wishlistItems, refreshWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }
  return context;
}
