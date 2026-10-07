"use client";

import React, { useState, useMemo } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

const ClientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fields = useMemo(
    () => [
      // --- Personal Information ---
      {
        name: "fullName",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "e.g. John Doe",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "john.doe@example.com",
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
        placeholder: "+8801700000000",
      },
      {
        name: "nationalId",
        label: "National ID / Passport",
        type: "text",
        required: false,
        placeholder: "19985412365478",
      },

      // --- Installation Address ---
      {
        name: "street",
        label: "Street Address",
        type: "text",
        required: true,
        placeholder: "House 12, Road 5, Block C",
      },
      {
        name: "area",
        label: "Area / Neighborhood",
        type: "text",
        required: true,
        placeholder: "Uttara",
      },
      {
        name: "district",
        label: "District / City",
        type: "text",
        required: true,
        placeholder: "Dhaka",
      },

      // --- Subscription & Package ---
      {
        name: "packageId",
        label: "Service Package",
        type: "select",
        required: true,
        options: [
          { label: "10 Mbps Unlimited (BDT 1,000)", value: "pkg_01" },
          { label: "20 Mbps Fiber (BDT 1,500)", value: "pkg_02" },
          { label: "50 Mbps Enterprise (BDT 3,000)", value: "pkg_03" },
        ],
      },
      {
        name: "connectionType",
        label: "Connection Type",
        type: "select",
        required: true,
        options: [
          { label: "PPPoE", value: "PPPoE" },
          { label: "Static IP", value: "Static IP" },
          { label: "Hotspot", value: "Hotspot" },
        ],
      },

      // --- Technical Provisioning ---
      {
        name: "username",
        label: "PPPoE Username",
        type: "text",
        required: false,
        placeholder: "johndoe_pppoe",
      },
      {
        name: "ipAddress",
        label: "Assigned IP Address",
        type: "text",
        required: false,
        placeholder: "192.168.10.55",
      },
      {
        name: "macAddress",
        label: "CPE MAC Address",
        type: "text",
        required: false,
        placeholder: "E8:48:B8:12:34:56",
      },
      {
        name: "zoneId",
        label: "Network Zone",
        type: "text",
        required: false,
        placeholder: "zone_north",
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Client Directory & Subscriptions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage individual subscriber profiles, network credentials, and active sessions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Register New Client
        </button>
      </div>

      {/* 2. Main Client List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="consumers"
          title="Active Subscribers"
        />
      </div>

      {/* 3. Modal Popup for Universal Client Registration */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Provision New ISP Client
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
                description="Set up an individual client record, network config, and package mapping."
                type="client"
                business="isp"
                fields={fields}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;