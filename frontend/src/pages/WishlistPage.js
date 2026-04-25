import { Link, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlistItems, isWishlistLoading, refreshWishlist } = useWishlist();

  if (isWishlistLoading) {
    return <LoadingSpinner label="Loading wishlist" />;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight text-ink md:text-5xl">My Wishlist</h1>
          <p className="mt-2 font-body text-ink/40">Your saved favorite items from our catalog</p>
        </div>
        <button
          onClick={refreshWishlist}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-gray-50 active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
          </svg>
          Refresh Wishlist
        </button>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-gray-50/50 py-20 text-center">
          <p className="font-display text-xl font-bold text-ink/30">Your wishlist is empty.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="mt-6 rounded-xl bg-moss px-8 py-3 font-display font-bold text-white transition hover:bg-moss/90"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

