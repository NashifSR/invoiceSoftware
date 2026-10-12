"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for Billing Collections
const COLLECTION_FORM_FIELDS = [
  {
    name: "receiptNo",
    label: "Receipt / Money Receipt No",
    type: "text",
    required: true,
    placeholder: "e.g. MR-2026-8801",
  },
  {
    name: "clientName",
    label: "Subscriber Account / ID",
    type: "text",
    required: true,
    placeholder: "e.g. CLI-9021 or client_nashif",
  },
  {
    name: "collectedAmount",
    label: "Collected Amount (BDT)",
    type: "text",
    required: true,
    placeholder: "e.g. 1200",
  },
  {
    name: "collectorName",
    label: "Collector / Field Agent",
    type: "text",
    required: true,
    placeholder: "e.g. Collector Rafiq or Online Gateway",
  },
  {
    name: "paymentChannel",
    label: "Payment Channel / Medium",
    type: "select",
    required: true,
    options: [
      { label: "Hand Cash Collection", value: "cash" },
      { label: "bKash Merchant / Personal", value: "bkash" },
      { label: "Nagad Mobile Banking", value: "nagad" },
      { label: "Bank Deposit / POS", value: "bank" },
    ],
  },
  {
    name: "collectionDate",
    label: "Collection Date",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-10-12",
  },
  {
    name: "depositStatus",
    label: "Accounts Deposit Status",
    type: "select",
    required: true,
    options: [
      { label: "Verified & Deposited", value: "verified" },
      { label: "Pending Agent Handover", value: "pending_handover" },
      { label: "Discrepancy / Review Required", value: "flagged" },
    ],
  },
];

const Collection = () => {
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
    () => COLLECTION_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Payment Collections & Money Receipts
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Log daily cash collections, field agent handovers, mobile financial service payments, and treasury deposits.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Record Collection Entry
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="collections"
          title="Daily Collection Logs"
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
                Log New Collection
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
                description="Record money received from a subscriber via cash collector or electronic gateway."
                type="collections"
                business="isp"
                fields={COLLECTION_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;