export function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const product = item.product || item;
  const quantity = item.unit || item.qty || 1;

  return (
    <div className="grid grid-cols-12 items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4">
      <div className="col-span-6">
        <p className="font-display text-lg font-semibold text-ink">{product.name}</p>
        <p className="font-body text-sm text-ink/70">${product.price} each</p>
      </div>
      <div className="col-span-3 flex items-center gap-2">
        <button onClick={onDecrease} className="h-8 w-8 rounded-full border border-ink/20 text-ink hover:bg-clay">
          -
        </button>
        <span className="w-8 text-center font-body text-sm font-semibold">{quantity}</span>
        <button onClick={onIncrease} className="h-8 w-8 rounded-full border border-ink/20 text-ink hover:bg-clay">
          +
        </button>
      </div>
      <div className="col-span-2 text-right font-display text-base font-semibold text-ink">
        ${(product.price * quantity).toFixed(2)}
      </div>
      <div className="col-span-1 text-right">
        <button onClick={onRemove} className="rounded-lg bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-500/25">
          Remove
        </button>
      </div>
    </div>
  );
}
