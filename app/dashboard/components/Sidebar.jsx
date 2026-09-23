"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";

/* ============================================================
   UNIVERSAL SIDEBAR NAVIGATION

   These pages are shared across projects:
   ISP / School / Shop / Other Business Systems
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
      {
        label: "Create Package",
        href: "/dashboard/createpackage",
        icon: LayoutDashboard,
      },
      {
        label: "Manage Subscription",
        href: "/dashboard/managesubscription",
        icon: Settings,
      },
      {
        label: "Check Out",
        href: "/dashboard/checkoutpage",
        icon: FileText,
      },
      {
        label: "Payment History",
        href: "/dashboard/payments",
        icon: Wallet,
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

  const initial =
    displayName.charAt(0).toUpperCase();

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
            U
          </div>

          <span className="text-lg font-bold tracking-tight text-zinc-950">
            Universal
          </span>
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

          {/* Avatar */}

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

          {/* User information */}

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