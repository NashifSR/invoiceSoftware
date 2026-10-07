"use client";

import React from "react";
import { User, MapPin, Wifi } from "lucide-react";

const AssetTableAlpha = ({ assets, onSelectAsset }) => {
  if (assets.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-zinc-500 rounded-lg border border-zinc-200 bg-white shadow-sm">
        No client records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm w-full">
      {/* Table Header */}
      <div className="grid w-full grid-cols-[22fr_18fr_22fr_26fr_12fr] border-b border-zinc-200 bg-zinc-50/70 px-4 py-3 text-xs font-semibold text-zinc-600">
        <div>Client Info</div>
        <div>Contact</div>
        <div>Installation Area</div>
        <div>Package & Connection</div>
        <div>Status</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-zinc-100 w-full">
        {assets.map((asset) => {
          const recordId = asset.id || asset._id;

          // Your actual JSON structure
          const data = asset.data || {};

          const fullName = data.fullName || "Unnamed Client";
          const email = data.email || "—";
          const phone = data.phone || "—";

          // Location
          const area = data.area
            ? `${data.area}${data.district ? `, ${data.district}` : ""}`
            : "—";

          // Package & Connection
          const packageId = data.packageId || "—";
          const connectionType = data.connectionType || "—";

          // Your current JSON doesn't have a status field,
          // so default to active for now.
          const status = data.status || "active";

          return (
            <div
              key={recordId}
              onClick={() => onSelectAsset(asset)}
              className="grid w-full grid-cols-[22fr_18fr_22fr_26fr_12fr] items-center px-4 py-3 text-left text-sm transition hover:bg-zinc-50/80 cursor-pointer"
            >
              {/* Client Info */}
              <div className="pr-3 truncate">
                <div className="flex items-center gap-1.5 font-medium text-zinc-900 truncate">
                  <User
                    size={13}
                    className="text-zinc-400 shrink-0"
                  />

                  <span className="truncate">
                    {fullName}
                  </span>
                </div>

                <div className="mt-0.5 font-mono text-[11px] text-zinc-400 truncate">
                  ID:{" "}
                  {recordId
                    ? String(recordId).slice(0, 10) + "..."
                    : "—"}
                </div>
              </div>

              {/* Contact */}
              <div className="pr-3 truncate">
                <div className="text-xs text-zinc-800 truncate">
                  {phone}
                </div>

                <div className="text-[11px] text-zinc-400 truncate">
                  {email}
                </div>
              </div>

              {/* Installation Area */}
              <div className="flex items-center gap-1.5 pr-3 text-xs text-zinc-600 truncate">
                <MapPin
                  size={13}
                  className="text-zinc-400 shrink-0"
                />

                <span className="truncate">
                  {area}
                </span>
              </div>

              {/* Package & Connection */}
              <div className="pr-3 truncate">
                <div className="text-xs font-medium text-zinc-800 truncate">
                  {packageId}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500 truncate">
                  <Wifi
                    size={11}
                    className="text-zinc-400 shrink-0"
                  />

                  <span className="truncate">
                    {connectionType}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center truncate">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize shrink-0 ${
                    status === "active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border border-amber-200/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "active"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />

                  {status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetTableAlpha;