import { Link } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export function WishlistPage() {
  const { wishlistItems } = useWishlist();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">My Wishlist</h1>
        <p className="mt-2 text-ink/70">Your saved favorite items.</p>
      </div>

      {!wishlistItems ? (
        <LoadingSpinner label="Loading wishlist" />
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-ink/60 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="rounded-xl bg-moss px-6 py-3 font-display font-bold text-white shadow-lg shadow-moss/30 transition hover:bg-moss/90">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
