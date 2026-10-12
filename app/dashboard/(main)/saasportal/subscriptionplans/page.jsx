"use client";

import React, { useMemo } from "react";
import AssetManager from "@/API/ui/AssetManager";

const SubscriptionPlans = () => {
  // Define columns to display your SaaS packages catalog
  const columns = useMemo(
    () => [
      { key: "name", label: "Plan Name" },
      { key: "price", label: "Monthly Price (BDT)" },
      { key: "clientLimit", label: "Subscriber Limit" },
      { key: "description", label: "Features & Description" },
      { key: "status", label: "Availability" },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Subscription Plans Catalog
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore available software tiers, subscriber scaling limits, and developer pricing plans.
        </p>
      </div>

      {/* Data Table Display */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="package"
          title="Available Platform Tiers"
          tableColumns={columns}
        />
      </div>
    </div>
  );
};

export default SubscriptionPlans;