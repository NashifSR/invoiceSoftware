"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for Hotspot Voucher generation and tracking
const VOUCHER_FORM_FIELDS = [
  {
    name: "voucherCode",
    label: "Voucher Code / PIN",
    type: "text",
    required: true,
    placeholder: "e.g. HOT-8849-21",
  },
  {
    name: "batchName",
    label: "Batch / Campaign Name",
    type: "text",
    required: true,
    placeholder: "e.g. Uttara Park Summer Promo 2026",
  },
  {
    name: "planDuration",
    label: "Duration / Access Plan",
    type: "select",
    required: true,
    options: [
      { label: "1 Hour Fast Pass (৳20)", value: "1h_20bdt" },
      { label: "24 Hour Day Pass (৳100)", value: "24h_100bdt" },
      { label: "5 GB Data Cap (৳50)", value: "5gb_50bdt" },
      { label: "7 Day Unlimited (৳400)", value: "7d_400bdt" },
    ],
  },
  {
    name: "price",
    label: "Price (BDT)",
    type: "text",
    required: true,
    placeholder: "e.g. 20",
  },
  {
    name: "status",
    label: "Voucher Status",
    type: "select",
    required: true,
    options: [
      { label: "Unused (Available)", value: "unused" },
      { label: "Active (Redeemed)", value: "active" },
      { label: "Expired", value: "expired" },
      { label: "Disabled", value: "disabled" },
    ],
  },
];

const Vouchers = () => {
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

  // Derive table columns automatically from the static configuration fields
  const columns = useMemo(
    () => VOUCHER_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Hotspot Vouchers & Scratch Cards
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and manage prepaid voucher PIN codes, pricing tiers, batch campaigns, and redemption logs.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Generate New Voucher
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="vouchers"
          title="Generated Hotspot Vouchers"
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
                Create Hotspot Voucher
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
                description="Generate a prepaid hotspot access voucher with specific time or data restrictions."
                type="vouchers"
                business="isp"
                fields={VOUCHER_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vouchers;