import { Link } from "react-router-dom";

export function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group overflow-hidden rounded-3xl border border-ink/10 bg-white/80 shadow-soft transition hover:-translate-y-1 hover:border-ink/20"
    >
      <div className="aspect-[4/3] overflow-hidden bg-clay/80">
        {product.banner ? (
          <img
            src={product.banner}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-body text-sm text-ink/50">No image</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <p className="font-display text-lg font-semibold text-ink">{product.name}</p>
        <p className="inline-block rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-aqua">
          {product.type}
        </p>
        <p className="font-body text-base text-ink/80">${product.price}</p>
      </div>
    </Link>
  );
}