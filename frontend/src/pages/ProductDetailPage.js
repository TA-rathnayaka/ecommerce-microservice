import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const data = await api.getProductById(productId);
        if (mounted) {
          setProduct(data?.product || data);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch product details");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      mounted = false;
    };
  }, [productId, toast]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in before adding to cart");
      navigate("/login");
      return;
    }

    try {
      await addToCart(product, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading product" />;
  }

  if (!product) {
    return <p className="mx-auto max-w-6xl px-4 py-8 font-body text-ink/70 md:px-6">Product not found.</p>;
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white/70">
        {product.banner ? (
          <img src={product.banner} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-[320px] items-center justify-center font-body text-sm text-ink/60">No image</div>
        )}
      </div>
      <div className="space-y-4">
        <p className="inline-block rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-aqua">
          {product.type}
        </p>
        <h1 className="font-display text-4xl font-bold text-ink">{product.name}</h1>
        <p className="font-body text-base leading-relaxed text-ink/80">{product.desc || "No description available."}</p>
        <p className="font-display text-3xl font-bold text-ink">${product.price}</p>
        <button
          onClick={handleAddToCart}
          className="rounded-xl bg-ink px-6 py-3 font-display text-base font-semibold text-clay transition hover:bg-ink/90"
        >
          Add to Cart
        </button>
      </div>
    </section>
  );
}
