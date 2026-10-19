"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import useAssets from "@/API/useAssets";
import AssetManager from "@/API/ui/AssetManager";

const AssetViewer = ({ type }) => {
    const {
        assets = [],
        loading,
        error,
    } = useAssets({
        type,
    });

    const [search, setSearch] = useState("");

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
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900">
                            Asset Viewer
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Showing {filteredAssets.length} of{" "}
                            {assets.length} records
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error.message || "Failed to load assets."}
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
                                setSearch(event.target.value)
                            }
                            placeholder="Search records..."
                            className="w-full border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-500"
                        />
                    </div>
                </div>

                {/* ==================================================
                    DATA TABLE (Read-Only)
                ================================================== */}
                <div className="overflow-x-auto border border-zinc-200 bg-white shadow-sm">
                    {/* Table Header */}
                    <div className="grid min-w-[900px] grid-cols-[220px_130px_1fr_200px] border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-medium text-zinc-500">
                        <div>ID</div>
                        <div>Type</div>
                        <div>Data</div>
                        <div className="text-right">Created</div>
                    </div>

                    {/* Empty */}
                    {filteredAssets.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-zinc-500">
                            No records found.
                        </div>
                    ) : (
                        /* Rows */
                        filteredAssets.map((asset) => {
                            const recordId =
                                asset.id || asset._id;

                            return (
                                <div
                                    key={recordId}
                                    className="grid min-w-[900px] w-full grid-cols-[220px_130px_1fr_200px] items-center border-b border-zinc-100 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-zinc-50/50"
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
                                    <div className="text-right text-xs text-zinc-500">
                                        {asset.createdAt
                                            ? new Date(
                                                asset.createdAt
                                            ).toLocaleString()
                                            : "—"}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    );
};

export default AssetViewer;