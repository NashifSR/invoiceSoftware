"use client";

import { useMemo, useState } from "react";
import {
    Search,
    Pencil,
    Trash2,
    Eye,
} from "lucide-react";

const ListLoader = ({
    /* ============================================================
       DATA
    ============================================================ */

    data = [],
    loading = false,
    error = null,

    /* ============================================================
       BASIC SETTINGS
    ============================================================ */

    title = "Manage Data",
    description = "",
    searchPlaceholder = "Search...",
    emptyMessage = "No records found.",

    /* ============================================================
       FIELDS
       
       Example:

       fields={[
           {
               key: "name",
               label: "User",
           },
           {
               key: "email",
               label: "Email",
           },
           {
               key: "status",
               label: "Status",
           },
       ]}

       Custom value:

       {
           key: "user",
           label: "User",
           getValue: (item) => item.data?.user?.name,
       }
    ============================================================ */

    fields = [],

    /* ============================================================
       ACTIONS
    ============================================================ */

    onDelete,
    onBulkDelete,
    onEdit,
    onDetails,

    /* ============================================================
       ACTION VISIBILITY
    ============================================================ */

    showDetails = true,
    showEdit = true,
    showDelete = true,
    showSelection = true,

    /* ============================================================
       ID
       
       Important:
       This must return the actual ID string/value.
    ============================================================ */

    getItemId = (item) =>
        item?.id || item?._id,
}) => {

    /* ============================================================
       STATE
    ============================================================ */

    const [search, setSearch] = useState("");

    const [selectedIds, setSelectedIds] =
        useState([]);

    /* ============================================================
       SEARCH
       
       Search is completely controlled by fields.
       
       ListLoader does NOT care what the data represents.
    ============================================================ */

    const filteredData = useMemo(() => {

        const searchText =
            search
                .toLowerCase()
                .trim();

        if (!searchText) {
            return data;
        }

        return data.filter(
            (item) => {

                const itemData =
                    item?.data ||
                    item ||
                    {};

                return fields.some(
                    (field) => {

                        let value;

                        /* ----------------------------------------
                           CUSTOM VALUE
                        ---------------------------------------- */

                        if (
                            typeof field.getValue ===
                            "function"
                        ) {

                            value =
                                field.getValue(
                                    item
                                );

                        } else {

                            /* ------------------------------------
                               NORMAL VALUE
                            ------------------------------------ */

                            value =
                                itemData[
                                    field.key
                                ];
                        }

                        if (
                            value === null ||
                            value === undefined
                        ) {
                            return false;
                        }

                        /* ----------------------------------------
                           OBJECT / ARRAY
                        ---------------------------------------- */

                        if (
                            typeof value ===
                            "object"
                        ) {

                            value =
                                JSON.stringify(
                                    value
                                );
                        }

                        return String(
                            value
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            );
                    }
                );
            }
        );

    }, [
        data,
        fields,
        search,
    ]);

    /* ============================================================
       GET FIELD VALUE
    ============================================================ */

    const getFieldValue = (
        item,
        field
    ) => {

        const itemData =
            item?.data ||
            item ||
            {};

        let value;

        /* ----------------------------------------
           CUSTOM VALUE
        ---------------------------------------- */

        if (
            typeof field.getValue ===
            "function"
        ) {

            value =
                field.getValue(
                    item
                );

        } else {

            /* ------------------------------------
               NORMAL VALUE
            ------------------------------------ */

            value =
                itemData[
                    field.key
                ];
        }

        /* ----------------------------------------
           EMPTY VALUE
        ---------------------------------------- */

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }

        /* ----------------------------------------
           OBJECT / ARRAY
        ---------------------------------------- */

        if (
            typeof value ===
            "object"
        ) {

            return JSON.stringify(
                value
            );
        }

        return value;
    };

    /* ============================================================
       SELECTION
    ============================================================ */

    const toggleSelect = (
        id
    ) => {

        setSelectedIds(
            (current) => {

                if (
                    current.includes(
                        id
                    )
                ) {

                    return current.filter(
                        (selectedId) =>
                            selectedId !==
                            id
                    );
                }

                return [
                    ...current,
                    id,
                ];
            }
        );
    };

    /* ============================================================
       SELECT ALL VISIBLE
    ============================================================ */

    const toggleSelectAll = () => {

        const visibleIds =
            filteredData
                .map(getItemId)
                .filter(
                    (id) =>
                        id !==
                            undefined &&
                        id !== null
                );

        const allSelected =
            visibleIds.length > 0 &&
            visibleIds.every(
                (id) =>
                    selectedIds.includes(
                        id
                    )
            );

        if (allSelected) {

            setSelectedIds(
                (current) =>
                    current.filter(
                        (id) =>
                            !visibleIds.includes(
                                id
                            )
                    )
            );

            return;
        }

        setSelectedIds(
            (current) => [
                ...new Set([
                    ...current,
                    ...visibleIds,
                ]),
            ]
        );
    };

    /* ============================================================
       DELETE ONE
    ============================================================ */

    const handleDelete = async (
        item
    ) => {

        const id =
            getItemId(item);

        if (
            id === undefined ||
            id === null
        ) {

            console.error(
                "ListLoader: Unable to determine item ID.",
                item
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this record?"
            );

        if (!confirmed) {
            return;
        }

        try {

            /*
             * Pass BOTH:
             *
             * item = complete record
             * id   = actual ID
             */

            if (onDelete) {
                await onDelete(
                    item,
                    id
                );
            }

            setSelectedIds(
                (current) =>
                    current.filter(
                        (selectedId) =>
                            selectedId !==
                            id
                    )
            );

        } catch (err) {

            console.error(
                "ListLoader delete error:",
                err
            );
        }
    };

    /* ============================================================
       BULK DELETE
    ============================================================ */

    const handleBulkDelete = async () => {

        if (
            selectedIds.length ===
            0
        ) {
            return;
        }

        const confirmed =
            window.confirm(
                `Delete ${selectedIds.length} selected record(s)?`
            );

        if (!confirmed) {
            return;
        }

        const selectedItems =
            data.filter(
                (item) =>
                    selectedIds.includes(
                        getItemId(item)
                    )
            );

        try {

            if (onBulkDelete) {

                await onBulkDelete(
                    selectedItems,
                    selectedIds
                );

            }

            setSelectedIds([]);

        } catch (err) {

            console.error(
                "ListLoader bulk delete error:",
                err
            );
        }
    };

    /* ============================================================
       LOADING
    ============================================================ */

    if (
        loading &&
        data.length === 0
    ) {

        return (
            <div className="flex items-center justify-center px-6 py-12">

                <div className="text-sm text-zinc-500">
                    Loading...
                </div>

            </div>
        );
    }

    /* ============================================================
       GRID COLUMNS
    ============================================================ */

    const hasActions =
        showDetails ||
        showEdit ||
        showDelete;

    const gridTemplateColumns =
        [
            showSelection
                ? "44px"
                : null,

            `repeat(${fields.length}, minmax(0, 1fr))`,

            hasActions
                ? "140px"
                : null,
        ]
            .filter(Boolean)
            .join(" ");

    /* ============================================================
       PAGE
    ============================================================ */

    return (
        <div>

            {/* ====================================================
               HEADER
            ==================================================== */}

            <div className="mb-6">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h1 className="text-xl font-semibold text-zinc-900">
                            {title}
                        </h1>

                        {description && (
                            <p className="mt-1 text-sm text-zinc-500">
                                {description}
                            </p>
                        )}

                    </div>

                </div>

                <p className="mt-2 text-xs text-zinc-400">

                    {filteredData.length}
                    {" "}
                    of
                    {" "}
                    {data.length}
                    {" "}
                    records

                </p>

            </div>

            {/* ====================================================
               ERROR
            ==================================================== */}

            {error && (

                <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {error?.response?.data?.error ||
                        error?.message ||
                        "Something went wrong."}

                </div>
            )}

            {/* ====================================================
               SEARCH TOOLBAR
            ==================================================== */}

            <div className="mb-4 flex items-center gap-3">

                <div className="relative flex-1">

                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        className="w-full border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-500"
                    />

                </div>

                {showDelete &&
                    showSelection &&
                    selectedIds.length >
                        0 && (

                        <button
                            type="button"
                            onClick={
                                handleBulkDelete
                            }
                            className="flex items-center justify-center gap-2 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >

                            <Trash2
                                size={15}
                            />

                            Delete (
                            {
                                selectedIds.length
                            }
                            )

                        </button>
                    )}

            </div>

            {/* ====================================================
               TABLE
            ==================================================== */}

            <div className="overflow-hidden border border-zinc-200 bg-white">

                {/* =================================================
                   HEADER
                ================================================= */}

                <div
                    className="grid items-center border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-500"
                    style={{
                        gridTemplateColumns:
                            gridTemplateColumns,
                    }}
                >

                    {showSelection && (

                        <div>

                            <input
                                type="checkbox"
                                checked={
                                    filteredData.length >
                                        0 &&
                                    filteredData.every(
                                        (
                                            item
                                        ) =>
                                            selectedIds.includes(
                                                getItemId(
                                                    item
                                                )
                                            )
                                    )
                                }
                                onChange={
                                    toggleSelectAll
                                }
                            />

                        </div>
                    )}

                    {fields.map(
                        (
                            field
                        ) => (

                            <div
                                key={
                                    field.key
                                }
                                className="truncate"
                            >
                                {
                                    field.label
                                }
                            </div>

                        )
                    )}

                    {hasActions && (

                        <div className="text-right">
                            Actions
                        </div>

                    )}

                </div>

                {/* =================================================
                   EMPTY
                ================================================= */}

                {filteredData.length ===
                0 ? (

                    <div className="px-4 py-12 text-center text-sm text-zinc-500">

                        {search
                            ? "No matching records found."
                            : emptyMessage}

                    </div>

                ) : (

                    /* =============================================
                       ROWS
                    ============================================= */

                    filteredData.map(
                        (item) => {

                            const id =
                                getItemId(
                                    item
                                );

                            return (

                                <div
                                    key={id}
                                    className="grid items-center border-b border-zinc-100 px-4 py-3 last:border-b-0 hover:bg-zinc-50"
                                    style={{
                                        gridTemplateColumns:
                                            gridTemplateColumns,
                                    }}
                                >

                                    {/* CHECKBOX */}

                                    {showSelection && (

                                        <div>

                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    id
                                                )}
                                                onChange={() =>
                                                    toggleSelect(
                                                        id
                                                    )
                                                }
                                            />

                                        </div>
                                    )}

                                    {/* FIELDS */}

                                    {fields.map(
                                        (
                                            field
                                        ) => (

                                            <div
                                                key={
                                                    field.key
                                                }
                                                className="truncate pr-4 text-sm text-zinc-700"
                                            >

                                                {
                                                    getFieldValue(
                                                        item,
                                                        field
                                                    )
                                                }

                                            </div>

                                        )
                                    )}

                                    {/* ACTIONS */}

                                    {hasActions && (

                                        <div className="flex justify-end gap-1">

                                            {showDetails &&
                                                onDetails && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onDetails(
                                                                item,
                                                                id
                                                            )
                                                        }
                                                        className="p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                        title="Details"
                                                    >

                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />

                                                    </button>
                                                )}

                                            {showEdit &&
                                                onEdit && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onEdit(
                                                                item,
                                                                id
                                                            )
                                                        }
                                                        className="p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                                                        title="Edit"
                                                    >

                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />

                                                    </button>
                                                )}

                                            {showDelete &&
                                                onDelete && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item
                                                            )
                                                        }
                                                        className="p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >

                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />

                                                    </button>
                                                )}

                                        </div>
                                    )}

                                </div>
                            );
                        }
                    )
                )}

            </div>

        </div>
    );
};

export default ListLoader;