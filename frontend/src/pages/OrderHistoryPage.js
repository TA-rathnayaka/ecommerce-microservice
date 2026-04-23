import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { OrderSummaryCard } from "../components/OrderSummaryCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function OrderHistoryPage() {
  const { token } = useAuth();
  const toast = useToast();

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      try {
        setIsLoading(true);
        const data = await api.getOrders(token);
        if (mounted) {
          setOrders(Array.isArray(data) ? data : data?.orders || []);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch orders");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [token, toast]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
      <h1 className="mb-5 font-display text-4xl font-bold text-ink">Order History</h1>

      {isLoading ? (
        <LoadingSpinner label="Loading orders" />
      ) : orders.length === 0 ? (
        <p className="font-body text-ink/70">No orders found yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderSummaryCard key={`${order.txnId || index}`} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
