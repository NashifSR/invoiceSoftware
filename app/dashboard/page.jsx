"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileText,
  Package,
  Users,
  Clock,
  Shield,
  Mail,
  UserCheck,
  KeyRound,
  Loader2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";
import useAssets from "@/API/useAssets";
import usePayment from "@/API/usePayment";

/* ============================================================
DASHBOARD FILTERS
============================================================ */

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Clients", value: "client" },
  { label: "Employees", value: "employee" },
  { label: "Services", value: "service" },
  { label: "Packages", value: "package" },
  { label: "Orders", value: "order" },
  { label: "Invoices", value: "invoice" },
  { label: "Payments", value: "payment" },
];

/* ============================================================
MAIN DASHBOARD COMPONENT
============================================================ */

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch categorized assets via useAssets hook
  const { assets: clients = [], loading: loadingClients } = useAssets({ type: "client" });
  const { assets: employees = [], loading: loadingEmployees } = useAssets({ type: "employee" });
  const { assets: orders = [], loading: loadingOrders } = useAssets({ type: "order" });
  const { assets: payments = [], loading: loadingPayments } = useAssets({ type: "payment" });
  const { assets: invoices = [], loading: loadingInvoices } = useAssets({ type: "invoice" });
  const { assets: services = [], loading: loadingServices } = useAssets({ type: "service" });
  const { assets: packages = [], loading: loadingPackages } = useAssets({ type: "package" });
  const { assets: activities = [], loading: loadingActivities } = useAssets({ type: "activity_log" });

  // Payment Hook
  const { initPayment, loading: isPaymentProcessing } = usePayment();

  const isLoading =
    loadingClients ||
    loadingEmployees ||
    loadingOrders ||
    loadingPayments ||
    loadingInvoices ||
    loadingServices ||
    loadingPackages;

  // Safe accessor helper for assets (handles asset.data.* or asset.*)
  const getAssetField = (asset, key, fallback = 0) => {
    return asset?.data?.[key] ?? asset?.[key] ?? fallback;
  };

  // Compute Total Revenue from payments collection
  const totalRevenue = useMemo(() => {
    return payments.reduce((acc, curr) => {
      const amt = Number(getAssetField(curr, "amount", 0));
      return acc + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [payments]);

  // Compute Unpaid Invoices count
  const unpaidInvoicesCount = useMemo(() => {
    return invoices.filter(
      (inv) => String(getAssetField(inv, "status", "")).toLowerCase() === "unpaid"
    ).length;
  }, [invoices]);

  // Quick Purchase/Checkout Handler using usePayment
  const handleQuickCheckout = async (pkg) => {
    try {
      const itemData = pkg.data || pkg;
      const res = await initPayment({
        items: [
          {
            id: pkg.id || pkg._id,
            name: itemData.name || "Package Purchase",
            amount: itemData.amount || 0,
            currency: itemData.currency || "BDT",
          },
        ],
        customer: {
          email: user?.email,
          name: user?.displayName || "Customer",
        },
      });

      if (res?.url || res?.gatewayUrl) {
        window.location.href = res.url || res.gatewayUrl;
      }
    } catch (err) {
      console.error("Failed to initiate payment:", err);
    }
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* HEADER */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="px-6 py-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Hello, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Here is an overview of your workspace performance and active collections.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="overflow-x-auto px-6 lg:px-8">
          <div className="flex min-w-max gap-1 py-2.5">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="space-y-6 px-6 py-6 lg:px-8">
        {/* STAT CARDS OVERVIEW */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">Workspace Overview</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Live metrics retrieved via API asset store.
              </p>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                <span>Syncing assets...</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Clients"
              value={clients.length.toLocaleString()}
              icon={Users}
              href="/clients"
            />
            <StatCard
              title="Employees"
              value={employees.length.toLocaleString()}
              icon={BriefcaseBusiness}
              href="/employees"
            />
            <StatCard
              title="Orders"
              value={orders.length.toLocaleString()}
              icon={ClipboardList}
              href="/orders"
            />
            <StatCard
              title="Total Revenue"
              value={`৳${totalRevenue.toLocaleString()}`}
              icon={CreditCard}
              href="/payments"
            />
          </div>
        </section>

        {/* FEATURED PACKAGES / SERVICES */}
        {packages.length > 0 && (
          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">Available Packages</h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Select a tier to initiate checkout directly via Gateway.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => {
                const pkgData = pkg.data || pkg;
                return (
                  <div
                    key={pkg.id || pkg._id || pkgData.name}
                    className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/50 p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          {pkg.businessType || "Tier"}
                        </span>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                          {pkgData.currency || "BDT"} {pkgData.amount?.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-zinc-950">
                        {pkgData.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-600 line-clamp-2">
                        {pkgData.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isPaymentProcessing}
                      onClick={() => handleQuickCheckout(pkg)}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {isPaymentProcessing ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PlusCircle size={14} />
                      )}
                      <span>Subscribe / Checkout</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MAIN GRID: ACTIVITY & SUMMARY */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Recent Activity */}
          <section className="rounded-xl border border-zinc-200 bg-white xl:col-span-2">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Recent activity
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Real-time events fetched from workspace logs.
                </p>
              </div>
              <Link
                href="/activity"
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((act, i) => {
                  const actData = act.data || act;
                  return (
                    <ActivityItem
                      key={act.id || act._id || i}
                      title={actData.title || "System Event"}
                      description={actData.description || "Workspace update performed."}
                      time={actData.time || "Recently"}
                      type={actData.type || "neutral"}
                    />
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No activity logs recorded yet.
                </div>
              )}
            </div>
          </section>

          {/* Quick Summary */}
          <section className="rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-950">
                Operational Summary
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Live asset counters by category.
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              <SummaryItem
                label="Active Services"
                value={services.length.toLocaleString()}
                icon={Package}
              />
              <SummaryItem
                label="Packages Available"
                value={packages.length.toLocaleString()}
                icon={Package}
              />
              <SummaryItem
                label="Unpaid Invoices"
                value={unpaidInvoicesCount.toLocaleString()}
                icon={FileText}
              />
              <SummaryItem
                label="Active Clients"
                value={clients.length.toLocaleString()}
                icon={Users}
              />
              <SummaryItem
                label="Total Operations"
                value={(orders.length + payments.length).toLocaleString()}
                icon={Activity}
              />
            </div>
          </section>
        </div>

        {/* AUTHENTICATED USER SESSION */}
        <section className="rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-950">
              Session & Authorization
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Active identity details used for API resource scoping.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <UserInfo
              icon={UserCheck}
              label="Account Identity"
              value={displayName}
            />
            <UserInfo
              icon={Mail}
              label="Scoped Email"
              value={user?.email || "Not authenticated"}
            />
            <UserInfo
              icon={Shield}
              label="Provider Type"
              value={
                user?.providerData?.[0]?.providerId === "google.com"
                  ? "Google OAuth"
                  : user?.providerData?.[0]?.providerId || "Email / Password"
              }
            />
            <UserInfo
              icon={KeyRound}
              label="User UID"
              value={user?.uid || "N/A"}
              breakAll
            />
          </div>
        </section>
      </div>
    </main>
  );
};

/* ============================================================
REUSABLE SUB-COMPONENTS
============================================================ */

const StatCard = ({ title, value, icon: Icon, href = "#" }) => (
  <Link
    href={href}
    className="group block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-zinc-500">{title}</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">{value}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
        <Icon size={18} />
      </div>
    </div>
  </Link>
);

const ActivityItem = ({ title, description, time, type = "neutral" }) => {
  const badgeColors = {
    success: "bg-emerald-500",
    info: "bg-blue-500",
    neutral: "bg-zinc-400",
  };

  return (
    <div className="flex items-start gap-4 px-5 py-4 transition hover:bg-zinc-50/60">
      <div
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          badgeColors[type] || badgeColors.neutral
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-900">{title}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-xs text-zinc-400">
        <Clock size={12} />
        <span>{time}</span>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 px-5 py-4 transition hover:bg-zinc-50/60">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
      <Icon size={16} />
    </div>
    <p className="flex-1 text-sm font-medium text-zinc-700">{label}</p>
    <p className="text-sm font-semibold text-zinc-950">{value}</p>
  </div>
);

const UserInfo = ({ label, value, icon: Icon, breakAll = false }) => (
  <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="text-zinc-500" />}
      <p className="text-xs font-medium text-zinc-500">{label}</p>
    </div>
    <p
      className={`mt-2 text-sm font-semibold text-zinc-900 ${
        breakAll ? "break-all" : "truncate"
      }`}
    >
      {value}
    </p>
  </div>
);

export default DashboardPage;