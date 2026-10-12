"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for System Audit Logs
const AUDIT_LOGS_FORM_FIELDS = [
  {
    name: "logId",
    label: "Audit Event ID",
    type: "text",
    required: true,
    placeholder: "e.g. AUD-2026-10-9901",
  },
  {
    name: "actorEmail",
    label: "User / Operator Email",
    type: "text",
    required: true,
    placeholder: "e.g. admin@isp.com or noc_tanvir@isp.com",
  },
  {
    name: "actionCategory",
    label: "Action Category",
    type: "select",
    required: true,
    options: [
      { label: "User Authentication / Login", value: "auth" },
      { label: "Subscriber Status Change (Lock/Unlock)", value: "client_status" },
      { label: "Billing & Ledger Manual Override", value: "billing_override" },
      { label: "Router & Network Config Change", value: "network_config" },
      { label: "System Preferences Update", value: "system_pref" },
      { label: "Payment Gateway Credentials Modified", value: "gateway_edit" },
    ],
  },
  {
    name: "actionDetails",
    label: "Action Description",
    type: "text",
    required: true,
    placeholder: "e.g. Manually un-suspended subscriber CLI-9021 without payment receipt",
  },
  {
    name: "ipAddress",
    label: "IP Address",
    type: "text",
    required: true,
    placeholder: "e.g. 103.112.44.12",
  },
  {
    name: "timestamp",
    label: "Timestamp",
    type: "text",
    required: true,
    placeholder: "e.g. 2026-10-12 14:30:11",
  },
  {
    name: "severity",
    label: "Severity / Risk Level",
    type: "select",
    required: true,
    options: [
      { label: "Info (Normal Operation)", value: "info" },
      { label: "Warning (Sensitive Action)", value: "warning" },
      { label: "Critical (Security/Config Alert)", value: "critical" },
    ],
  },
];

const AuditLogs = () => {
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
    () => AUDIT_LOGS_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Audit Logs & System Security Trails
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor administrative activities, staff override logs, system preferences changes, and IP security events.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Log Manual Audit Event
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="auditLogs"
          title="Security Event & Action Audit Directory"
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
                Register Manual Audit Log
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
                description="Manually record an administrative override or system audit event for security tracking."
                type="auditLogs"
                business="isp"
                fields={AUDIT_LOGS_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;