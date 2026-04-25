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
  const [selectedWeight, setSelectedWeight] = useState("500 g");
  const weights = ["500 g", "1 Kg", "2 Kg", "5 Kg"];

  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await api.getProductById(productId);
        if (mounted) {
          setProduct(data);
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in before adding to cart");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
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
    try {
      await addToCart(product, quantity);
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
        <Link to="/shop" className="mt-4 inline-block text-moss hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const oldPrice = Number(product.price ?? 0) * 1.25;

  return (
    <div className="bg-white pb-20">
      {/* Breadcrumbs & Title */}
      <div className="py-12 text-center">
        <h1 className="font-display text-5xl font-bold text-ink mb-2">Shop</h1>
        <div className="flex items-center justify-center gap-2 font-body text-sm text-ink/40">
          <Link to="/" className="hover:text-moss transition-colors">Home</Link>
          <span>/</span>
          <span className="text-ink/60">Shop</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Left: Images */}
          <div className="space-y-6">
            <div className="aspect-square w-full overflow-hidden rounded-[40px] border border-slate-100 bg-gray-50/50 p-8 transition-all hover:border-moss/10">
              {product.banner ? (
                <img
                  src={product.banner}
                  alt={product.name}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-body text-ink/20">No Image</div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4">
              {[1, 2, 3].map((idx) => (
                <div 
                  key={idx}
                  className={`h-24 w-24 overflow-hidden rounded-2xl border bg-gray-50/30 p-2 cursor-pointer transition-all ${
                    idx === 1 ? "border-moss ring-1 ring-moss/20" : "border-slate-100 hover:border-moss/30"
                  }`}
                >
                  <img src={product.banner} alt="" className="h-full w-full object-contain mix-blend-multiply opacity-60" />
                </div>
              ))}
            </div>
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
              {product.available && (
                <span className="rounded-full bg-moss/5 px-4 py-1 text-xs font-bold text-moss border border-moss/10">
                  In Stock
                </span>
              )}
            </div>

            <div className="mb-8 flex items-baseline gap-4">
              <p className="font-display text-3xl font-black text-ink">
                ${Number(product.price ?? 0).toFixed(2)}
              </p>
              <p className="font-display text-xl font-medium text-ink/20 line-through">
                ${oldPrice.toFixed(2)}
              </p>
            </div>

            <p className="mb-10 font-body text-lg leading-relaxed text-ink/60">
              {product.desc || "Experience the natural taste of our premium produce. Sourced directly from local farms and delivered fresh to your doorstep."}
            </p>

            {/* Weight Options */}
            <div className="mb-10">
              <p className="mb-4 font-display text-sm font-black uppercase tracking-widest text-ink/30">Weight</p>
              <div className="flex flex-wrap gap-3">
                {weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`rounded-full px-8 py-2.5 font-display text-sm font-bold transition-all ${
                      selectedWeight === w
                        ? "bg-moss text-white shadow-lg shadow-moss/20"
                        : "bg-white border border-slate-100 text-ink/60 hover:border-moss/30 hover:text-moss"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Stepper */}
              <div className="flex items-center gap-4 rounded-full border border-slate-100 bg-gray-50/50 px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-ink active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
                <span className="min-w-[20px] text-center font-display text-lg font-black text-ink">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/40 transition hover:bg-white hover:text-ink active:scale-95"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.available}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-moss px-10 py-4 font-display text-base font-bold text-white shadow-xl shadow-moss/20 transition-all hover:bg-moss/90 active:scale-95 disabled:opacity-50"
              >
                {isAddingToCart ? (
                  "Adding..."
                ) : (
                  <>
                    <span>Add to cart</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={!product.available}
                className="rounded-full bg-[#FFB703] px-12 py-4 font-display text-base font-bold text-white shadow-xl shadow-[#FFB703]/20 transition-all hover:bg-[#E5A503] active:scale-95 disabled:opacity-50"
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