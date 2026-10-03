"use client";

import { useContext, useEffect, useState } from "react";
import { CheckCircle, ShoppingBag, ArrowLeft } from "lucide-react";
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

  // Handle Loading State
  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <p className="text-sm text-zinc-500">Loading purchases...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      {/* Header Section */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-5 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-zinc-950">Purchase History</h1>
        <p className="mt-1 text-sm text-zinc-500">
          View your completed purchases and payment details.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && purchases.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <ShoppingBag size={40} className="mx-auto text-zinc-300" />
          <h2 className="mt-4 font-semibold text-zinc-900">No purchases yet</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Your completed purchases will appear here.
          </p>
        </div>
      )}

      {/* Purchase List */}
      <div className="space-y-5">
        {purchases.map((purchase) => (
          <PurchaseCard key={purchase.tran_id} purchase={purchase} />
        ))}
      </div>
    </main>
  );
}

// Sub-component for individual purchase cards
function PurchaseCard({ purchase }) {
  const formattedDate = purchase.purchasedAt
    ? new Date(purchase.purchasedAt).toLocaleString()
    : "";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <span className="font-semibold text-zinc-900">Purchase Completed</span>
          </div>
          <p className="mt-2 font-mono text-xs text-zinc-400">{purchase.tran_id}</p>
          {formattedDate && <p className="mt-1 text-xs text-zinc-500">{formattedDate}</p>}
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-xl font-bold text-zinc-950">
            {purchase.amount} {purchase.currency}
          </p>
        </div>
      </div>

      {/* Line Items */}
      {purchase.items?.length > 0 && (
        <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5">
          {purchase.items.map((item, index) => (
            <div
              key={`${item.itemId}-${index}`}
              className="flex items-center justify-between rounded-xl bg-zinc-50 p-4"
            >
              <div>
                <p className="font-medium text-zinc-900">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-500">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-zinc-900">
                {item.total} {purchase.currency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}