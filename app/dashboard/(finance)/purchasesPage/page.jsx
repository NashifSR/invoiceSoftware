"use client";

import { useContext, useEffect, useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/Auth/context/AuthContext";

export default function PurchasesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(
          "https://myunifiedserver.onrender.com/api/payment/my-purchases",
          { params: { email: user.email } }
        );
        setPurchases(Array.isArray(data?.purchases) ? data.purchases : []);
      } catch (err) {
        console.error("GET PURCHASES ERROR:", err);
        setError(err.response?.data?.error || "Failed to load your purchases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-zinc-500">Loading purchases...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-4 flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-zinc-950">Purchase History</h1>
        <p className="mt-0.5 text-xs text-zinc-500">
          View your completed purchases and payment details.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && purchases.length === 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <ShoppingBag size={32} className="mx-auto text-zinc-300" />
          <h2 className="mt-3 text-sm font-semibold text-zinc-900">
            No purchases yet
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Your completed purchases will appear here.
          </p>
        </div>
      )}

      {/* Compact Purchases Table */}
      {!error && purchases.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/75 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-right text-right font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {purchases.map((purchase) => (
                  <tr
                    key={purchase.tran_id}
                    className="transition-colors hover:bg-zinc-50/50"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] font-medium text-zinc-900">
                      {purchase.tran_id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        {purchase.items?.map((item, idx) => (
                          <span
                            key={`${item.itemId}-${idx}`}
                            className="font-medium text-zinc-800"
                          >
                            {item.name}{" "}
                            <span className="font-normal text-zinc-400">
                              (×{item.quantity})
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-zinc-500">
                      {purchase.purchasedAt
                        ? new Date(purchase.purchasedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-zinc-900">
                      {purchase.amount} {purchase.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}