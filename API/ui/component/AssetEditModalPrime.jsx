"use client";

import React, { useEffect, useState, useMemo } from "react";
import { X, Trash2, Save, Check, Loader2, AlertCircle, Layers, User, MapPin, Settings } from "lucide-react";

const AssetEditModalPrime = ({
  selectedAsset,
  onClose,
  editableData,
  setEditableData,
  onUpdate,
  onDelete,
  saving,
  saveError,
  saveSuccess,
  setSaveError,
  setSaveSuccess,
}) => {
  const [formData, setFormData] = useState({});

  // Parse raw data safely
  const rawData = useMemo(() => {
    if (!selectedAsset) return {};
    if (typeof selectedAsset.data !== "string") {
      return selectedAsset.data || {};
    }
    try {
      return JSON.parse(selectedAsset.data || "{}");
    } catch (err) {
      console.error("Failed to parse asset data JSON:", err);
      return {};
    }
  }, [selectedAsset]);

  // Recursively flatten nested objects into dot-notation paths for form inputs
  useEffect(() => {
    if (!selectedAsset) return;

    try {
      const flattenObject = (obj, prefix = "") =>
        Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? `${prefix}.${k}` : k;
          if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre));
          } else {
            acc[pre] = obj[k] !== undefined && obj[k] !== null ? obj[k] : "";
          }
          return acc;
        }, {});

      setFormData(flattenObject(rawData));
    } catch (err) {
      console.error("Failed to parse asset data:", err);
    }
  }, [selectedAsset, rawData]);

  // Sync dynamic form values back into nested JSON structure for parent component compatibility
  useEffect(() => {
    if (!selectedAsset) return;

    const reconstructed = { ...rawData };

    Object.entries(formData).forEach(([path, value]) => {
      const keys = path.split(".");
      let current = reconstructed;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]] || typeof current[keys[i]] !== "object") {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    });

    setEditableData(JSON.stringify(reconstructed, null, 2));
  }, [formData, selectedAsset, rawData, setEditableData]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedAsset && !saving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset, onClose, saving]);

  // Group fields dynamically by their top-level key (e.g., client, package, etc.)
  const groupedFields = useMemo(() => {
    const groups = {};
    Object.keys(formData).forEach((path) => {
      const topKey = path.split(".")[0];
      if (!groups[topKey]) groups[topKey] = [];
      groups[topKey].push(path);
    });
    return groups;
  }, [formData]);

  // 🟢 EARLY RETURN MOVED BELOW ALL HOOKS
  if (!selectedAsset) return null;

  const recordId = selectedAsset.id || selectedAsset._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (saveError) setSaveError(null);
    if (saveSuccess) setSaveSuccess(false);
  };

  const getGroupIcon = (groupName) => {
    switch (groupName.toLowerCase()) {
      case "client":
      case "personal":
        return <User size={14} className="text-zinc-400" />;
      case "address":
      case "installation":
        return <MapPin size={14} className="text-zinc-400" />;
      default:
        return <Settings size={14} className="text-zinc-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Layers size={16} className="text-zinc-500" />
              Edit Record ({selectedAsset.type || "Asset"})
            </h3>
            <p className="mt-0.5 font-mono text-xs text-zinc-400">
              ID: {recordId || "—"}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Dynamically Grouped Form Sections */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {Object.entries(groupedFields).map(([groupName, paths]) => {
            const formattedGroupTitle = groupName
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            return (
              <div key={groupName} className="border-b border-zinc-100 pb-5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {getGroupIcon(groupName)}
                  <span>{formattedGroupTitle}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paths.map((path) => {
                    const fieldLabel = path.split(".").pop();
                    const formattedLabel = fieldLabel
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());

                    return (
                      <div key={path} className="sm:col-span-1">
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                          {formattedLabel}
                        </label>
                        <input
                          type="text"
                          name={path}
                          value={formData[path] !== undefined ? formData[path] : ""}
                          onChange={handleChange}
                          disabled={saving}
                          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Validation or API Error Banner */}
          {saveError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{saveError}</span>
            </div>
          )}
        </div>

        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-6 py-2.5 text-xs text-emerald-700">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200">
              <Check size={11} className="text-emerald-800" />
            </span>
            <span>Record updated successfully.</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/50 px-6 py-3.5">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => onDelete(recordId, e)}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={onUpdate}
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetEditModalPrime;