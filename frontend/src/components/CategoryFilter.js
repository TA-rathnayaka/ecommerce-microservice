import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config";

export function CategoryFilter({ activeCategory }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory?.toLowerCase() === category.toLowerCase();
        return (
          <button
            key={category}
            onClick={() => navigate(`/category/${category.toLowerCase()}`)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
              isActive
                ? "bg-ink text-clay"
                : "border border-ink/20 bg-white/70 text-ink hover:bg-clay"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}