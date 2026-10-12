"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for SMS Service Gateway
const SMS_FORM_FIELDS = [
  {
    name: "campaignName",
    label: "Campaign / SMS Title",
    type: "text",
    required: true,
    placeholder: "e.g. Due Bill Reminder - Oct 2026",
  },
  {
    name: "recipientPhone",
    label: "Recipient Phone Number / Group",
    type: "text",
    required: true,
    placeholder: "e.g. 01700000000 or All Unpaid Clients",
  },
  {
    name: "smsType",
    label: "SMS Gateway Type",
    type: "select",
    required: true,
    options: [
      { label: "Masking SMS (Brand Name)", value: "masking" },
      { label: "Non-Masking SMS", value: "non_masking" },
      { label: "OTP / System Instant Alert", value: "otp" },
    ],
  },
  {
    name: "smsCategory",
    label: "Message Category",
    type: "select",
    required: true,
    options: [
      { label: "Billing / Payment Due Notification", value: "billing_reminder" },
      { label: "Payment Received Confirmation", value: "payment_confirmation" },
      { label: "Account Lock / Expiry Notice", value: "account_lock" },
      { label: "Emergency Fiber Cut / Downtime Alert", value: "downtime_alert" },
      { label: "Promotional Broadcast", value: "promotional" },
    ],
  },
  {
    name: "messageContent",
    label: "SMS Text Body",
    type: "text",
    required: true,
    placeholder: "e.g. Dear Customer, your internet bill of BDT 1200 is due on 10-Oct. Please pay to avoid line lock.",
  },
  {
    name: "deliveryStatus",
    label: "Delivery Status",
    type: "select",
    required: true,
    options: [
      { label: "Delivered", value: "delivered" },
      { label: "Pending in Gateway Queue", value: "pending" },
      { label: "Failed / Invalid Number", value: "failed" },
    ],
  },
];

const SMS = () => {
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
    () => SMS_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            SMS Gateway & Bulk Messaging
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dispatch billing reminders, expiry notices, fiber cut downtime alerts, and masking SMS broadcasts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Send Bulk / Instant SMS
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="sms"
          title="SMS Outbox & Gateway Logs"
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
                Dispatch SMS Message
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
                description="Trigger an instant SMS notification or schedule a bulk campaign to subscribers."
                type="sms"
                business="isp"
                fields={SMS_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMS;