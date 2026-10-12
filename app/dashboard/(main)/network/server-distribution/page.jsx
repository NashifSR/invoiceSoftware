"use client";

import React, { useState, useMemo, useEffect } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";
import AssetManager from "@/API/ui/AssetManager";

// Static configuration with renamed field to avoid DOM property collisions
const SERVER_DISTRIBUTION_FORM_FIELDS = [
  {
    name: "nodeId",
    label: "Node / Server ID",
    type: "text",
    required: true,
    placeholder: "e.g. srv_core_uttara",
  },
  {
    name: "serverName", // Renamed from nodeName to avoid DOM collision
    label: "Server / Node Name",
    type: "text",
    required: true,
    placeholder: "e.g. Uttara MikroTik CCR1036",
  },
  {
    name: "nodeRole",
    label: "Infrastructure Role",
    type: "select",
    required: true,
    options: [
      { label: "Core Gateway Router", value: "core_router" },
      { label: "Distribution Switch / POP", value: "distribution_switch" },
      { label: "OLT (GPON / Fiber Headend)", value: "olt" },
      { label: "RADIUS / Billing Auth Server", value: "radius_server" },
    ],
  },
  {
    name: "ipAddress",
    label: "Management IP Address",
    type: "text",
    required: true,
    placeholder: "e.g. 192.168.88.1 or 10.10.0.1",
  },
  {
    name: "zoneId",
    label: "Associated Zone",
    type: "text",
    required: true,
    placeholder: "e.g. zone_north",
  },
  {
    name: "status",
    label: "Hardware Status",
    type: "select",
    required: true,
    options: [
      { label: "Online (Operational)", value: "online" },
      { label: "Maintenance", value: "maintenance" },
      { label: "Offline / Unreachable", value: "offline" },
    ],
  },
];

const ServerAndDistribution = () => {
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
    () => SERVER_DISTRIBUTION_FORM_FIELDS.map((field) => ({ key: field.name, label: field.label })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Servers & Distribution Infrastructure
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage core routers, OLT fiber headends, management IPs, and network node hardware assignments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors gap-2 cursor-pointer shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Server/Node
        </button>
      </div>

      {/* 2. Main List Container */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <AssetManager
          type="serverDistribution"
          title="Configured Infrastructure Nodes"
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
                Register Infrastructure Node
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
                description="Configure a new gateway router, switch, or headend node with management mapping."
                type="serverDistribution"
                business="isp"
                fields={SERVER_DISTRIBUTION_FORM_FIELDS}
                onSuccess={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerAndDistribution;