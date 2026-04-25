import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "../config";

const categoryIcons = {
  fruits: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-moss">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  electronics: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-moss">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
  default: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-moss">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  ),
};

const BrowseAllIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-moss">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export function CategoryFilter({ activeCategory }) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-6">
      <button
        onClick={() => navigate(`/`)}
        className={`flex h-40 w-40 flex-col items-center justify-center rounded-2xl border bg-white p-6 transition-all hover:shadow-lg ${
          !activeCategory
            ? "border-moss shadow-md ring-1 ring-moss"
            : "border-ink/10 shadow-sm"
        }`}
      >
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-moss/10">
          <BrowseAllIcon />
        </div>
        <span className="font-display text-lg font-bold capitalize text-ink">Browse All</span>
      </button>

      {CATEGORIES.map((category) => {
        const catLower = category.toLowerCase();
        const isActive = activeCategory?.toLowerCase() === catLower;
        const icon = categoryIcons[catLower] || categoryIcons.default;
        
        return (
          <button
            key={category}
            onClick={() => navigate(`/category/${catLower}`)}
            className={`flex h-40 w-40 flex-col items-center justify-center rounded-2xl border bg-white p-6 transition-all hover:shadow-lg ${
              isActive
                ? "border-moss shadow-md ring-1 ring-moss"
                : "border-ink/10 shadow-sm"
            }`}
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-moss/10">
              {icon}
            </div>
            <span className="font-display text-lg font-bold capitalize text-ink">{category}</span>
          </button>
        );
      })}
    </div>
  );
}