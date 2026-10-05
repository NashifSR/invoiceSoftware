"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Map,
  Network,
  Router,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import useAuth from "@/Auth/hooks/useAuth";

/* ============================================================
   ISP ADMIN PORTAL NAVIGATION
============================================================ */

const sidebarSections = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    label: "Core ISP",
    items: [
      {
        label: "Configuration",
        icon: Settings,
        children: [
          {
            label: "Zones",
            href: "/config/zones",
          },
          {
            label: "Packages",
            href: "/config/packages",
          },
          {
            label: "Client Types",
            href: "/config/client-types",
          },
          {
            label: "Connection Types",
            href: "/config/connection-types",
          },
          {
            label: "Billing Status",
            href: "/config/billing-status",
          },
        ],
      },

      {
        label: "Clients",
        icon: Users,
        children: [
          {
            label: "Client List",
            href: "/clients",
          },
          {
            label: "Add Client",
            href: "/clients/add",
          },
          {
            label: "Signup Requests",
            href: "/clients/signup-requests",
          },
          {
            label: "Left Clients",
            href: "/clients/left",
          },
        ],
      },

      {
        label: "Accounts",
        icon: Wallet,
        children: [
          {
            label: "Billing",
            href: "/billing",
          },
          {
            label: "Collection",
            href: "/billing/collection",
          },
          {
            label: "Billing History",
            href: "/billing/history",
          },
          {
            label: "Expenses",
            href: "/accounting/expenses",
          },
          {
            label: "Profit & Loss",
            href: "/accounting/profit-loss",
          },
          {
            label: "Ledger",
            href: "/accounting/ledger",
          },
        ],
      },

      {
        label: "Reports",
        href: "/reports",
        icon: FileBarChart,
      },
    ],
  },

  {
    label: "Network",
    items: [
      {
        label: "Servers",
        href: "/network/servers",
        icon: Network,
      },
      {
        label: "Routers",
        href: "/network/routers",
        icon: Router,
      },
      {
        label: "Monitoring",
        href: "/network/monitoring",
        icon: Network,
      },
      {
        label: "Network Map",
        href: "/network/map",
        icon: Map,
      },
    ],
  },
];

/* ============================================================
   SIDEBAR
============================================================ */

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();

  const [openMenus, setOpenMenus] = useState({});

  /* ==========================================================
     AUTO OPEN ACTIVE MENU
  ========================================================== */

  useEffect(() => {
    const activeMenus = {};

    sidebarSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) =>
              pathname === child.href ||
              pathname.startsWith(`${child.href}/`)
          );

          if (hasActiveChild) {
            activeMenus[item.label] = true;
          }
        }
      });
    });

    setOpenMenus((current) => ({
      ...current,
      ...activeMenus,
    }));
  }, [pathname]);

  /* ==========================================================
     TOGGLE MENU
  ========================================================== */

  const toggleMenu = (label) => {
    setOpenMenus((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* ==========================================================
     USER
  ========================================================== */

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white">

      {/* ====================================================
          BRAND
      ==================================================== */}

      <div className="flex h-16 shrink-0 items-center border-b border-zinc-100 px-5">

        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
            I
          </div>

          <div>
            <p className="text-lg font-bold leading-none tracking-tight text-zinc-950">
              ISP Admin
            </p>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              Management Portal
            </p>
          </div>
        </Link>

      </div>

      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-5">

        {sidebarSections.map((section) => (
          <div
            key={section.label}
            className="mb-6 last:mb-0"
          >

            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {section.label}
            </p>

            <div className="space-y-1">

              {section.items.map((item) => {
                const Icon = item.icon;

                /* ==============================================
                   MENU WITH SUBMENU
                ============================================== */

                if (item.children) {
                  const isOpen =
                    openMenus[item.label] || false;

                  const hasActiveChild =
                    item.children.some(
                      (child) =>
                        pathname === child.href ||
                        pathname.startsWith(
                          `${child.href}/`
                        )
                    );

                  return (
                    <div key={item.label}>

                      <button
                        type="button"
                        onClick={() =>
                          toggleMenu(item.label)
                        }
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          hasActiveChild
                            ? "bg-zinc-100 text-zinc-950"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                        }`}
                      >

                        <Icon size={17} />

                        <span className="flex-1 text-left">
                          {item.label}
                        </span>

                        <ChevronDown
                          size={15}
                          className={`transition-transform ${
                            isOpen
                              ? "rotate-180"
                              : ""
                          }`}
                        />

                      </button>

                      {/* Submenu */}

                      {isOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-zinc-200 pl-3">

                          {item.children.map(
                            (child) => {
                              const isActive =
                                pathname ===
                                  child.href ||
                                pathname.startsWith(
                                  `${child.href}/`
                                );

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`block rounded-md px-3 py-2 text-sm transition ${
                                    isActive
                                      ? "bg-zinc-950 font-medium text-white"
                                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              );
                            }
                          )}

                        </div>
                      )}

                    </div>
                  );
                }

                /* ==============================================
                   NORMAL LINK
                ============================================== */

                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    }`}
                  >

                    <Icon size={17} />

                    <span>
                      {item.label}
                    </span>

                  </Link>
                );
              })}

            </div>

          </div>
        ))}

      </nav>

      {/* ====================================================
          USER
      ==================================================== */}

      <div className="shrink-0 border-t border-zinc-100 p-3">

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 rounded-lg p-2.5 transition hover:bg-zinc-100"
        >

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={displayName}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {initial}
            </div>
          )}

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-zinc-900">
              {displayName}
            </p>

            <p className="truncate text-xs text-zinc-500">
              {user?.email}
            </p>

          </div>

          <User
            size={16}
            className="shrink-0 text-zinc-400"
          />

        </Link>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={17} />

          Sign out
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;