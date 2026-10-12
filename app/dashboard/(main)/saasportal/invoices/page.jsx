"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for SaaS Invoices & Platform Billing
const INVOICE_FORM_FIELDS = [
  {
    name: "id",
    label: "Invoice Reference ID",
    type: "text",
    required: true,
    placeholder: "e.g. SAAS-INV-2026-10",
  },
  {
    name: "planName",
    label: "Platform Tier Plan",
    type: "select",
    required: true,
    options: [
      { label: "Starter ISP Plan (3,500 BDT)", value: "Starter ISP Plan" },
      { label: "Pro Provider Plan (7,500 BDT)", value: "Pro Provider Plan" },
      { label: "Enterprise ISP Plan (15,000 BDT)", value: "Enterprise ISP Plan" },
    ],
  },
  {
    name: "billingPeriod",
    label: "Billing Period / Month",
    type: "text",
    required: true,
    placeholder: "e.g. October 2026",
  },
  {
    name: "totalAmount",
    label: "Total Payable Amount (BDT)",
    type: "text",
    required: true,
    placeholder: "e.g. 7,500 BDT",
  },
  {
    name: "issueDate",
    label: "Issue Date",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-10-01",
  },
  {
    name: "dueDate",
    label: "Due Date",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-10-15",
  },
  {
    name: "paymentMethod",
    label: "Payment Channel / Bank",
    type: "text",
    required: false,
    placeholder: "e.g. bKash Merchant / Nagad / DBBL",
  },
  {
    name: "trxId",
    label: "Transaction ID / Ref Number",
    type: "text",
    required: false,
    placeholder: "e.g. 9N84A72B1X or Pending",
  },
  {
    name: "status",
    label: "Payment Status",
    type: "select",
    required: true,
    options: [
      { label: "Unpaid / Due", value: "Unpaid" },
      { label: "Paid / Cleared", value: "Paid" },
      { label: "Pending Verification", value: "Pending" },
    ],
  },
];

const Invoices = () => {
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
    () => INVOICE_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            SaaS Invoices & Payment History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View past monthly software bills, check payment statuses, and generate official platform receipts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            ● Billing Account: ISP-TENANT-8840
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Generate New Invoice Record
          </button>
        </div>
      </div>

      {/* 2. Main List Container (CRUD Table Managed by AssetManager) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="invoices"
          title="SaaS Platform Invoices & Billing Records"
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
                Register SaaS Invoice / Payment Record
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
                description="Issue or record a SaaS subscription fee invoice for tenant billing."
                type="invoices"
                business="isp"
                fields={INVOICE_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;