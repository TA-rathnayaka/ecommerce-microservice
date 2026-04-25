import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

// fixed: cart response is [{ _id, customerId, items: [{ product, unit, _id }] }]
// we need to extract the nested items array from the first cart document
function normalizeCartItems(payload) {
  if (Array.isArray(payload)) {
    // response is an array of cart docs — get items from first cart
    return payload[0]?.items ?? [];
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
      if (!token) throw new Error("Please log in to add items to cart");

      // fixed: was searching cartItems for product._id but cartItems are now
      // normalized cart items with shape { product: {...}, unit, _id }
      const existing = cartItems.find((item) => item.product?._id === product._id);
      const currentQty = Number(existing?.unit ?? 0);
      const nextQty = currentQty + qty;

      try {
        await api.updateCart(token, {
          _id: product._id,   // product service route expects _id
          name: product.name,
          price: product.price,
          qty: nextQty,
        });
        await refreshCart();
      } catch (error) {
        toast.error(error.message || "Failed to add to cart");
        throw error;
      }
    },
    [token, refreshCart, cartItems, toast]
  );

  const updateCartQuantity = useCallback(
    async (item, qty) => {
      if (!token) throw new Error("Please log in to update cart");

      // fixed: item is a cart item { product: { _id, name, price }, unit, _id }
      // was doing item._id || item.product?._id which got the cart item's _id
      // not the product _id — the route needs the product _id
      const product = item.product;
      const productId = product?._id;

      if (!productId) {
        toast.error("Could not update cart: missing product ID");
        return;
        // fixed: was throwing, causing uncaught runtime error
        // now shows a toast and returns gracefully
      }

      try {
        if (qty <= 0) {
          await api.removeFromCart(token, productId);
          // fixed: was passing item._id (cart item id) — route expects product id
        } else {
          await api.updateCart(token, {
            _id: productId,
            name: product.name,
            price: product.price,
            qty,
          });
        }
        await refreshCart();
      } catch (error) {
        toast.error(error.message || "Failed to update cart");
        throw error;
      }
    },
    [token, refreshCart, toast]
  );

  const removeFromCart = useCallback(
    async (id) => {
      if (!token) throw new Error("Please log in to update cart");
      try {
        await api.removeFromCart(token, id);
        await refreshCart();
      } catch (error) {
        toast.error(error.message || "Failed to remove item");
        throw error;
        // fixed: was no try/catch — errors bubbled up as uncaught runtime errors
      }
    },
    [token, refreshCart, toast]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(() => {
    // fixed: itemCount was summing top-level cart docs not the nested items
    // now correctly counts quantities from normalized items
    const itemCount = cartItems.reduce(
      (count, item) => count + Number(item.unit ?? 1),
      0
    );
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