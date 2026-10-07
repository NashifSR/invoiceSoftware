"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";

import useAssets from "@/API/useAssets";
import AssetTablePrime from "./component/AssetTablePrime";
import AssetEditModal from "./component/AssetEditModal";
import AssetTableAlpha from "./component/AssetTableAlpha";
import AssetEditModalAlpha from "./component/AssetEditModalAlpha";

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

        {/* Modular Asset Table */}
        <AssetTableAlpha
          assets={filteredAssets}
          onSelectAsset={handleOpenAsset}
          onDeleteAsset={handleDelete}
          deletingId={deletingId}
        />
      </div>

      {/* Modular JSON Edit Modal */}
      <AssetEditModalAlpha
        selectedAsset={selectedAsset}
        onClose={handleCloseModal}
        editableData={editableData}
        setEditableData={setEditableData}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        saving={saving}
        saveError={saveError}
        saveSuccess={saveSuccess}
        setSaveError={setSaveError}
        setSaveSuccess={setSaveSuccess}
      />
    </main>
  );
};

export default AssetManager;