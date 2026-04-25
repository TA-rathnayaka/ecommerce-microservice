import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryFilter } from "../components/CategoryFilter";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";

export function HomePage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const data = await api.getProducts();
        if (mounted) {
          setProducts(Array.isArray(data) ? data : data?.products || []);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch products");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [toast]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      {/* Hero Section */}
      <div className="relative mb-16 overflow-hidden rounded-[2rem] bg-moss p-8 md:p-16 flex flex-col justify-center min-h-[400px]">
        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wider text-white backdrop-blur">
            <span className="text-base">🚚</span> FREE SHIPPING FEE
          </div>
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-white md:text-6xl">
            Make healthy life with <span className="text-yellow-400">fresh</span> grocery
          </h1>
          <p className="mb-8 font-body text-lg text-white/90">
            Get the best quality and most delicious grocery food in the world, you can get them all use our website.
          </p>
          <Link to="/category/fruits" className="inline-block rounded-xl bg-ember px-8 py-3.5 font-display text-lg font-bold text-white transition hover:bg-ember/90 shadow-lg shadow-ember/30">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-bold text-ink">Top Categories</h2>
      </div>

      <CategoryFilter />

      {isLoading ? (
        <LoadingSpinner label="Loading products" />
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
