import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";

export function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  const isFavorite = isInWishlist(product._id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to manage your wishlist");
      navigate("/login");
      return;
    }
    
    try {
      await toggleWishlist(product._id);
      toast.success(isFavorite ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      // error handled in context or we can just ignore since context shows toast
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-white p-4 transition-all border border-ink/5"
    >
      <button
        onClick={handleWishlistToggle}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-clay ${
          isFavorite ? "bg-red-100 text-red-500" : "bg-clay/50 text-ink/20 hover:text-red-500"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </button>

      <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-clay/30">
        {product.banner ? (
          <img
            src={product.banner}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold capitalize text-ink text-center">
        {product.name}
      </h3>
      
      <div className="mt-1 mb-2 flex items-center justify-center gap-1 text-xs font-semibold text-ink/50 capitalize">
        {product.type}
      </div>

      <div className="font-display text-xl font-bold text-ink text-center mt-auto pt-2">
        <span className="text-ember text-base">$ </span>{Number(product.price).toFixed(2)}
      </div>
    </Link>
  );
}
