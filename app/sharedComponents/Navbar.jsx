"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home as HomeIcon,
  Package,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  User,
  ShoppingCart,
  LogIn,
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";
import CartDrawer from "./CartDrawer";

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Items", href: "/items", icon: Package },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Sync cart from localStorage safely
  useEffect(() => {
    const syncCart = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(Array.isArray(stored) ? stored : []);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setCartItems([]);
      }
    };

    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const hasCartItems = cartItems.length > 0;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
              U
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-950">
              Universal
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              <ShoppingCart size={17} />
              <span className="hidden sm:inline">Cart</span>
              {hasCartItems && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {/* Auth Dropdown or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-zinc-100"
                >
                  <div className="hidden text-left sm:block">
                    <p className="max-w-32 truncate text-sm font-semibold text-zinc-900">
                      {displayName}
                    </p>
                    <p className="max-w-32 truncate text-xs text-zinc-500">
                      {user.email}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`hidden text-zinc-400 transition sm:block ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
                      <div className="border-b border-zinc-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {user.email}
                        </p>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 p-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <LogIn size={16} />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </>
  );
}