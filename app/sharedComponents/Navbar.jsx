"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  ShoppingCart,
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";
import CartDrawer from "./CartDrawer";

/* ============================================================
   NAVIGATION MENU
============================================================ */

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Items",
    href: "/items",
    icon: LayoutDashboard,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

/* ============================================================
   NAVBAR
============================================================ */

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [hasCartItems, setHasCartItems] = useState(false);

  useEffect(() => {
    const checkCart = () => {
      try {
        const storedCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        setHasCartItems(
          Array.isArray(storedCart) &&
          storedCart.length > 0
        );
      } catch (error) {
        console.error(
          "Failed to check cart:",
          error
        );

        setHasCartItems(false);
      }
    };

    checkCart();

    window.addEventListener(
      "cartUpdated",
      checkCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        checkCart
      );
    };
  }, []);

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

        setCartItems(
          Array.isArray(storedCart)
            ? storedCart
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setCartItems([]);
      }
    };

    loadCart();

    window.addEventListener(
      "cartUpdated",
      loadCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCart
      );
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
              U
            </div>

            <span className="text-lg font-bold tracking-tight text-zinc-950">
              Universal
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={<Icon size={16} />}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Right Side Actions: Cart & Auth */}
          <div className="flex items-center gap-3">

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              <ShoppingCart size={17} />

              <span className="hidden sm:inline">
                Cart
              </span>

              {hasCartItems && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {/* ====================================================
                AUTHENTICATED USER
            ==================================================== */}

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-zinc-100"
                >
                  {/* User Name */}
                  <div className="hidden text-left sm:block">
                    <p className="max-w-32 truncate text-sm font-semibold text-zinc-900">
                      {displayName}
                    </p>

                    <p className="max-w-32 truncate text-xs text-zinc-500">
                      {user?.email}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`hidden text-zinc-400 transition sm:block ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {open && (
                  <>
                    {/* Click-away */}
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpen(false)}
                    />

                    <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">

                      {/* User Info */}
                      <div className="border-b border-zinc-100 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-zinc-900">
                          {displayName}
                        </p>

                        <p className="truncate text-xs text-zinc-500">
                          {user?.email}
                        </p>
                      </div>

                      {/* User Links */}
                      <div className="p-1.5">
                        <DropdownLink
                          href="/profile"
                          icon={<User size={16} />}
                          onClick={() => setOpen(false)}
                        >
                          Profile
                        </DropdownLink>
                      </div>

                      {/* Logout */}
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
              /* ==================================================
                  LOGGED OUT
              ================================================== */

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

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </>
  );
};

/* ============================================================
   NAV LINK
============================================================ */

const NavLink = ({ href, icon, children }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
    >
      {icon}
      {children}
    </Link>
  );
};

/* ============================================================
   DROPDOWN LINK
============================================================ */

const DropdownLink = ({ href, icon, children, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
    >
      {icon}
      {children}
    </Link>
  );
};

export default Navbar;