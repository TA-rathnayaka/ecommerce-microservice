import { useEffect, useState } from "react";
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
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-aqua/15 via-clay to-ember/10 p-6 md:p-8">
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">Fresh picks, bold deals.</h1>
        <p className="mt-2 max-w-2xl font-body text-base text-ink/80">
          Discover curated products and shop by category with fast checkout.
        </p>
      </div>

      <CategoryFilter />

      {isLoading ? (
        <LoadingSpinner label="Loading products" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
