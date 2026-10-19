"use client";

import React, { useState } from "react";
import { Trash2, Loader2, Code, LayoutGrid, Layers, Calendar } from "lucide-react";

const AssetTablePrime = ({ assets, onSelectAsset, onDeleteAsset, deletingId }) => {
  // Track JSON view mode per record ID
  const [showJsonMap, setShowJsonMap] = useState({});

  const toggleJsonView = (recordId, e) => {
    e.stopPropagation();
    setShowJsonMap((prev) => ({ ...prev, [recordId]: !prev[recordId] }));
  };

  if (assets.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500 shadow-sm">
        No matching records found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assets.map((asset) => {
        const recordId = asset.id || asset._id;
        const isDeleting = deletingId === recordId;
        const isJsonMode = showJsonMap[recordId];

        // Safely extract the data object
        const dataObj = typeof asset.data === "string" 
          ? JSON.parse(asset.data || "{}") 
          : (asset.data || {});

        return (
          <div
            key={recordId}
            onClick={() => onSelectAsset(asset)}
            className="group relative flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md cursor-pointer"
          >
            {/* Horizontal Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-800">
                  <Layers size={12} className="text-zinc-500" />
                  {asset.type || "Record"}
                </span>
                <span className="font-mono text-xs text-zinc-400">
                  ID: {recordId || "—"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Calendar size={12} />
                  {asset.createdAt ? new Date(asset.createdAt).toLocaleString() : "—"}
                </span>

                <div className="flex items-center gap-1">
                  {/* Toggle JSON / Grid View Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleJsonView(recordId, e)}
                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                    title={isJsonMode ? "Switch to structured view" : "Switch to raw JSON"}
                  >
                    {isJsonMode ? <LayoutGrid size={14} /> : <Code size={14} />}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={(e) => onDeleteAsset(recordId, e)}
                    className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Delete Record"
                  >
                    {isDeleting ? (
                      <Loader2 size={14} className="animate-spin text-red-600" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Card Body: Displays ALL Info */}
            <div className="pt-4">
              {isJsonMode ? (
                <pre className="max-h-[300px] overflow-auto rounded-lg bg-zinc-900 p-4 font-mono text-xs text-zinc-200">
                  {JSON.stringify(dataObj, null, 2)}
                </pre>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
                  {Object.entries(dataObj).map(([key, val]) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    
                    const displayVal = typeof val === "object" && val !== null 
                      ? JSON.stringify(val) 
                      : String(val !== undefined && val !== null ? val : "—");

                    return (
                      <div key={key} className="flex flex-col bg-zinc-50/60 p-2.5 rounded-lg border border-zinc-100/80">
                        <span className="font-semibold text-zinc-400 text-[10px] uppercase tracking-wider mb-0.5">
                          {formattedKey}
                        </span>
                        <span className="text-zinc-800 font-medium break-words">
                          {displayVal}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetTablePrime;