"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle, Edit3, Trash2, Building2 } from "lucide-react";

import useAssets from "@/API/useAssets";
import AssetEditModalAlpha from "./AssetEditModalAlpha";
import AssetEditModalPrime from "./AssetEditModalPrime";

const SingleAssetManager = ({
    type,
    title = "Asset Manager",
    tableColumns = [],
    ModalComponent
}) => {
    const {
        assets = [],
        loading,
        error,
        updateAsset,
        deleteAsset,
    } = useAssets({ type });

    console.group("modal comp",ModalComponent);

    // Grab the single record (first item)
    const asset = assets[0] || null;

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [deletingId, setDeletingId] = useState(false);

    const [editableData, setEditableData] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    /* ============================================================
       MODAL HANDLERS
    ============================================================ */

    const handleOpenAsset = (targetAsset) => {
        setSelectedAsset(targetAsset);
        setEditableData(JSON.stringify(targetAsset?.data || targetAsset || {}, null, 2));
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

        if (!parsedData || typeof parsedData !== "object" || Array.isArray(parsedData)) {
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
            setEditableData(JSON.stringify(updatedAsset?.data || parsedData, null, 2));
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
        if (e) e.stopPropagation();

        if (!window.confirm("Are you sure you want to permanently delete this record?")) {
            return;
        }

        try {
            setDeletingId(true);
            await deleteAsset(id);
            handleCloseModal();
        } catch (err) {
            console.error("Failed to delete asset:", err);
            alert("Failed to delete asset. Please try again.");
        } finally {
            setDeletingId(false);
        }
    };

    /* ============================================================
       LOADING STATE
    ============================================================ */

    if (loading && assets.length === 0) {
        return (
            <main className="min-h-[200px] flex items-center justify-center bg-white rounded-xl border border-zinc-200 p-6">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    <span>Loading record...</span>
                </div>
            </main>
        );
    }

    const assetData = asset?.data || asset || {};
    const recordId = asset?.id || asset?._id;

    return (
        <main className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
                        {title}
                    </h2>
                    <p className="text-xs text-zinc-500">
                        {asset ? "Active record configured" : "No record configured yet"}
                    </p>
                </div>

                {asset && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleOpenAsset(asset)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Record
                        </button>
                        <button
                            onClick={(e) => handleDelete(recordId, e)}
                            disabled={deletingId}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deletingId ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>

            {/* Global Error Banner */}
            {error && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{error.message || "Failed to fetch asset from server."}</span>
                </div>
            )}

            {/* Single Asset Display */}
            {asset ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    {tableColumns.map((col) => {
                        const val = assetData[col.key];
                        return (
                            <div key={col.key} className="space-y-1">
                                <span className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                    {col.label}
                                </span>
                                <span className="font-medium text-zinc-800 block break-words">
                                    {val !== undefined && val !== null && val !== "" ? String(val) : "N/A"}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-12 text-center text-zinc-400 text-sm space-y-2">
                    <Building2 className="w-8 h-8 mx-auto text-zinc-300" />
                    <p>No asset record found for this profile.</p>
                </div>
            )}

            {/* Modular Edit Modal */}
            {(() => {
                switch (ModalComponent) {
                    case "prime":
                        return (
                            <AssetEditModalPrime
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
                                tableColumns={tableColumns}
                            />
                        );
                    default:
                        return (
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
                                tableColumns={tableColumns}
                            />
                        );
                }
            })()}
        </main>
    );
};

export default SingleAssetManager;