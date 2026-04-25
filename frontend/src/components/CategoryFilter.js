import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config";
import { api } from "../services/api";

const IconContainer = ({ children }) => (
  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
    {children}
  </div>
);

const categoryIcons = {
  fruits: (
    <IconContainer>
      <img src="/assets/fruits.png" alt="Fruits" className="h-16 w-16 object-contain" />
    </IconContainer>
  ),
  vegetables: (
    <IconContainer>
      <img src="/assets/vegetables.png" alt="Vegetables" className="h-16 w-16 object-contain" />
    </IconContainer>
  ),
  oils: (
    <IconContainer>
      <img src="/assets/oils.png" alt="Oils" className="h-16 w-16 object-contain" />
    </IconContainer>
  ),
  default: (
    <IconContainer>
      <img src="/assets/browse_all.png" alt="Default" className="h-16 w-16 object-contain" />
    </IconContainer>
  ),
};

const BrowseAllIcon = () => (
  <IconContainer>
    <img src="/assets/browse_all.png" alt="Browse All" className="h-16 w-16 object-contain" />
  </IconContainer>
);

export function CategoryFilter({ activeCategory, counts: initialCounts }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(initialCounts || {});

  useEffect(() => {
    if (!initialCounts) {
      const loadCounts = async () => {
        try {
          const data = await api.getProducts();
          if (data?.categoryCounts) {
            setCounts(data.categoryCounts);
          }
        } catch (error) {
          console.error("Failed to load category counts:", error);
        }
      };
      loadCounts();
    } else {
      setCounts(initialCounts);
    }
  }, [initialCounts]);

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-6">
      {/* Browse All */}
      <button
        onClick={() => navigate(`/shop`)}
        className={`group flex min-w-[190px] flex-col items-center justify-center rounded-xl border bg-white p-8 transition-all ${
          !activeCategory
            ? "border-[#2D5A34] shadow-xl ring-1 ring-[#2D5A34]/10"
            : "border-slate-100"
        }`}
      >
        <BrowseAllIcon />
        <span className="font-display text-lg font-bold text-ink">Browse All</span>
        <span className="mt-1 text-sm font-medium text-gray-400">({counts.all || 0} items)</span>
      </button>

      {CATEGORIES.map((category) => {
        const catLower = category.toLowerCase();
        const isActive = activeCategory?.toLowerCase() === catLower;
        const icon = categoryIcons[catLower] || categoryIcons.default;
        const count = counts[catLower] || 0;
        
        return (
          <button
            key={category}
            onClick={() => navigate(`/category/${catLower}`)}
            className={`group flex min-w-[190px] flex-col items-center justify-center rounded-xl border bg-white p-8 transition-all ${
              isActive
                ? "border-[#2D5A34] shadow-xl ring-1 ring-[#2D5A34]/10"
                : "border-slate-100"
            }`}
          >
            {icon}
            <span className="font-display text-lg font-bold capitalize text-ink">{category}</span>
            <span className="mt-1 text-sm font-medium text-gray-400">({count} items)</span>
          </button>
        );
      })}
    </div>
  );
}