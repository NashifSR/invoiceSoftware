"use client";

import React from "react";
import { Trash2, Loader2 } from "lucide-react";

const AssetTablePrime = ({ assets, onSelectAsset, onDeleteAsset, deletingId }) => {
  if (assets.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-zinc-500">
        No matching assets found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid min-w-[1000px] grid-cols-[200px_140px_1fr_180px_80px] border-b border-zinc-200 bg-zinc-50/70 px-4 py-3 text-xs font-semibold text-zinc-600">
          <div>ID</div>
          <div>Type</div>
          <div>Data JSON</div>
          <div>Created Date</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Rows */}
        {assets.map((asset) => {
          const recordId = asset.id || asset._id;
          const isDeleting = deletingId === recordId;

          return (
            <div
              key={recordId}
              onClick={() => onSelectAsset(asset)}
              className="grid min-w-[1000px] w-full grid-cols-[200px_140px_1fr_180px_80px] items-center border-b border-zinc-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-zinc-50/80 cursor-pointer"
            >
              {/* ID */}
              <div className="truncate pr-4 font-mono text-xs text-zinc-500">
                {recordId || "—"}
              </div>

              {/* Type */}
              <div className="truncate font-medium text-zinc-800">
                <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                  {asset.type || "—"}
                </span>
              </div>

              {/* Data Payload Preview */}
              <div className="truncate pr-4 font-mono text-xs text-zinc-500">
                {JSON.stringify(asset.data || {})}
              </div>

              {/* Created Date */}
              <div className="text-xs text-zinc-500">
                {asset.createdAt
                  ? new Date(asset.createdAt).toLocaleString()
                  : "—"}
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={(e) => onDeleteAsset(recordId, e)}
                  className="rounded p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none disabled:opacity-50"
                  title="Delete Asset"
                >
                  {isDeleting ? (
                    <Loader2 size={15} className="animate-spin text-red-600" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetTablePrime;