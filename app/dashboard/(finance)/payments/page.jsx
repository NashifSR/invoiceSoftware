"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payment history from backend on load
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("https://myunifiedserver.onrender.com/api/payment");
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Calculate dynamic stats from history
  const totalPayments = payments.length;
  const completedCount = payments.filter((p) => p.status === "SUCCESS").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const failedCount = payments.filter((p) => p.status === "FAILED").length;

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Payments History
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track incoming payments and transaction activity.
            </p>
          </div>
        </div>


        {/* ==================================================
            STATS
        ================================================== */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={CreditCard}
            label="Total payments"
            value={totalPayments}
          />

          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={completedCount}
          />

          <StatCard
            icon={Clock3}
            label="Pending"
            value={pendingCount}
          />

          <StatCard
            icon={XCircle}
            label="Failed"
            value={failedCount}
          />
        </div>


        {/* ==================================================
            PAYMENT LIST
        ================================================== */}

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 border-b border-zinc-200 p-4">
            <div className="relative max-w-sm flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                placeholder="Search payments..."
                className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>


          {/* ==================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Payment ID / Tran
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Client
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Method
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-zinc-500">
                      Loading payment history...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-20 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
                          <CreditCard size={22} />
                        </div>

                        <h2 className="mt-4 text-sm font-semibold text-zinc-900">
                          No payments yet
                        </h2>

                        <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-500">
                          Transactions processed through SSLCommerz will appear here automatically.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id || payment.tran_id} className="border-b border-zinc-100 text-sm hover:bg-zinc-50/50">
                      <td className="px-5 py-4 font-medium text-zinc-900">
                        {payment.tran_id}
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        {payment.customerEmail || "N/A"}
                      </td>
                      <td className="px-5 py-4 text-zinc-900 font-semibold">
                        BDT {payment.amount}
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        SSLCommerz
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payment.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-500">
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </main>
  );
};


/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">
          {label}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
          <Icon size={16} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-zinc-950">
        {value}
      </p>
    </div>
  );
};

export default Payments;