"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";
import ProfileViewerCard from "./component/ProfileViewerCard";
import useAssets from "@/API/useAssets";

// Static configuration fields for Business Profile / ISP Nodes
const PROFILE_FORM_FIELDS = [
  {
    name: "companyName",
    label: "ISP Company / Branch Name",
    type: "text",
    required: true,
    placeholder: "e.g. Mirzapur Online Network",
  },
  {
    name: "ownerName",
    label: "Owner / Managing Director",
    type: "text",
    required: false,
    placeholder: "e.g. Md. Ashraf Uddin",
  },
  {
    name: "licenseType",
    label: "BTRC License Category",
    type: "select",
    required: true,
    options: [
      { label: "Nationwide ISP", value: "Nationwide ISP" },
      { label: "Zonal ISP", value: "Zonal ISP" },
      { label: "District ISP", value: "District ISP" },
      { label: "Local ISP (Category-C)", value: "Local ISP (Category-C)" },
    ],
  },
  {
    name: "tradeLicenseNo",
    label: "Municipal Trade License No.",
    type: "text",
    required: false,
    placeholder: "e.g. TRAD/CTG/2026/0491",
  },
  {
    name: "btrcLicenseNo",
    label: "BTRC License / Reg. No.",
    type: "text",
    required: false,
    placeholder: "e.g. BTRC/ISP/2025/1102",
  },
  {
    name: "tinBinNo",
    label: "Tax Identification (TIN / BIN)",
    type: "text",
    required: false,
    placeholder: "e.g. BIN-002948102-0101",
  },
  {
    name: "officialEmail",
    label: "Official Corporate Email",
    type: "text",
    required: true,
    placeholder: "info@mirzapuronline.net",
  },
  {
    name: "supportPhone",
    label: "Primary Support Hotline",
    type: "text",
    required: true,
    placeholder: "e.g. +880 1800-000000",
  },
  {
    name: "billingEmail",
    label: "Billing / Invoice Email",
    type: "text",
    required: false,
    placeholder: "billing@mirzapuronline.net",
  },
  {
    name: "preferredPaymentChannel",
    label: "Preferred Payment Gateway",
    type: "select",
    required: true,
    options: [
      { label: "bKash Merchant", value: "bKash" },
      { label: "Nagad Direct", value: "Nagad" },
      { label: "Bank Wire Transfer", value: "Bank Wire" },
      { label: "SSLCommerz Multi-Gateway", value: "SSLCommerz" },
    ],
  },
  {
    name: "headquartersAddress",
    label: "Office / Server Room Address",
    type: "text",
    required: false,
    placeholder: "e.g. Latifpur Bazar, Mirzapur, Tangail",
  },
];

const BusinessProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real assets of type 'isp_business_profile'
  const { assets: profiles, loading, deleteAsset, getAssets } = useAssets({
    type: "isp_business_profile",
  });

  // Check if a business profile already exists
  const activeProfile = profiles && profiles.length > 0 ? profiles[0] : null;
  const hasExistingProfile = Boolean(activeProfile);

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
    () => [
      { key: "companyName", label: "Company / Branch" },
      { key: "officialEmail", label: "Email" },
    ],
    []
  );

  const handleCreateSuccess = () => {
    setIsModalOpen(false);
    getAssets(); // Refresh list to instantly show the newly created profile
  };

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 2. Single Active Profile Card Viewer */}
      {loading ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500 text-sm animate-pulse">
          Loading business profile...
        </div>
      ) : activeProfile ? (
        <ProfileViewerCard
          profile={activeProfile}
          onDelete={(id) => deleteAsset(id)}
        />
      ) : (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-400 text-sm">
          No active business profile found. Click "Add Business Profile" above to configure your branch details.
        </div>
      )}

      {/* 3. Main List Container / Table View */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="isp_business_profile"
          title="Configured ISP Profiles & Branches"
          tableColumns={columns}
          TableComponent="alpha"
          ModalComponent="alpha"
        />
      </div>

      {/* 4. Modal Popup - Only allows creation if no profile exists */}
      {isModalOpen && !hasExistingProfile && (
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
                Create Business Profile / Branch
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
                description="Configure regulatory credentials, support channels, and payment gateways for this node."
                type="isp_business_profile"
                business="isp"
                fields={PROFILE_FORM_FIELDS}
                onSuccess={handleCreateSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;