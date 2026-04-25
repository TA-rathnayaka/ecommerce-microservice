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
      <div className="relative mb-16 overflow-hidden rounded-[2.5rem] bg-[#2D5A34] p-8 md:p-16 flex flex-col md:flex-row items-center min-h-[500px]">
        {/* Background decorative elements or gradients could go here */}
        
        <div className="relative z-10 max-w-xl md:w-1/2">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-bold tracking-wide text-white backdrop-blur-md border border-white/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ember/20">
              <span className="text-xl">🚚</span>
            </div>
            FREE SHIPPING FEE
          </div>
          
          <h1 className="mb-6 font-display text-5xl font-bold leading-[1.1] text-white md:text-7xl">
            Make healthy life with <br />
            <span className="text-[#D4E157]">fresh</span> grocery
          </h1>
          
          <p className="mb-10 max-w-md font-body text-lg text-white/80 leading-relaxed">
            Get the best quality and most delicious grocery food in the world, you can get them all use our website.
          </p>
          
          <Link 
            to="/category/fruits" 
            className="inline-block rounded-2xl bg-[#FF6B35] px-12 py-4 font-display text-xl font-bold text-white transition-all hover:scale-105 hover:no-underline active:scale-95"
          >
            Shop Now
          </Link>
        </div>

        {/* Right side: Image and floating cards */}
        <div className="relative mt-12 md:mt-0 md:w-1/2 flex justify-center items-center h-full min-h-[400px]">
          {/* Delivery Man Image */}
          <div className="relative z-0 h-[450px] w-[450px] overflow-hidden rounded-full border-8 border-white/5 bg-white/5">
             <img 
              src="/delivery_man_banner.png" 
              alt="Delivery Man" 
              className="h-full w-full object-cover scale-110 translate-y-4"
            />
          </div>

          {/* Floating Card 1: Fast Delivery */}
          <div className="absolute bottom-10 -left-10 z-20 flex items-center gap-4 rounded-3xl bg-white/95 p-4 pr-8 shadow-2xl backdrop-blur animate-floatIn">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss/10 text-moss">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-ink">Fast Delivery</p>
              <p className="text-sm text-ink/50">Free of cost any delivery</p>
            </div>
          </div>

          {/* Floating Card 2: 100% Fresh */}
          <div className="absolute top-20 -right-4 z-20 flex flex-col items-center gap-2 rounded-[2rem] bg-white/95 p-6 shadow-2xl backdrop-blur text-center animate-floatIn" style={{ animationDelay: '150ms' }}>
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-clay">
              <span className="text-2xl">🥗</span>
            </div>
            <div>
              <p className="font-display font-bold text-ink flex items-center gap-1 justify-center">
                100% Fresh <span className="text-moss">✓</span>
              </p>
              <p className="text-xs font-medium text-ink/40">Quality maintain</p>
            </div>
          </div>
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
