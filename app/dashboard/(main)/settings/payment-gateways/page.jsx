"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for ISP Payment Gateways
const PAYMENT_GATEWAYS_FORM_FIELDS = [
  {
    name: "gatewayName",
    label: "Gateway / Merchant Name",
    type: "text",
    required: true,
    placeholder: "e.g. bKash Merchant API or SSLCommerz",
  },
  {
    name: "provider",
    label: "Payment Provider",
    type: "select",
    required: true,
    options: [
      { label: "bKash Direct (PGW)", value: "bkash" },
      { label: "Nagad Merchant API", value: "nagad" },
      { label: "Rocket (DBBL)", value: "rocket" },
      { label: "SSLCommerz Aggregator", value: "sslcommerz" },
      { label: "Shurjopay", value: "shurjopay" },
      { label: "Manual Bank / Cash Channel", value: "manual" },
    ],
  },
  {
    name: "merchantId",
    label: "Store / Merchant ID",
    type: "text",
    required: true,
    placeholder: "e.g. MS1008249 or isp_bkash_checkout",
  },
  {
    name: "apiKey",
    label: "API / Secret Key",
    type: "text",
    required: true,
    placeholder: "e.g. bk_sec_key_99812xxx",
  },
  {
    name: "environment",
    label: "Integration Mode",
    type: "select",
    required: true,
    options: [
      { label: "Production (Live)", value: "production" },
      { label: "Sandbox / Testing", value: "sandbox" },
    ],
  },
  {
    name: "transactionFeePercent",
    label: "Gateway Convenience Fee (%)",
    type: "text",
    required: false,
    placeholder: "e.g. 1.5 or 0",
  },
  {
    name: "status",
    label: "Gateway Status",
    type: "select",
    required: true,
    options: [
      { label: "Active (Enabled at Checkout)", value: "active" },
      { label: "Disabled / Inactive", value: "disabled" },
      { label: "Maintenance Mode", value: "maintenance" },
    ],
  },
];

const PaymentGateways = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Derive table columns automatically from static fields
  const columns = useMemo(
    () => PAYMENT_GATEWAYS_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Payment Gateways & Merchant Channels
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure online checkout payment channels (bKash, Nagad, Cards) for subscriber self-service bill payments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Configure Gateway Channel
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="paymentGateways"
          title="Configured Payment Gateways"
          tableColumns={columns}
        />
      </div>

      {/* 3. Modal Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                Register / Edit Payment Gateway API
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <UniversalDataCollectionTemplate
                title=""
                description="Add merchant API keys, store credentials, and fee structures for subscriber bill payment."
                type="paymentGateways"
                business="isp"
                fields={PAYMENT_GATEWAYS_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateways;