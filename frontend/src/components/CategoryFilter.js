import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config";

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
  electronics: (
    <IconContainer>
      <img src="/assets/electronics.png" alt="Electronics" className="h-16 w-16 object-contain" />
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

export function CategoryFilter({ activeCategory }) {
  const navigate = useNavigate();

  return (
    <div className="mb-12 flex flex-wrap justify-center gap-8">
      <button
        onClick={() => navigate(`/`)}
        className={`group flex min-w-[180px] flex-col items-center justify-center rounded-3xl border bg-white p-8 ${
          !activeCategory
            ? "border-moss ring-2 ring-moss/20"
            : "border-gray-100"
        }`}
      >
        <BrowseAllIcon />
        <span className="font-display text-lg font-bold text-ink">Browse All</span>
      </button>

      {CATEGORIES.map((category) => {
        const catLower = category.toLowerCase();
        const isActive = activeCategory?.toLowerCase() === catLower;
        const icon = categoryIcons[catLower] || categoryIcons.default;
        
        return (
          <button
            key={category}
            onClick={() => navigate(`/category/${catLower}`)}
            className={`group flex min-w-[180px] flex-col items-center justify-center rounded-3xl border bg-white p-8 ${
              isActive
                ? "border-moss ring-2 ring-moss/20"
                : "border-gray-100"
            }`}
          >
            {icon}
            <span className="font-display text-lg font-bold capitalize text-ink">{category}</span>
          </button>
        );
      })}
    </div>
  );
}