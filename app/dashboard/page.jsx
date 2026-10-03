"use client";

import { useState } from "react";
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
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";

/* ============================================================
DASHBOARD FILTERS
============================================================ */

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Clients", value: "clients" },
  { label: "Employees", value: "employees" },
  { label: "Services", value: "services" },
  { label: "Orders", value: "orders" },
  { label: "Invoices", value: "invoices" },
  { label: "Payments", value: "payments" },
];

/* ============================================================
DASHBOARD
============================================================ */

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <main className="min-h-screen bg-zinc-100">
      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="px-6 py-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
            Hello, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Here is an overview of your workspace performance and current activity.
          </p>
        </div>
      </div>

      {/* ==================================================
          FILTERS
      ================================================== */}
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

      {/* ==================================================
          CONTENT
      ================================================== */}
      <div className="space-y-6 px-6 py-6 lg:px-8">
        {/* ==================================================
            STAT CARDS OVERVIEW
        ================================================== */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">Overview</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Key metrics and active assets for your workspace.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Clients"
              value="1,248"
              change="+12.5%"
              icon={Users}
              href="/clients"
            />
            <StatCard
              title="Employees"
              value="42"
              change="+2"
              icon={BriefcaseBusiness}
              href="/employees"
            />
            <StatCard
              title="Orders"
              value="386"
              change="+8.1%"
              icon={ClipboardList}
              href="/orders"
            />
            <StatCard
              title="Payments"
              value="৳84,200"
              change="+15.4%"
              icon={CreditCard}
              href="/payments"
            />
          </div>
        </section>

        {/* ==================================================
            MAIN GRID (ACTIVITY & QUICK SUMMARY)
        ================================================== */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Recent Activity */}
          <section className="rounded-xl border border-zinc-200 bg-white xl:col-span-2">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-950">
                  Recent activity
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Real-time logs of system events and workspace changes.
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
              <ActivityItem
                title="New client added"
                description="Acme Corporation registered a new enterprise client profile."
                time="2 minutes ago"
                type="success"
              />
              <ActivityItem
                title="Order #3081 updated"
                description="Status changed from Processing to Dispatched."
                time="18 minutes ago"
                type="info"
              />
              <ActivityItem
                title="Payment received"
                description="Received ৳12,500 invoice payment via Bank Transfer."
                time="42 minutes ago"
                type="success"
              />
              <ActivityItem
                title="Employee account created"
                description="Invited Sarah Jenkins (Product Designer) to workspace."
                time="1 hour ago"
                type="neutral"
              />
            </div>
          </section>

          {/* Quick Summary */}
          <section className="rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-950">
                Quick summary
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Live operational totals across categories.
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              <SummaryItem
                label="Active Services"
                value="24"
                icon={Package}
              />
              <SummaryItem
                label="Unpaid Invoices"
                value="128"
                icon={FileText}
              />
              <SummaryItem
                label="Active Clients"
                value="1,104"
                icon={Users}
              />
              <SummaryItem
                label="System Operations"
                value="8,429"
                icon={Activity}
              />
            </div>
          </section>
        </div>

        {/* ==================================================
            CURRENT USER SESSION
        ================================================== */}
        <section className="rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-950">
              Current Session
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Authenticated user details provided by Firebase Auth.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <UserInfo
              icon={UserCheck}
              label="Display Name"
              value={user?.displayName || "Not set"}
            />
            <UserInfo
              icon={Mail}
              label="Email Address"
              value={user?.email || "Not available"}
            />
            <UserInfo
              icon={Shield}
              label="Auth Provider"
              value={
                user?.providerData?.[0]?.providerId === "google.com"
                  ? "Google OAuth"
                  : user?.providerData?.[0]?.providerId || "Password / Email"
              }
            />
            <UserInfo
              icon={KeyRound}
              label="User ID (UID)"
              value={user?.uid || "Not available"}
              breakAll
            />
          </div>
        </section>
      </div>
    </main>
  );
};

/* ============================================================
STAT CARD
============================================================ */

const StatCard = ({ title, value, change, icon: Icon, href = "#" }) => {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
            {value}
          </p>

          {change && (
            <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              {change} from last month
            </span>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
          <Icon size={18} />
        </div>
      </div>
    </Link>
  );
};

/* ============================================================
ACTIVITY ITEM
============================================================ */

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

/* ============================================================
SUMMARY ITEM
============================================================ */

const SummaryItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-3 px-5 py-4 transition hover:bg-zinc-50/60">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
        <Icon size={16} />
      </div>

      <p className="flex-1 text-sm font-medium text-zinc-700">{label}</p>

      <p className="text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
};

/* ============================================================
USER INFO
============================================================ */

const UserInfo = ({ label, value, icon: Icon, breakAll = false }) => {
  return (
    <div className="rounded-lg bg-zinc-50/80 p-4 border border-zinc-100">
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
};

export default DashboardPage;