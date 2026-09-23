"use client";

import { useMemo, useState } from "react";
import { Search, X, Trash2, Save, Check } from "lucide-react";

import useAssets from "@/API/useAssets";

const AssetManager = ({
    type,
    title,
}) => {
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
        SEARCH
    ============================================================ */

    const filteredAssets = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        if (!searchText) {
            return assets;
        }

        return assets.filter((asset) =>
            JSON.stringify(asset)
                .toLowerCase()
                .includes(searchText)
        );
    }, [assets, search]);

    /* ============================================================
        OPEN UPDATE MODAL
    ============================================================ */

    const handleOpenAsset = (asset) => {
        setSelectedAsset(asset);

        setEditableData(
            JSON.stringify(asset.data || {}, null, 2)
        );

        setSaveError(null);
        setSaveSuccess(false);
    };

    /* ============================================================
        UPDATE ASSET
    ============================================================ */

    const handleUpdate = async () => {
        if (!selectedAsset) {
            return;
        }

        let parsedData;

        try {
            parsedData = JSON.parse(editableData);
        } catch (err) {
            setSaveSuccess(false);

            setSaveError(
                "Invalid JSON. Please fix the data before saving."
            );

            return;
        }

        if (
            !parsedData ||
            typeof parsedData !== "object" ||
            Array.isArray(parsedData)
        ) {
            setSaveSuccess(false);

            setSaveError(
                "Asset data must be a JSON object."
            );

            return;
        }

        try {
            setSaving(true);
            setSaveError(null);
            setSaveSuccess(false);

            const targetId =
                selectedAsset.id ||
                selectedAsset._id;

            const formData = new FormData();

            formData.append(
                "data",
                JSON.stringify({
                    data: parsedData,
                })
            );

            const updatedAsset =
                await updateAsset(
                    targetId,
                    formData
                );

            setSelectedAsset(updatedAsset);

            setEditableData(
                JSON.stringify(
                    updatedAsset.data || {},
                    null,
                    2
                )
            );

            setSaveSuccess(true);
        } catch (err) {
            console.error(
                "Failed to update asset:",
                err
            );

            setSaveError(
                err?.response?.data?.error ||
                err?.message ||
                "Failed to update asset."
            );

            setSaveSuccess(false);
        } finally {
            setSaving(false);
        }
    };

    /* ============================================================
        DELETE
    ============================================================ */

    const handleDelete = async (id, e) => {
        if (e) {
            e.stopPropagation();
        }

        if (
            !window.confirm(
                "Are you sure you want to delete this asset?"
            )
        ) {
            return;
        }

        try {
            setDeletingId(id);

            await deleteAsset(id);

            if (
                selectedAsset &&
                (
                    selectedAsset.id === id ||
                    selectedAsset._id === id
                )
            ) {
                setSelectedAsset(null);
            }
        } catch (err) {
            console.error(
                "Failed to delete asset:",
                err
            );

            alert("Failed to delete asset.");
        } finally {
            setDeletingId(null);
        }
    };

    /* ============================================================
        CLOSE MODAL
    ============================================================ */

    const handleCloseModal = () => {
        if (saving) {
            return;
        }

        setSelectedAsset(null);
        setEditableData("");
        setSaveError(null);
        setSaveSuccess(false);
    };

    /* ============================================================
        LOADING
    ============================================================ */

    if (loading && assets.length === 0) {
        return (
            <main className="min-h-screen bg-zinc-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm text-zinc-500">
                        Loading assets...
                    </p>
                </div>
            </main>
        );
    }

    /* ============================================================
        PAGE
    ============================================================ */

    return (
        <main className="min-h-screen bg-zinc-50 p-6">
            <div className="mx-auto max-w-7xl">

                {/* Header */}

                <div className="mb-5">
                    <h1 className="text-xl font-semibold text-zinc-900">
                        {title}
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Showing {filteredAssets.length} of{" "}
                        {assets.length} assets
                    </p>
                </div>

                {/* Error */}

                {error && (
                    <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error.message ||
                            "Failed to load assets."}
                    </div>
                )}

                {/* Search */}

                <div className="mb-4">
                    <div className="relative max-w-md">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search assets..."
                            className="w-full border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-500"
                        />
                    </div>
                </div>

                {/* ==================================================
                    DATA TABLE
                ================================================== */}

                <div className="overflow-x-auto border border-zinc-200 bg-white">

                    {/* Table Header */}

                    <div className="grid min-w-[1000px] grid-cols-[200px_125px_1fr_180px_80px] border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-medium text-zinc-500">
                        <div>ID</div>
                        <div>Type</div>
                        <div>Data</div>
                        <div>Created</div>
                        <div className="text-right">
                            Actions
                        </div>
                    </div>

                    {/* Empty */}

                    {filteredAssets.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-zinc-500">
                            No assets found.
                        </div>
                    ) : (
                        filteredAssets.map((asset) => {
                            const recordId =
                                asset.id ||
                                asset._id;

                            return (
                                <div
                                    key={recordId}
                                    onClick={() =>
                                        handleOpenAsset(asset)
                                    }
                                    className="grid min-w-[1000px] w-full grid-cols-[200px_125px_1fr_180px_80px] items-center border-b border-zinc-100 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-zinc-50 cursor-pointer"
                                >
                                    {/* ID */}

                                    <div className="truncate pr-4 font-mono text-xs text-zinc-500">
                                        {recordId || "—"}
                                    </div>

                                    {/* Type */}

                                    <div className="truncate font-medium text-zinc-800">
                                        {asset.type || "—"}
                                    </div>

                                    {/* Data */}

                                    <div className="truncate pr-4 font-mono text-xs text-zinc-500">
                                        {JSON.stringify(
                                            asset.data || {}
                                        )}
                                    </div>

                                    {/* Created */}

                                    <div className="text-xs text-zinc-500">
                                        {asset.createdAt
                                            ? new Date(
                                                asset.createdAt
                                            ).toLocaleString()
                                            : "—"}
                                    </div>

                                    {/* Actions */}

                                    <div className="text-right">
                                        <button
                                            type="button"
                                            disabled={
                                                deletingId ===
                                                recordId
                                            }
                                            onClick={(e) =>
                                                handleDelete(
                                                    recordId,
                                                    e
                                                )
                                            }
                                            className="p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                                            title="Delete Asset"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ======================================================
                UPDATE ASSET MODAL
            ====================================================== */}

            {selectedAsset && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6"
                    onClick={handleCloseModal}
                >
                    <div
                        className="mx-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden bg-white shadow-xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                            <div>
                                <p className="text-sm font-semibold text-zinc-900">
                                    Edit{" "}
                                    {selectedAsset.type ||
                                        "Asset"}
                                </p>

                                <p className="mt-0.5 font-mono text-xs text-zinc-400">
                                    {selectedAsset.id ||
                                        selectedAsset._id ||
                                        "—"}
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleCloseModal}
                                className="p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}

                        <div className="flex-1 overflow-auto p-5">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-zinc-600">
                                    Asset Data
                                </label>

                                <span className="text-[11px] text-zinc-400">
                                    JSON
                                </span>
                            </div>

                            <textarea
                                value={editableData}
                                onChange={(event) => {
                                    setEditableData(
                                        event.target.value
                                    );

                                    if (saveError) {
                                        setSaveError(null);
                                    }

                                    if (saveSuccess) {
                                        setSaveSuccess(false);
                                    }
                                }}
                                spellCheck={false}
                                disabled={saving}
                                className="min-h-[450px] w-full resize-y border border-zinc-300 bg-zinc-50 p-4 font-mono text-xs leading-5 text-zinc-800 outline-none focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            {/* Save Error */}

                            {saveError && (
                                <div className="mt-3 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                                    {saveError}
                                </div>
                            )}
                        </div>

                        {/* Save Success */}

                        {saveSuccess && (
                            <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-5 py-2.5 text-xs text-emerald-700">
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                                    <Check size={11} />
                                </span>

                                Changes saved successfully.
                            </div>
                        )}

                        {/* Modal Footer */}

                        <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-5 py-3">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={(e) =>
                                    handleDelete(
                                        selectedAsset.id ||
                                        selectedAsset._id,
                                        e
                                    )
                                }
                                className="flex items-center gap-1.5 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={handleCloseModal}
                                    className="px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={handleUpdate}
                                    className="flex items-center gap-1.5 bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Save size={14} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
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
