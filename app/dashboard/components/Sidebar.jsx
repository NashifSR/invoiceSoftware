"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Briefcase,
  ChevronDown,
  FileBarChart,
  FileText,
  Gauge,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Map,
  MessageCircle,
  MessageSquare,
  Network,
  Router,
  Server,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sliders,
  User,
  UserCheck,
  Users,
  Wallet,
  Wifi,
  Cpu,
  Target,
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
        label: "Purchase History",
        href: "/dashboard/purchasesPage",
        icon: Wallet,
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
          { label: "Operational Zones", href: "/dashboard/config/zones" },
          { label: "Locations (Geo)", href: "/dashboard/config/locations" },
          { label: "Packages", href: "/dashboard/config/packages" },
          { label: "Client Types & Protocols", href: "/dashboard/config/client-types" },
          { label: "Billing Status", href: "/dashboard/config/billing-status" },
          { label: "System Preferences", href: "/dashboard/config/preferences" },
        ],
      },
      {
        label: "Clients",
        icon: Users,
        children: [
          { label: "Client List", href: "/dashboard/clients" },
          { label: "Add Client", href: "/dashboard/clients/add" },
          { label: "Signup Requests", href: "/dashboard/clients/signup-requests" },
          { label: "Left Clients", href: "/dashboard/clients/left" },
        ],
      },
      {
        label: "Accounts",
        icon: Wallet,
        children: [
          { label: "Billing List", href: "/dashboard/billing" },
          { label: "Collection", href: "/dashboard/billing/collection" },
          { label: "Billing History", href: "/dashboard/billing/history" },
          { label: "Expenses", href: "/dashboard/accounting/expenses" },
          { label: "Profit & Loss", href: "/dashboard/accounting/profit-loss" },
          { label: "Ledger", href: "/dashboard/accounting/ledger" },
        ],
      },
      {
        label: "Hotspot",
        icon: Wifi,
        children: [
          { label: "Dashboard", href: "/dashboard/hotspot" },
          { label: "Hotspot Users", href: "/dashboard/hotspot/users" },
          { label: "User Profiles", href: "/dashboard/hotspot/profiles" },
          { label: "Hotspot Servers", href: "/dashboard/hotspot/servers" },
          { label: "Active Sessions", href: "/dashboard/hotspot/active-sessions" },
          { label: "Vouchers", href: "/dashboard/hotspot/vouchers" },
          { label: "Vouchers Template", href: "/dashboard/hotspot/voucher-templates" },
          { label: "Reports", href: "/dashboard/hotspot/reports" },
        ],
      },
    ],
  },

  {
    label: "Infrastructure & Network",
    items: [
      {
        label: "Server & Distribution",
        icon: Server,
        children: [
          { label: "Dashboard", href: "/dashboard/network/server-distribution" },
          { label: "Servers", href: "/dashboard/network/servers" },
          { label: "Import From Mikrotik", href: "/dashboard/network/import" },
          { label: "PPPoE Popup", href: "/dashboard/network/pppoe-popup" },
          { label: "OLT Management", href: "/dashboard/network/olt" },
        ],
      },
      {
        label: "Network",
        icon: Network,
        children: [
          { label: "Network Map", href: "/dashboard/network/map" },
          { label: "Fiber Diagram", href: "/dashboard/network/fiber" },
        ],
      },
      {
        label: "NMS",
        icon: Activity,
        children: [
          { label: "Dashboard", href: "/dashboard/network/nms" },
          { label: "Institutions", href: "/dashboard/network/nms/institutions" },
          { label: "Routers", href: "/dashboard/network/nms/routers" },
          { label: "Vendors", href: "/dashboard/network/nms/vendors" },
          { label: "Monitoring", href: "/dashboard/network/nms/monitoring" },
          { label: "Map View", href: "/dashboard/network/nms/map" },
          { label: "Diagnostics", href: "/dashboard/network/nms/diagnostics" },
          { label: "Locations", href: "/dashboard/network/nms/divisions" },
        ],
      },
      {
        label: "Bandwidth",
        icon: Gauge,
        children: [
          { label: "Dashboard", href: "/dashboard/network/bandwidth" },
          { label: "Providers", href: "/dashboard/network/bandwidth/providers" },
          { label: "Purchases", href: "/dashboard/network/bandwidth/purchases" },
          { label: "Sales", href: "/dashboard/network/bandwidth/sales" },
          { label: "Monitoring", href: "/dashboard/network/bandwidth/monitoring" },
        ],
      },
      {
        label: "MAC Reseller",
        icon: UserCheck,
        children: [
          { label: "Mac Reseller List", href: "/dashboard/mac-reseller/list" },
          { label: "Packages", href: "/dashboard/mac-reseller/packages" },
          { label: "MAC Reseller Funding", href: "/dashboard/mac-reseller/funding" },
        ],
      },
      {
        label: "Hardware & ONUs",
        icon: Cpu,
        children: [
          { label: "ONU Serial Mapping", href: "/dashboard/hardware/onus" },
          { label: "Assigned Routers", href: "/dashboard/hardware/routers" },
        ],
      },
    ],
  },

  {
    label: "Operations & Management",
    items: [
      {
        label: "IT Service Management",
        icon: LifeBuoy,
        children: [
          { label: "Support Dashboard", href: "/dashboard/itsm" },
          { label: "Tickets", href: "/dashboard/itsm/tickets" },
          { label: "Technician Performance", href: "/dashboard/itsm/technician-performance" },
          { label: "Knowledge Base", href: "/dashboard/itsm/knowledge" },
        ],
      },
      {
        label: "HR & Payroll",
        icon: Briefcase,
        children: [
          { label: "Departments", href: "/dashboard/hr-payroll/departments" },
          { label: "Employees", href: "/dashboard/hr-payroll/employees" },
          { label: "Attendance", href: "/dashboard/hr-payroll/attendance" },
          { label: "Payroll", href: "/dashboard/hr-payroll/payroll" },
          { label: "Biometric Device", href: "/dashboard/hr-payroll/biometric-devices" },
        ],
      },
      {
        label: "Purchase",
        icon: ShoppingCart,
        children: [
          { label: "Dashboard", href: "/dashboard/purchase" },
          { label: "Products", href: "/dashboard/purchase/products" },
          { label: "Vendors", href: "/dashboard/purchase/vendors" },
          { label: "Purchase Orders", href: "/dashboard/purchase/purchase-orders" },
          { label: "Inventory", href: "/dashboard/purchase/inventory" },
          { label: "Requisitions", href: "/dashboard/purchase/requisitions" },
        ],
      },
      {
        label: "CRM & Leads",
        icon: Target,
        children: [
          { label: "Sales Leads", href: "/dashboard/crm/leads" },
          { label: "Follow-ups", href: "/dashboard/crm/followups" },
        ],
      },
    ],
  },

  {
    label: "Communications",
    items: [
      {
        label: "SMS Service",
        icon: MessageSquare,
        children: [
          { label: "Dashboard", href: "/dashboard/communications/sms" },
          { label: "Send SMS", href: "/dashboard/communications/sms/send" },
          { label: "Messages", href: "/dashboard/communications/sms/messages" },
          { label: "Gateways", href: "/dashboard/communications/sms/gateways" },
          { label: "Devices", href: "/dashboard/communications/sms/devices" },
          { label: "Templates", href: "/dashboard/communications/sms/templates" },
          { label: "Reports", href: "/dashboard/communications/sms/reports" },
        ],
      },
      {
        label: "WhatsApp",
        icon: MessageCircle,
        children: [
          { label: "Dashboard", href: "/dashboard/communications/whatsapp" },
          { label: "Devices", href: "/dashboard/communications/whatsapp/devices" },
          { label: "Send Message", href: "/dashboard/communications/whatsapp/send" },
          { label: "Templates", href: "/dashboard/communications/whatsapp/templates" },
          { label: "Messages", href: "/dashboard/communications/whatsapp/messages" },
          { label: "Chatbot", href: "/dashboard/communications/whatsapp/chatbot" },
          { label: "Schedules", href: "/dashboard/communications/whatsapp/schedules" },
          { label: "Contacts", href: "/dashboard/communications/whatsapp/contacts" },
        ],
      },
    ],
  },

  {
    label: "System & Reports",
    items: [
      {
        label: "Reports",
        href: "/dashboard/reports",
        icon: FileBarChart,
      },
      {
        label: "UPAC",
        href: "/dashboard/upac",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        icon: Sliders,
        children: [
          { label: "Dashboard", href: "/dashboard/settings" },
          { label: "App Users", href: "/dashboard/settings/app-users" },
          { label: "Invoice Setup", href: "/dashboard/settings/invoice-setup" },
          { label: "Periods Setup", href: "/dashboard/settings/periods-setup" },
          { label: "Payment Gateways", href: "/dashboard/settings/payment-gateways" },
          { label: "Customer Portal Settings", href: "/dashboard/settings/customer-portal" },
          { label: "API & Webhooks", href: "/dashboard/settings/api-integrations" },
          { label: "Audit Logs", href: "/dashboard/settings/audit-logs" },
        ],
      },
      {
        label: "Release Notes",
        href: "/dashboard/release-notes",
        icon: Bell,
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