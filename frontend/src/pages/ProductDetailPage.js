// pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Interaction states
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await api.getProductById(productId);
        if (mounted) {
          setProduct(data);
          // Default to the first available weight option if the product has weight variants
          if (data?.weights?.length) {
            setSelectedWeight(data.weights[0]);
          }
        }
      } catch (error) {
        if (mounted) toast.error(error.message || "Failed to fetch product details");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadProduct();
    return () => { mounted = false; };
  }, [productId, toast]);

  // Derive the images array: use product.images if present, otherwise fall back to banner
  const images = product?.images?.length
    ? product.images
    : product?.banner
    ? [product.banner]
    : [];

  // Derive displayed price: if a weight is selected and has its own price, use it;
  // otherwise fall back to product.price
  const activePrice =
    selectedWeight?.price != null
      ? Number(selectedWeight.price)
      : Number(product?.price ?? 0);

  // Use product.compareAtPrice if provided; otherwise compute a 25% markup only as a
  // last resort so we never silently show a made-up crossed-out price.
  const compareAtPrice =
    product?.compareAtPrice != null
      ? Number(product.compareAtPrice)
      : product?.originalPrice != null
      ? Number(product.originalPrice)
      : null;

  const isAvailable = product?.available ?? false;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in before adding to cart");
      navigate("/login");
      return;
    }
    if (!isAvailable) return;

    setIsAddingToCart(true);
    try {
      await addToCart(
        { ...product, selectedWeight: selectedWeight?.label ?? null },
        quantity
      );
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in before buying");
      navigate("/login");
      return;
    }
    if (!isAvailable) return;

    try {
      await addToCart(
        { ...product, selectedWeight: selectedWeight?.label ?? null },
        quantity
      );
      navigate("/cart");
    } catch (error) {
      toast.error(error.message || "Failed to proceed to checkout");
    }
  };

  if (isLoading) return <LoadingSpinner label="Loading product details" />;

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Product Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block text-moss hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Derive the weight options from product data.
  // Expected shape: product.weights = [{ label: "500 g", price: 4.99 }, ...]
  // If the API returns a flat array of strings, normalise them.
  const weightOptions = (product.weights ?? []).map((w) =>
    typeof w === "string" ? { label: w, price: null } : w
  );

  return (
    <div className="bg-white pt-12 pb-20">


      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Left: Images */}
          <div className="space-y-6">
            {/* Main image */}
            <div className="aspect-square w-full overflow-hidden rounded-[40px] border border-slate-100 bg-gray-50/50 p-8 transition-all hover:border-moss/10">
              {images[selectedImageIndex] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-body text-ink/20">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnails — only rendered when there are multiple images */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-24 w-24 overflow-hidden rounded-2xl border bg-gray-50/30 p-2 cursor-pointer transition-all ${
                      idx === selectedImageIndex
                        ? "border-moss ring-1 ring-moss/20"
                        : "border-slate-100 hover:border-moss/30"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${product.name} view ${idx + 1}`}
                      className="h-full w-full object-contain mix-blend-multiply opacity-60"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center py-4">
            <p className="font-display text-lg font-semibold text-moss mb-1 uppercase tracking-wide">
              {product.category || "Fresh Produce"}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <h1 className="font-display text-4xl font-black tracking-tight text-ink md:text-5xl">
                {product.name}
              </h1>
              {isAvailable && (
                <span className="rounded-full bg-moss/5 px-4 py-1 text-xs font-bold text-moss border border-moss/10">
                  In Stock
                </span>
              )}
              {!isAvailable && (
                <span className="rounded-full bg-red-50 px-4 py-1 text-xs font-bold text-red-400 border border-red-100">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="mb-8 flex items-baseline gap-4">
              <p className="font-display text-3xl font-black text-ink">
                ${activePrice.toFixed(2)}
              </p>
              {/* Only show a crossed-out price when the API actually provides one */}
              {compareAtPrice != null && compareAtPrice > activePrice && (
                <p className="font-display text-xl font-medium text-ink/20 line-through">
                  ${compareAtPrice.toFixed(2)}
                </p>
              )}
            </div>

            <p className="mb-10 font-body text-lg leading-relaxed text-ink/60">
              {product.desc ||
                "Experience the natural taste of our premium produce. Sourced directly from local farms and delivered fresh to your doorstep."}
            </p>

            {/* Weight Options — only rendered when the product exposes weight variants */}
            {weightOptions.length > 0 && (
              <div className="mb-10">
                <p className="mb-4 font-display text-sm font-black uppercase tracking-widest text-ink/30">
                  Weight
                </p>
                <div className="flex flex-wrap gap-3">
                  {weightOptions.map((w) => (
                    <button
                      key={w.label}
                      onClick={() => setSelectedWeight(w)}
                      className={`rounded-full px-8 py-2.5 font-display text-sm font-bold transition-all ${
                        selectedWeight?.label === w.label
                          ? "bg-moss text-white shadow-lg shadow-moss/20"
                          : "bg-white border border-slate-100 text-ink/60 hover:border-moss/30 hover:text-moss"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Stepper */}
              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-gray-50/50 px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-ink active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="min-w-[20px] text-center font-display text-lg font-black text-ink">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-ink active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isAvailable}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-moss px-10 py-4 font-display text-base font-bold text-white shadow-xl shadow-moss/20 transition-all hover:bg-moss/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <span>Add to cart</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="rounded-full bg-[#FFB703] px-12 py-4 font-display text-base font-bold text-white shadow-xl shadow-[#FFB703]/20 transition-all hover:bg-[#E5A503] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}