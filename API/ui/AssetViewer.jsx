"use client";

import React from "react";
import { Loader2, AlertCircle, Building2 } from "lucide-react";
import useAssets from "@/API/useAssets";

const AssetViewer = ({ type, title = "Asset Viewer", tableColumns = [] }) => {
  const { assets = [], loading, error } = useAssets({ type });

  /* ============================================================
     INITIAL LOADING STATE
  ============================================================ */
  if (loading && assets.length === 0) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        <span>Loading record details...</span>
      </div>
    );
  }

  /* ============================================================
     FETCH ERROR BANNER
  ============================================================ */
  if (error) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
        <span>{error.message || "Failed to fetch asset record from server."}</span>
      </div>
    );
  }

  /* ============================================================
     EMPTY STATE
  ============================================================ */
  if (!assets || assets.length === 0) {
    return (
      <div className="py-8 text-center space-y-2">
        <Building2 className="mx-auto h-8 w-8 text-zinc-300" />
        <p className="text-xs text-zinc-500 font-medium">No record found for this asset category.</p>
        <p className="text-[11px] text-zinc-400">Please configure your profile data using the setup button above.</p>
      </div>
    );
  }

  // Extract the single master asset (e.g. primary tenant business record)
  const masterRecord = assets[0];
  const recordData = masterRecord?.data || masterRecord || {};

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-3">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900">{title}</h2>
        <p className="text-[11px] text-zinc-500">
          Verified read-only record (ID: {masterRecord.id || masterRecord._id || "N/A"})
        </p>
      </div>

      {/* Structured Read-Only Data Cards */}
      {tableColumns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tableColumns.map((col) => {
            const rawValue = recordData[col.key];
            const displayValue =
              rawValue !== undefined && rawValue !== null && rawValue !== ""
                ? String(rawValue)
                : "—";

            return (
              <div
                key={col.key}
                className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50"
              >
                <span className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  {col.label}
                </span>
                <span className="text-xs font-semibold text-zinc-900 break-words">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback: Generic Key-Value Display if no tableColumns provided */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(recordData).map(([key, val]) => (
            <div
              key={key}
              className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3"
            >
              <span className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                {key}
              </span>
              <span className="text-xs font-semibold text-zinc-900 break-words">
                {typeof val === "object" ? JSON.stringify(val) : String(val || "—")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetViewer;