"use client";

import React, { useState, useMemo } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

const Zones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fields = useMemo(
    () => [
      {
        name: "zoneId",
        label: "Zone ID",
        type: "text",
        required: true,
        placeholder: "e.g. zone_north",
      },
      {
        name: "zoneName",
        label: "Zone Name",
        type: "text",
        required: true,
        placeholder: "e.g. Uttara Network Zone",
      },
      {
        name: "serverRouterId",
        label: "Primary Server / Router ID",
        type: "text",
        required: true,
        placeholder: "e.g. srv_01",
      },
      {
        name: "coverageArea",
        label: "Coverage Area Description",
        type: "text",
        required: false,
        placeholder: "e.g. Sector 1-13, Airport Road",
      },
      {
        name: "status",
        label: "Zone Operational Status",
        type: "select",
        required: true,
        options: [
          { label: "Active", value: "active" },
          { label: "Maintenance", value: "maintenance" },
          { label: "Inactive", value: "inactive" },
        ],
      },
    ],
    []
  );

  // Derive columns automatically from fields
  const columns = useMemo(
    () => fields.map((field) => ({ key: field.name, label: field.label })),
    [fields]
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Network Zones & POPs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage physical network zones, server router assignments, and coverage areas.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Zone
        </button>
      </div>

      {/* 2. Main Zone List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="zone"
          title="Configured Network Zones"
          tableColumns={columns}
        />
      </div>

      {/* 3. Modal Popup for Universal Zone Registration */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Register Network Zone
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
                description="Set up a physical zone record, server routing mapping, and coverage details."
                type="zone"
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

export default Zones;