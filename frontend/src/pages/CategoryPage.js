import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryFilter } from "../components/CategoryFilter";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductCard } from "../components/ProductCard";
import { api } from "../services/api";

export function CategoryPage() {
  const { type } = useParams();
  const normalizedType = type?.toLowerCase();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setProducts([]);
    setIsLoading(true);

    async function loadByCategory() {
      try {
        const data = normalizedType 
          ? await api.getProductsByCategory(normalizedType)
          : await api.getProducts();
        
        if (mounted) {
          setProducts(Array.isArray(data) ? data : data?.products || []);
        }
      } catch (error) {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadByCategory();
    return () => { mounted = false; };
  }, [normalizedType]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
      <h1 className="mb-5 font-display text-3xl font-bold capitalize text-ink md:text-4xl">
        {normalizedType ? `Category: ${normalizedType}` : "All Products"}
      </h1>
      <CategoryFilter activeCategory={normalizedType} />

      {isLoading ? (
        <LoadingSpinner label="Loading category" />
      ) : products.length === 0 ? (
        <p className="mt-10 text-center font-body text-ink/60">No items for this category.</p>
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