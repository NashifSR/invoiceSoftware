"use client";

import React from "react";

const AssetTableAlpha = ({ assets, tableColumns = [], onSelectAsset }) => {
  if (!assets || assets.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-zinc-500 rounded-lg border border-zinc-200 bg-white shadow-sm">
        No records found.
      </div>
    );
  }

  // Fallback if tableColumns weren't passed: extract keys from the first asset's data object
  const columns =
    tableColumns.length > 0
      ? tableColumns
      : Object.keys(assets[0]?.data || {}).map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
        }));

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold text-zinc-600">
              <th className="py-3 px-4 font-semibold">Record ID</th>
              {columns.map((col) => (
                <th key={col.key} className="py-3 px-4 font-semibold truncate">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-zinc-100 text-sm">
            {assets.map((asset) => {
              const recordId = asset.id || asset._id;
              const data = asset.data || {};

              return (
                <tr
                  key={recordId}
                  onClick={() => onSelectAsset(asset)}
                  className="transition hover:bg-zinc-50/80 cursor-pointer"
                >
                  {/* Record ID column */}
                  <td className="py-3 px-4 font-mono text-xs text-zinc-500 truncate max-w-[140px]">
                    {recordId ? String(recordId).slice(0, 10) + "..." : "—"}
                  </td>

                  {/* Dynamic columns */}
                  {columns.map((col) => {
                    const value = data[col.key];

                    if (col.key === "status") {
                      const statusVal = value || "active";
                      return (
                        <td key={col.key} className="py-3 px-4 truncate">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0 ${
                              statusVal === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                statusVal === "active"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {statusVal}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={col.key} className="py-3 px-4 text-xs text-zinc-800 truncate">
                        {value !== undefined && value !== null && value !== ""
                          ? String(value)
                          : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTableAlpha;