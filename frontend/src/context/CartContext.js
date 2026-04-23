import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

function normalizeCartItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
}

export function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const toast = useToast();

  const [cartItems, setCartItems] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      return;
    }

    setIsCartLoading(true);
    try {
      const data = await api.getCart(token);
      setCartItems(normalizeCartItems(data));
    } catch (error) {
      toast.error(error.message || "Failed to load cart");
    } finally {
      setIsCartLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, refreshCart]);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      if (!token) {
        throw new Error("Please log in to add items to cart");
      }

      const existing = cartItems.find((item) => {
        const productId = item.product?._id || item._id;
        return productId === product._id;
      });
      const currentQty = existing?.unit || existing?.qty || 0;
      const nextQty = currentQty + qty;

      const payload = {
        _id: product._id,
        name: product.name,
        price: product.price,
        unit: nextQty,
        qty: nextQty,
      };

      await api.updateCart(token, payload);
      await refreshCart();
    },
    [token, refreshCart, cartItems]
  );

  const updateCartQuantity = useCallback(
    async (item, qty) => {
      if (!token) {
        throw new Error("Please log in to update cart");
      }

      if (qty <= 0) {
        await api.removeFromCart(token, item._id || item.product?._id);
      } else {
        const product = item.product || item;
        await api.updateCart(token, {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: qty,
          qty,
        });
      }

      await refreshCart();
    },
    [token, refreshCart]
  );

  const removeFromCart = useCallback(
    async (id) => {
      if (!token) {
        throw new Error("Please log in to update cart");
      }
      await api.removeFromCart(token, id);
      await refreshCart();
    },
    [token, refreshCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(() => {
    const itemCount = cartItems.reduce((count, item) => count + (item.unit || item.qty || 1), 0);
    return {
      cartItems,
      itemCount,
      isCartLoading,
      refreshCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    };
  }, [cartItems, isCartLoading, refreshCart, addToCart, updateCartQuantity, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
