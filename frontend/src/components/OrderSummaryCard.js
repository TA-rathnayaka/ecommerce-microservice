export function OrderSummaryCard({ order }) {
  return (
    <article className="rounded-2xl border border-ink/10 bg-white/75 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink/50">
          {new Date(order.date).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
          })}
        </span>
      </div>
      <p className="text-right font-display text-2xl font-bold text-ink">
        ${Number(order.amount).toFixed(2)}
      </p>
    </article>
  );
}