import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryFilter } from "../components/CategoryFilter";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";

export function CategoryPage() {
  const { type } = useParams();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadByCategory() {
      try {
        setIsLoading(true);
        const data = await api.getProductsByCategory(type);
        if (mounted) {
          setProducts(Array.isArray(data) ? data : data?.products || []);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch category products");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadByCategory();
    return () => {
      mounted = false;
    };
  }, [type, toast]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <h1 className="mb-5 font-display text-3xl font-bold capitalize text-ink md:text-4xl">Category: {type}</h1>
      <CategoryFilter activeCategory={type} />

      {isLoading ? (
        <LoadingSpinner label="Loading category" />
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
