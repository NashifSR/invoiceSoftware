"use client";

import AssetManager from "@/API/ui/AssetManager";
import React, { useMemo } from "react";

const SubscriptionHistory = () => {
  // Define columns to display in the read-only table
  const columns = useMemo(
    () => [
      { key: "planName", label: "Plan Tier" },
      { key: "billingCycle", label: "Billing Period" },
      { key: "amountPaid", label: "Amount Paid (BDT)" },
      { key: "startDate", label: "Start Date" },
      { key: "expiryDate", label: "Expiry Date" },
      { key: "status", label: "Status" },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Subscription History
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review your past software subscription cycles, active billing periods, and license expiry timelines.
        </p>
      </div>

      {/* Data Table Display */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="subscriptionHistory"
          title="Your Subscription History"
          tableColumns={columns}
        />
      </div>
    </div>
  );
};

export default SubscriptionHistory;