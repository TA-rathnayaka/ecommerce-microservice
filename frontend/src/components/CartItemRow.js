export function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const product = item.product || item;
  const quantity = Number(item.unit ?? item.qty ?? 1);
  const subtotal = (Number(product.price ?? 0) * quantity).toFixed(2);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-moss/10 bg-white/80 p-4 backdrop-blur sm:flex-row sm:items-center sm:gap-4">
      
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-base font-bold text-ink truncate">{product.name}</p>
        <p className="font-body text-sm text-ink/50 mt-0.5">${Number(product.price ?? 0).toFixed(2)} each</p>
      </div>

      {/* Controls row — sits below name on mobile, inline on desktop */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">

        {/* Quantity stepper */}
        <div className="flex items-center gap-2 rounded-xl border border-ink/15 bg-clay/40 px-2 py-1">
          <button
            onClick={onDecrease}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/70 transition hover:bg-white/80 hover:text-ink active:scale-95"
          >
            −
          </button>
          <span className="w-6 text-center font-body text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-ink/70 transition hover:bg-white/80 hover:text-ink active:scale-95"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <p className="w-20 text-right font-display text-base font-bold text-ink">
          ${subtotal}
        </p>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
          Remove
        </button>

      </div>
    </div>
  );
}