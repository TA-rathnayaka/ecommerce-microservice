import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const toast = useToast();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setWishlistItems([]);
      return;
    }
    setIsWishlistLoading(true);
    try {
      const data = await api.getWishlist(token);
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!token) {
        toast.error("Please log in to manage wishlist");
        return;
      }
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

  const value = useMemo(() => ({
    wishlistItems,
    isWishlistLoading,
    refreshWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount: wishlistItems.length
  }), [wishlistItems, isWishlistLoading, refreshWishlist, toggleWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
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

