"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for Billing History Archives
const BILLING_HISTORY_FORM_FIELDS = [
  {
    name: "transactionId",
    label: "Txn ID / Money Receipt",
    type: "text",
    required: true,
    placeholder: "e.g. TXN-2026-88401",
  },
  {
    name: "clientUsername",
    label: "Client / Subscriber Account",
    type: "text",
    required: true,
    placeholder: "e.g. client_nashif",
  },
  {
    name: "invoiceNo",
    label: "Cleared Invoice Ref",
    type: "text",
    required: true,
    placeholder: "e.g. INV-2026-09-0112",
  },
  {
    name: "paidAmount",
    label: "Amount Settled (BDT)",
    type: "text",
    required: true,
    placeholder: "e.g. 1200",
  },
  {
    name: "paymentMethod",
    label: "Payment Gateway / Channel",
    type: "select",
    required: true,
    options: [
      { label: "bKash Auto-Pay Gateway", value: "bkash" },
      { label: "Nagad Online Direct", value: "nagad" },
      { label: "Cash via Collector", value: "cash" },
      { label: "Bank Transfer / Card POS", value: "bank" },
    ],
  },
  {
    name: "settlementDate",
    label: "Payment Date & Time",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-10-05",
  },
  {
    name: "settlementStatus",
    label: "Ledger Settlement Status",
    type: "select",
    required: true,
    options: [
      { label: "Cleared & Ledger Posted", value: "cleared" },
      { label: "Reconciled / Audit Verified", value: "reconciled" },
      { label: "Refunded / Adjusted", value: "refunded" },
    ],
  },
];

const History = () => {
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
    () => BILLING_HISTORY_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Billing History & Transaction Archive
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse cleared payment transactions, historic invoice settlements, gateway logs, and ledger audit trails.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Log Historical Transaction
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="billingHistory"
          title="Archive Ledger & Historical Transactions"
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
                Log Historical Settlement
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
                description="Manually archive an offline or historic transaction record into the general ledger."
                type="billingHistory"
                business="isp"
                fields={BILLING_HISTORY_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;