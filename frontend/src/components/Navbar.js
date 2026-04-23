import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-ink text-clay" : "text-ink/80 hover:bg-clay/70"
  }`;

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-clay/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink">
          BazaarFlow
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/category/fruits" className={navLinkClass}>
            Categories
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/cart" className="relative rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-white/70">
            Cart
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ember px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </NavLink>
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-clay hover:bg-ink/90"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-clay hover:bg-ink/90"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
