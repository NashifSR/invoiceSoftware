"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for Feature Requests & Bug Reporting
const REQUEST_FORM_FIELDS = [
  {
    name: "title",
    label: "Title / Short Summary",
    type: "text",
    required: true,
    placeholder: "e.g. Add export to Excel button in Billing History",
  },
  {
    name: "type",
    label: "Request Type",
    type: "select",
    required: true,
    options: [
      { label: "💡 Feature Request", value: "Feature Request" },
      { label: "🐛 Bug Report", value: "Bug Report" },
      { label: "🚨 Urgent Issue", value: "Urgent Issue" },
    ],
  },
  {
    name: "module",
    label: "Target Module",
    type: "select",
    required: true,
    options: [
      { label: "General Platform", value: "General" },
      { label: "Clients Directory", value: "Clients Directory" },
      { label: "Accounts & Billing", value: "Accounts & Billing" },
      { label: "Network & Hardware (Mikrotik/OLT)", value: "Network & Hardware" },
      { label: "Hotspot & Vouchers", value: "Hotspot & Vouchers" },
      { label: "SMS & WhatsApp Gateway", value: "Communications" },
      { label: "Operations & HR", value: "Operations & HR" },
    ],
  },
  {
    name: "priority",
    label: "Operational Priority",
    type: "select",
    required: true,
    options: [
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High / Urgent", value: "High" },
    ],
  },
  {
    name: "description",
    label: "Detailed Explanation & Steps",
    type: "textarea",
    required: true,
    placeholder: "Describe the feature requirement or step-by-step instructions to reproduce the bug...",
  },
  {
    name: "status",
    label: "Request Status",
    type: "select",
    required: true,
    options: [
      { label: "Submitted (Pending Review)", value: "Submitted" },
      { label: "Under Review", value: "Under Review" },
      { label: "In Progress", value: "In Progress" },
      { label: "Resolved / Deployed", value: "Resolved" },
    ],
  },
  {
    name: "developerNotes",
    label: "Developer Progress Notes",
    type: "text",
    required: false,
    placeholder: "Notes or updates from the SaaS developer...",
  },
];

const FeatureRequests = () => {
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
    () => REQUEST_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Feature Requests & Bug Reporting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Submit custom feature requests or report software bugs directly to the platform developer and track progress in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            ● Direct Developer Queue
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit New Request
          </button>
        </div>
      </div>

      {/* 2. Main List Container (CRUD Table Managed by AssetManager) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="requests"
          title="Tracked Feature Requests & Bug Reports"
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
                Submit Request or Bug Report
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
                description="Fill in details for the platform developer queue."
                type="requests"
                business="isp"
                fields={REQUEST_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureRequests;