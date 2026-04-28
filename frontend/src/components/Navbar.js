import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { useWishlist } from "../context/WishlistContext";

const ActiveUnderline = () => (
  <div className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#FF6B35]" />
);

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const wishlistCount = wishlistItems?.length || 0;

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-1 text-base font-medium transition-all hover:text-ink ${
      isActive ? "text-ink font-bold" : "text-gray-400"
    }`;

  return (
    <header className="w-full bg-white">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <div className="flex h-11 w-11 items-center justify-center">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 44C24 44 40 36 40 24C40 12 24 4 24 4C24 4 8 12 8 24C8 36 24 44 24 44Z" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 44V24" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 24C24 24 32 20 36 12" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 24C24 24 16 20 12 12" stroke="#2D5A34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 32C18 36 22 38 24 38C26 38 30 36 32 32" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display text-3xl font-black tracking-tighter text-[#FF6B35]">
            FRESH
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-10 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            {({ isActive }) => (
              <span className="flex flex-col items-center">
                Home
                {isActive && <ActiveUnderline />}
              </span>
            )}
          </NavLink>
          <NavLink to="/category/fruits" className={navLinkClass}>
            {({ isActive }) => (
              <span className="flex flex-col items-center">
                Catalog
                {isActive && <ActiveUnderline />}
              </span>
            )}
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            {({ isActive }) => (
              <span className="flex flex-col items-center">
                Shop
                {isActive && <ActiveUnderline />}
              </span>
            )}
          </NavLink>
          
          {location.pathname === "/" && (
            <a 
              href="/#contact" 
              className="relative py-1 text-base font-medium transition-all hover:text-ink text-gray-400 hover:no-underline"
            >
              Contact
            </a>
          )}
        </div>

        {/* Right Side: Search, Cart, Auth */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search Bar */}
          <div className="relative hidden lg:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className="h-10 w-48 rounded-full border border-gray-100 bg-gray-50 pl-10 pr-4 text-sm focus:border-[#FF6B35] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
            />
          </div>

          {/* Wishlist Icon */}
          <NavLink 
            to="/wishlist" 
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-moss transition-all hover:border-moss/30 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-moss text-[10px] font-bold text-white ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          {/* Cart Icon */}
          <NavLink 
            to="/cart" 
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#FFB703] text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {itemCount}
              </span>
            )}
          </NavLink>

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="rounded-xl bg-[#2D5A34] px-6 py-2.5 font-bold text-white transition-all hover:bg-[#234729] active:scale-95"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-[#2D5A34] px-7 py-2.5 font-bold text-white transition-all hover:bg-[#234729] hover:no-underline active:scale-95"
            >
              Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
