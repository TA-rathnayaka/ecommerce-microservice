export function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const product = item.product || item;
  const quantity = Number(item.unit ?? item.qty ?? 1);
  const subtotal = (Number(product.price ?? 0) * quantity).toFixed(2);

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-moss/20 hover:shadow-sm sm:grid-cols-12 sm:items-center">
      
      {/* Product Image & Name */}
      <div className="flex items-center gap-4 sm:col-span-5">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-clay/30">
          {product.banner ? (
            <img src={product.banner} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-moss/20">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c0 1.1-.9 2-2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-base font-bold text-ink truncate">{product.name}</p>
          <p className="font-body text-sm text-ink/40">${Number(product.price ?? 0).toFixed(2)} / unit</p>
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-start sm:col-span-3 sm:justify-center">
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-gray-50 px-2 py-1.5">
          <button
            onClick={onDecrease}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-moss transition hover:bg-white hover:shadow-sm active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span className="w-6 text-center font-display text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            onClick={onIncrease}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-moss transition hover:bg-white hover:shadow-sm active:scale-95"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-between sm:col-span-3 sm:justify-end">
        <span className="text-sm text-ink/40 sm:hidden">Subtotal:</span>
        <p className="font-display text-lg font-bold text-moss">
          ${subtotal}
        </p>
      </div>

      {/* Remove */}
      <div className="flex items-center justify-end sm:col-span-1">
        <button
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-50 bg-red-50/30 text-red-400 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
          title="Remove item"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}