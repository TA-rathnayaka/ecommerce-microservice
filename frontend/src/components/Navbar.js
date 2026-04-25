import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navLinkClass = ({ isActive }) =>
  `relative text-sm font-bold transition ${
    isActive ? "text-ink" : "text-ink/60 hover:text-ink"
  } after:absolute after:-bottom-2 after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:bg-ember after:transition-all ${
    isActive ? "after:w-4" : "after:w-0"
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
    <header className="bg-white py-4">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-black tracking-wider text-ember">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember/10 text-xl">
            🌱
          </span>
          BAZAARFLOW
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/category/fruits" className={navLinkClass}>
            Catalog
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="/wishlist" className={navLinkClass}>
                Wishlist
              </NavLink>
              <NavLink to="/create-product" className={navLinkClass}>
                + Add Product
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <NavLink to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-white transition hover:bg-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </NavLink>
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="rounded-lg bg-moss px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-moss/30 transition hover:bg-moss/90"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-moss px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-moss/30 transition hover:bg-moss/90"
            >
              Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
