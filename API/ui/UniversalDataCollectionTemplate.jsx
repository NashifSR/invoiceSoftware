"use client";

import { useRouter } from "next/navigation";
import AssetForm from "@/API/ui/AssetForm";
import { useContext } from "react";
import { AuthContext } from "@/Auth/context/AuthContext";

const UniversalDataCollectionTemplate = ({
    initialData = {},
    assetId = null,

    title = "Universal Data Handler",
    description = "Enter the information for this record.",

    type = "data",
    businessType = "general",
    fields = [],

    redirectTo = "/dashboard",
}) => {

    const {
        user,
        loading: authLoading,
    } = useContext(AuthContext);
    const router = useRouter();

    // ============================================================
    // AUTH LOADING
    // ============================================================

    if (authLoading) {
        return (
            <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-zinc-500">
                    Loading...
                </p>
            </div>
        );
    }

    // ============================================================
    // ASSET METADATA
    // ============================================================
    //
    // Everything outside `data` is metadata.
    //
    // This component controls the metadata while the actual
    // form structure is supplied by the page using this component.
    //
    // Clients/users should only be able to modify `data`.
    //
    // ============================================================

    const metadata = {
        // Dynamic
        ownerEmail: user?.email,
        ownerId: user?.uid,

        // Configured by the page
        type,
        businessType,

        // Dynamic
        access: [
            {
                email: user?.email,
                role: "owner",
            },
        ],

        // Dynamic
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    console.group(
        "metadata",
        metadata
    );

    console.group(
        "User ID",
        user?.uid
    );

    // ============================================================
    // INITIAL FORM DATA
    // ============================================================
    //
    // For CREATE:
    //     initialData = {}
    //
    // For UPDATE:
    //     initialData contains the existing `data` object.
    //
    // Only data goes into AssetForm.
    //
    // Metadata is NOT mixed into initialData.
    //
    // ============================================================

    const initialValues = {
        ...initialData,
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h1 className="mb-2 text-xl font-semibold text-zinc-900">
                    {title}
                </h1>

                <p className="text-sm text-zinc-500">
                    {description}
                </p>
            </div>

            {/* Form */}
            <AssetForm
                assetId={assetId}
                fields={fields}
                initialValues={initialValues}
                submitLabel={
                    assetId
                        ? "Update Data Record"
                        : "Save Data Record"
                }

                /*
                 * Metadata belongs to the template.
                 *
                 * AssetForm receives it so the final payload
                 * can be passed to the asset system.
                 */
                metadata={metadata}

                onSuccess={(result) => {
                    alert(
                        assetId
                            ? "Successfully updated data!"
                            : "Successfully created data!"
                    );

                    console.log(
                        "Asset response:",
                        result
                    );

                    router.push(
                        redirectTo
                    );
                }}

                onCancel={() => {
                    router.back();
                }}
            />
        </div>
    );
};

export default UniversalDataCollectionTemplate;