"use client";

import React from "react";
import { Trash2, Loader2, User, MapPin, Wifi, ShieldCheck } from "lucide-react";

const AssetTableAlpha = ({ assets, onSelectAsset, onDeleteAsset, deletingId }) => {
  if (assets.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-zinc-500">
        No client records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="grid min-w-[1100px] grid-cols-[220px_180px_200px_160px_1fr_80px] border-b border-zinc-200 bg-zinc-50/70 px-4 py-3 text-xs font-semibold text-zinc-600">
          <div>Client Info</div>
          <div>Contact</div>
          <div>Installation Area</div>
          <div>Package & Connection</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        {/* Table Rows */}
        {assets.map((asset) => {
          const recordId = asset.id || asset._id;
          const isDeleting = deletingId === recordId;

          // Extract nested ISP client data safely
          const clientData = asset.data?.client || {};
          const personalInfo = clientData.personalInfo || {};
          const address = clientData.installationAddress || {};
          const subscription = clientData.subscription || {};
          const pkgData = asset.data?.package || {};

          const fullName = personalInfo.fullName || "Unnamed Client";
          const email = personalInfo.email || "—";
          const phone = personalInfo.phone || "—";
          const area = address.area ? `${address.area}, ${address.district || ""}` : "—";
          const packageName = pkgData.packageName || subscription.packageId || "—";
          const connectionType = subscription.connectionType || "PPPoE";
          const status = subscription.status || "active";

          return (
            <div
              key={recordId}
              onClick={() => onSelectAsset(asset)}
              className="grid min-w-[1100px] w-full grid-cols-[220px_180px_200px_160px_1fr_80px] items-center border-b border-zinc-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-zinc-50/80 cursor-pointer"
            >
              {/* Client Info */}
              <div className="pr-4">
                <div className="flex items-center gap-1.5 font-medium text-zinc-900 truncate">
                  <User size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{fullName}</span>
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-zinc-400">
                  ID: {recordId ? recordId.slice(0, 10) + "..." : "—"}
                </div>
              </div>

              {/* Contact */}
              <div className="pr-4">
                <div className="text-xs text-zinc-800 truncate">{phone}</div>
                <div className="text-[11px] text-zinc-400 truncate">{email}</div>
              </div>

              {/* Installation Area */}
              <div className="flex items-center gap-1.5 pr-4 text-xs text-zinc-600 truncate">
                <MapPin size={13} className="text-zinc-400 shrink-0" />
                <span className="truncate">{area}</span>
              </div>

              {/* Package & Connection */}
              <div className="pr-4">
                <div className="text-xs font-medium text-zinc-800 truncate">
                  {packageName}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Wifi size={11} className="text-zinc-400" />
                  <span>{connectionType}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border border-amber-200/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "active" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {status}
                </span>
              </div>

              {/* Actions */}
              <div className="text-right">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={(e) => onDeleteAsset(recordId, e)}
                  className="rounded p-1.5 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none disabled:opacity-50 cursor-pointer"
                  title="Delete Client Record"
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

export default AssetTableAlpha;