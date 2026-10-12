"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration for routers and OLT equipment
const ROUTER_OLT_FORM_FIELDS = [
  {
    name: "deviceId",
    label: "Device ID",
    type: "text",
    required: true,
    placeholder: "e.g. olt_uttara_01",
  },
  {
    name: "deviceName",
    label: "Device Name",
    type: "text",
    required: true,
    placeholder: "e.g. Uttara Huawei OLT MA5600T",
  },
  {
    name: "deviceType",
    label: "Device Category",
    type: "select",
    required: true,
    options: [
      { label: "OLT (GPON Fiber Headend)", value: "olt" },
      { label: "MikroTik Core Router", value: "mikrotik_core" },
      { label: "Cisco Edge Router", value: "cisco_edge" },
      { label: "Distribution Switch", value: "switch" },
    ],
  },
  {
    name: "ipAddress",
    label: "Management IP Address",
    type: "text",
    required: true,
    placeholder: "e.g. 192.168.100.1",
  },
  {
    name: "status",
    label: "Operational Status",
    type: "select",
    required: true,
    options: [
      { label: "Online (Operational)", value: "online" },
      { label: "Maintenance", value: "maintenance" },
      { label: "Offline / Unreachable", value: "offline" },
    ],
  },
];

const RoutersAndOlt = () => {
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
    () => ROUTER_OLT_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Routers & OLT Equipment
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage fiber headends, core routing hardware, management IPs, and device availability.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Device
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="routerOlt"
          title="Configured Routers & OLTs"
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
                Register Router / OLT Equipment
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
                description="Configure a new core router or GPON OLT hardware unit and assign its network parameters."
                type="routerOlt"
                business="isp"
                fields={ROUTER_OLT_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutersAndOlt;