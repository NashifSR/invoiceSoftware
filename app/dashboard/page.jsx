"use client";

import {
Activity,
ArrowUpRight,
BriefcaseBusiness,
ClipboardList,
CreditCard,
FileText,
Package,
Users,
} from "lucide-react";

import useAuth from "@/Auth/hooks/useAuth";

/* ============================================================
DASHBOARD FILTERS
============================================================ */

const filters = [
{
label: "All",
value: "all",
},
{
label: "Clients",
value: "clients",
},
{
label: "Employees",
value: "employees",
},
{
label: "Services",
value: "services",
},
{
label: "Orders",
value: "orders",
},
{
label: "Invoices",
value: "invoices",
},
{
label: "Payments",
value: "payments",
},
];

/* ============================================================
DASHBOARD
============================================================ */

const DashboardPage = () => {
const { user } = useAuth();

const displayName =
user?.displayName ||
user?.email?.split("@")[0] ||
"User";

return ( <main className="min-h-screen bg-zinc-100">

```
  {/* ==================================================
      HEADER
  ================================================== */}

  <div className="border-b border-zinc-200 bg-white">

    <div className="px-6 py-6 lg:px-8">

      <p className="text-sm font-medium text-zinc-500">
        Welcome back
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
        Hello, {displayName}
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        Here's an overview of your workspace.
      </p>

    </div>

  </div>


  {/* ==================================================
      FILTERS
  ================================================== */}

  <div className="border-b border-zinc-200 bg-white">

    <div className="overflow-x-auto px-6 lg:px-8">

      <div className="flex min-w-max gap-1 py-3">

        {filters.map((filter, index) => (

          <button
            key={filter.value}
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              index === 0
                ? "bg-zinc-950 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            }`}
          >
            {filter.label}
          </button>

        ))}

      </div>

    </div>

  </div>


  {/* ==================================================
      CONTENT
  ================================================== */}

  <div className="space-y-6 px-6 py-6 lg:px-8">


    {/* ==================================================
        ASSET SUMMARY
    ================================================== */}

    <section>

      <div className="mb-4">

        <h2 className="text-sm font-semibold text-zinc-950">
          Overview
        </h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          Summary of your current data.
        </p>

      </div>


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Clients"
          value="1,248"
          icon={Users}
        />

        <StatCard
          title="Employees"
          value="42"
          icon={BriefcaseBusiness}
        />


        <StatCard
          title="Orders"
          value="386"
          icon={ClipboardList}
        />

        <StatCard
          title="Payments"
          value="৳84,200"
          icon={CreditCard}
        />

      </div>

    </section>


    {/* ==================================================
        MAIN GRID
    ================================================== */}

    <div className="grid gap-6 xl:grid-cols-3">


      {/* ==================================================
          RECENT ACTIVITY
      ================================================== */}

      <section className="rounded-xl border border-zinc-200 bg-white xl:col-span-2">

        <div className="border-b border-zinc-100 px-5 py-4">

          <h2 className="text-sm font-semibold text-zinc-950">
            Recent activity
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Recent changes and events.
          </p>

        </div>


        <div className="divide-y divide-zinc-100">

          <ActivityItem
            title="New client added"
            description="A new client was added to the system."
            time="2 minutes ago"
          />

          <ActivityItem
            title="Order updated"
            description="An order was updated."
            time="18 minutes ago"
          />

          <ActivityItem
            title="Payment received"
            description="A payment was recorded."
            time="42 minutes ago"
          />

          <ActivityItem
            title="Employee added"
            description="A new employee account was created."
            time="1 hour ago"
          />

        </div>

      </section>


      {/* ==================================================
          QUICK SUMMARY
      ================================================== */}

      <section className="rounded-xl border border-zinc-200 bg-white">

        <div className="border-b border-zinc-100 px-5 py-4">

          <h2 className="text-sm font-semibold text-zinc-950">
            Quick summary
          </h2>

          <p className="mt-0.5 text-xs text-zinc-500">
            Current system totals.
          </p>

        </div>


        <div className="divide-y divide-zinc-100">


          <SummaryItem
            label="Services"
            value="24"
            icon={Package}
          />


          <SummaryItem
            label="Invoices"
            value="128"
            icon={FileText}
          />


          <SummaryItem
            label="Active clients"
            value="1,104"
            icon={Users}
          />


          <SummaryItem
            label="Activity"
            value="8,429"
            icon={Activity}
          />

        </div>

      </section>

    </div>


    {/* ==================================================
        CURRENT USER
    ================================================== */}

    <section className="rounded-xl border border-zinc-200 bg-white">

      <div className="border-b border-zinc-100 px-5 py-4">

        <h2 className="text-sm font-semibold text-zinc-950">
          Current user
        </h2>

        <p className="mt-0.5 text-xs text-zinc-500">
          Information from your authentication system.
        </p>

      </div>


      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">

        <UserInfo
          label="Name"
          value={user?.displayName || "Not available"}
        />

        <UserInfo
          label="Email"
          value={user?.email || "Not available"}
        />

        <UserInfo
          label="Provider"
          value={
            user?.providerData?.[0]?.providerId ||
            "Unknown"
          }
        />

        <UserInfo
          label="UID"
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

const StatCard = ({
title,
value,
icon: Icon,
}) => {

return ( <div className="rounded-xl border border-zinc-200 bg-white p-5">

  <div className="flex items-start justify-between">

    <div>

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
        {value}
      </p>

    </div>


    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">

      <Icon size={18} />

    </div>

  </div>

</div>

);
};

/* ============================================================
ACTIVITY ITEM
============================================================ */

const ActivityItem = ({
title,
description,
time,
}) => {

return ( <div className="flex items-center gap-4 px-5 py-4">

  <div className="h-2 w-2 shrink-0 rounded-full bg-zinc-900" />

  <div className="min-w-0 flex-1">

    <p className="text-sm font-medium text-zinc-900">
      {title}
    </p>

    <p className="mt-0.5 truncate text-xs text-zinc-500">
      {description}
    </p>

  </div>

  <span className="shrink-0 text-xs text-zinc-400">
    {time}
  </span>

</div>

);
};

/* ============================================================
SUMMARY ITEM
============================================================ */

const SummaryItem = ({
label,
value,
icon: Icon,
}) => {

return ( <div className="flex items-center gap-3 px-5 py-4">

```
  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">

    <Icon size={16} />

  </div>


  <p className="flex-1 text-sm font-medium text-zinc-700">
    {label}
  </p>


  <p className="text-sm font-semibold text-zinc-950">
    {value}
  </p>

</div>

);
};

/* ============================================================
USER INFO
============================================================ */

const UserInfo = ({
label,
value,
breakAll = false,
}) => {

return ( <div className="rounded-lg bg-zinc-50 p-4">

  <p className="text-xs font-medium text-zinc-500">
    {label}
  </p>

  <p
    className={`mt-1 text-sm font-medium text-zinc-900 ${
      breakAll
        ? "break-all"
        : "truncate"
    }`}
  >
    {value}
  </p>

</div>

);
};

export default DashboardPage;
