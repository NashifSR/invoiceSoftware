"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Search, X, Trash2, Save, Check, Loader2, AlertCircle } from "lucide-react";

import useAssets from "@/API/useAssets";

const AssetManager = ({ type, title = "Asset Manager" }) => {
  const {
    assets = [],
    loading,
    error,
    updateAsset,
    deleteAsset,
  } = useAssets({
    type,
  });

  console.group("checking asset manager consumer",type , assets)
  console.groupEnd()

  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editableData, setEditableData] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /* ============================================================
      SEARCH FILTER
  ============================================================ */

  const filteredAssets = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return assets;
    }

    return assets.filter((asset) => {
      const recordId = (asset.id || asset._id || "").toString().toLowerCase();
      const assetType = (asset.type || "").toLowerCase();
      const assetData = JSON.stringify(asset.data || {}).toLowerCase();

      return (
        recordId.includes(searchText) ||
        assetType.includes(searchText) ||
        assetData.includes(searchText)
      );
    });
  }, [assets, search]);

  /* ============================================================
      MODAL HANDLERS
  ============================================================ */

  const handleOpenAsset = (asset) => {
    setSelectedAsset(asset);
    setEditableData(JSON.stringify(asset.data || {}, null, 2));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleCloseModal = useCallback(() => {
    if (saving) return;

    setSelectedAsset(null);
    setEditableData("");
    setSaveError(null);
    setSaveSuccess(false);
  }, [saving]);

  // Listen for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedAsset) {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset, handleCloseModal]);

  /* ============================================================
      UPDATE ASSET
  ============================================================ */

  const handleUpdate = async () => {
    if (!selectedAsset) return;

    let parsedData;

    try {
      parsedData = JSON.parse(editableData);
    } catch (err) {
      setSaveSuccess(false);
      setSaveError("Invalid JSON structure. Please fix formatting before saving.");
      return;
    }

    if (
      !parsedData ||
      typeof parsedData !== "object" ||
      Array.isArray(parsedData)
    ) {
      setSaveSuccess(false);
      setSaveError("Asset data payload must be a valid JSON object.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const targetId = selectedAsset.id || selectedAsset._id;

      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          data: parsedData,
        })
      );

      const updatedAsset = await updateAsset(targetId, formData);

      setSelectedAsset(updatedAsset);
      setEditableData(
        JSON.stringify(updatedAsset?.data || parsedData, null, 2)
      );
      setSaveSuccess(true);
    } catch (err) {
      console.error("Failed to update asset:", err);

      setSaveError(
        err?.response?.data?.error ||
          err?.message ||
          "An unexpected error occurred while saving."
      );
      setSaveSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
      DELETE ASSET
  ============================================================ */

  const handleDelete = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }

    if (!window.confirm("Are you sure you want to permanently delete this asset?")) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteAsset(id);

      // Close modal if the currently selected asset was deleted
      if (
        selectedAsset &&
        (selectedAsset.id === id || selectedAsset._id === id)
      ) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to delete asset:", err);
      alert("Failed to delete asset. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ============================================================
      INITIAL LOADING STATE
  ============================================================ */

  if (loading && assets.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto flex max-w-7xl items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          <span>Loading assets...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
            <p className="text-xs text-zinc-500">
              Showing {filteredAssets.length} of {assets.length} total records
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error.message || "Failed to fetch assets from server."}</span>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, type, or data content..."
              className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="grid min-w-[1000px] grid-cols-[200px_140px_1fr_180px_80px] border-b border-zinc-200 bg-zinc-50/70 px-4 py-3 text-xs font-semibold text-zinc-600">
              <div>ID</div>
              <div>Type</div>
              <div>Data JSON</div>
              <div>Created Date</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Empty State */}
            {filteredAssets.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-zinc-500">
                No matching assets found.
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const recordId = asset.id || asset._id;
                const isDeleting = deletingId === recordId;

                return (
                  <div
                    key={recordId}
                    onClick={() => handleOpenAsset(asset)}
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
                        onClick={(e) => handleDelete(recordId, e)}
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
              })
            )}
          </div>
        </div>
      </div>

      {/* JSON Edit Modal */}
      {selectedAsset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
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
                  ID: {selectedAsset.id || selectedAsset._id || "—"}
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={handleCloseModal}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
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
                className="min-h-[420px] w-full resize-y rounded-lg border border-zinc-300 bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-100 shadow-inner outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
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
                onClick={(e) =>
                  handleDelete(
                    selectedAsset.id || selectedAsset._id,
                    e
                  )
                }
                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 size={14} />
                <span>Delete Asset</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCloseModal}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleUpdate}
                  className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
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
      )}
    </main>
  );
};

export default AssetManager;