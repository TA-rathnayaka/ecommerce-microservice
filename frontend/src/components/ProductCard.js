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
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-white p-4 transition-all border border-moss/10"
    >
      <button
        onClick={handleWishlistToggle}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-sm transition-all hover:scale-110 active:scale-95 ${
          isFavorite ? "border-moss/20 text-moss" : "border-slate-100 text-ink/30 hover:text-moss hover:border-moss/20"
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isFavorite ? "currentColor" : "none"} 
          stroke="currentColor" 
          strokeWidth="2"
          viewBox="0 0 24 24" 
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
