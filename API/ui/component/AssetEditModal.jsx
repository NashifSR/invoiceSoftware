"use client";

import React, { useEffect } from "react";
import { X, Trash2, Save, Check, Loader2, AlertCircle } from "lucide-react";

const AssetEditModal = ({
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
  // Listen for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedAsset && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset, onClose, saving]);

  if (!selectedAsset) return null;

  const recordId = selectedAsset.id || selectedAsset._id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Edit {selectedAsset.type || "Asset"}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-700">
              Data JSON Editor
            </label>
            <span className="text-[11px] font-mono text-zinc-400">
              JSON Syntax
            </span>
          </div>

          <textarea
            value={editableData}
            onChange={(e) => {
              setEditableData(e.target.value);
              if (saveError) setSaveError(null);
              if (saveSuccess) setSaveSuccess(false);
            }}
            spellCheck={false}
            disabled={saving}
            className="min-h-[420px] w-full resize-y rounded-lg border border-zinc-300 bg-white p-4 font-mono text-xs leading-relaxed text-zinc-900 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {/* Validation or API Error Banner */}
          {saveError && (
            <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
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
            <span>Asset data saved successfully.</span>
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
            <span>Delete Asset</span>
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

export default AssetEditModal;