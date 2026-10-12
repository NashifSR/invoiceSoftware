"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration fields for Client Signup Requests
const SIGNUP_REQUESTS_FORM_FIELDS = [
  {
    name: "requestId",
    label: "Request ID / Tracking Code",
    type: "text",
    required: true,
    placeholder: "e.g. REQ-2026-9901",
  },
  {
    name: "fullName",
    label: "Applicant Full Name",
    type: "text",
    required: true,
    placeholder: "e.g. Sarah Chowdhury",
  },
  {
    name: "phoneNumber",
    label: "Contact Phone Number",
    type: "text",
    required: true,
    placeholder: "e.g. 01800000000",
  },
  {
    name: "requestedPackage",
    label: "Requested ISP Package",
    type: "select",
    required: true,
    options: [
      { label: "15 Mbps Home Basic (৳800)", value: "home_15mbps" },
      { label: "30 Mbps Family Speed (৳1200)", value: "family_30mbps" },
      { label: "50 Mbps Gamer Pro (৳1800)", value: "gamer_50mbps" },
      { label: "100 Mbps Corporate Dedicated (৳5000)", value: "corp_100mbps" },
    ],
  },
  {
    name: "installationAddress",
    label: "Installation Address / Zone",
    type: "text",
    required: true,
    placeholder: "e.g. House 12, Road 4, Uttara Sector 7",
  },
  {
    name: "status",
    label: "Request Status",
    type: "select",
    required: true,
    options: [
      { label: "Pending Verification", value: "pending" },
      { label: "Survey Scheduled", value: "survey_scheduled" },
      { label: "Approved & Ready for Installation", value: "approved" },
      { label: "Rejected / Unserviceable", value: "rejected" },
    ],
  },
];

const SignupRequests = () => {
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
    () => SIGNUP_REQUESTS_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Client Signup Requests
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review online registration leads, schedule feasibility surveys, and approve subscriber onboarding.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Manual Signup Lead
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="signupRequests"
          title="Pending & Processed Signup Applications"
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
                Register Signup Lead
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
                description="Manually record a new customer connection request and requested package tier."
                type="signupRequests"
                business="isp"
                fields={SIGNUP_REQUESTS_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupRequests;