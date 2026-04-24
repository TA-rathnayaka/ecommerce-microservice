import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemRow } from "../components/CartItemRow";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

function generateTxnId() {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TXN-${random}`;
}

export function CartPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuth();
  const {
    cartItems,
    isCartLoading,
    updateCartQuantity,
    removeFromCart,
    refreshCart,
    clearCart,
  } = useCart();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = item.product || item;
        const quantity = item.unit || item.qty || 1;
        return sum + Number(product.price || 0) * quantity;
      }, 0),
    [cartItems]
  );

  const handlePlaceOrder = async () => {
    const txnId = generateTxnId();
    try {
      setIsPlacingOrder(true);
      await api.placeOrder(token, txnId);
      clearCart();
      toast.success(`Order placed. Transaction: ${txnId}`);
      navigate("/orders");
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isCartLoading) {
    return <LoadingSpinner label="Loading cart" />;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-ink">Your Cart</h1>
        <button
          onClick={refreshCart}
          className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-white/60"
        >
          Refresh
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="font-body text-ink/70">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cartItems.map((item, index) => {
            const product = item.product || item;
            const quantity = item.unit || item.qty || 1;
            const itemId = product._id || item._id;

            return (
              <CartItemRow
                key={`${itemId}-${index}`}
                item={item}
                onIncrease={() => updateCartQuantity(item, quantity + 1)}
                onDecrease={() => updateCartQuantity(item, quantity - 1)}
                onRemove={() => removeFromCart(itemId)}
              />
            );
          })}

          <div className="mt-6 rounded-2xl border border-ink/10 bg-white/80 p-5">
            <p className="font-display text-2xl font-semibold text-ink">Total: ${total.toFixed(2)}</p>
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="mt-4 rounded-xl bg-ember px-6 py-3 font-display text-base font-semibold text-white transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPlacingOrder ? "Placing order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
