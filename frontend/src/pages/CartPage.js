// CartPage.jsx
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
        const price = Number(item.product?.price ?? 0);
        const qty = Number(item.unit ?? 1);
        return sum + price * qty;
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
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-ink md:text-5xl">Your Cart</h1>
          <p className="mt-2 font-body text-ink/40">Review your items before proceeding to checkout</p>
        </div>
        <button
          onClick={refreshCart}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-gray-50 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
          </svg>
          Refresh Cart
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gray-50/50 py-20 text-center">
          <p className="font-display text-xl font-bold text-ink/30">Your cart is feeling a bit light.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="mt-6 rounded-xl bg-moss px-8 py-3 font-display font-bold text-white transition hover:bg-moss/90"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Cart Table */}
          <div className="lg:col-span-8">
            {/* Desktop Header */}
            <div className="mb-4 hidden grid-cols-12 px-4 font-display text-xs font-black uppercase tracking-widest text-ink/30 sm:grid">
              <div className="col-span-5">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Subtotal</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const quantity = Number(item.unit ?? 1);
                const productId = item.product?._id;

                return (
                  <CartItemRow
                    key={item._id}
                    item={item}
                    onIncrease={() => updateCartQuantity(item, quantity + 1)}
                    onDecrease={() =>
                      quantity > 1
                        ? updateCartQuantity(item, quantity - 1)
                        : removeFromCart(productId)
                    }
                    onRemove={() => removeFromCart(productId)}
                  />
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-3xl border border-slate-100 bg-white p-8">
              <h2 className="mb-6 font-display text-2xl font-bold text-ink">Summary</h2>
              
              <div className="space-y-4 border-b border-slate-50 pb-6">
                <div className="flex justify-between font-body text-ink/60">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-body text-ink/60">
                  <span>Shipping</span>
                  <span className="font-bold text-moss">Free</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between font-display text-2xl font-bold text-ink">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="mt-8 w-full rounded-2xl bg-moss py-4 font-display text-lg font-bold text-white shadow-xl shadow-moss/20 transition hover:bg-moss/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPlacingOrder ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Checkout Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}