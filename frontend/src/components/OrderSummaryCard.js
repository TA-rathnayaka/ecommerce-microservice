export function OrderSummaryCard({ order }) {
  const items = order.items || order.products || [];
  const total = items.reduce((sum, item) => {
    const product = item.product || item;
    const quantity = item.unit || item.qty || 1;
    return sum + Number(product.price || 0) * quantity;
  }, 0);

  return (
    <article className="rounded-2xl border border-ink/10 bg-white/75 p-5 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-ink">{order.txnId || "No TXN ID"}</h3>
        <span className="rounded-full bg-moss/15 px-3 py-1 text-xs font-semibold text-moss">
          {items.length} items
        </span>
      </div>
      <ul className="mb-4 space-y-2">
        {items.map((item, index) => {
          const product = item.product || item;
          const quantity = item.unit || item.qty || 1;
          return (
            <li key={`${product._id || product.name}-${index}`} className="flex justify-between text-sm text-ink/80">
              <span>{product.name}</span>
              <span>
                {quantity} x ${product.price}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-right font-display text-lg font-semibold text-ink">Total: ${total.toFixed(2)}</p>
    </article>
  );
}
