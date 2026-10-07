"use client";

import { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AssetForm from "@/API/ui/AssetForm";
import { AuthContext } from "@/Auth/context/AuthContext";

const UniversalDataCollectionTemplate = ({
  initialData = {},
  assetId = null,
  title = "Universal Data Handler",
  description = "Enter the information for this record.",
  type = "data",
  business = "general",
  fields = [],
  redirectTo = "/dashboard",
  onSuccessCallback = null,
}) => {
  
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  // ============================================================
  // AUTH LOADING STATE
  // ============================================================
  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2 size={18} className="animate-spin text-zinc-900" />
          <span>Loading context...</span>
        </div>
      </div>
    );
  }

  // ============================================================
  // ASSET METADATA
  // ============================================================
  //
  // Controls ownership and tracking properties while allowing
  // AssetForm to deal solely with editable record payload.
  //
  // ============================================================
  const buildMetadata = (isUpdate = false) => {
    const now = new Date().toISOString();

    return {
      ownerEmail: user?.email || null,
      ownerId: user?.uid || null,
      type,
      business,
      access: [
        {
          email: user?.email || null,
          role: "owner",
        },
      ],
      createdAt: isUpdate && initialData?.createdAt ? initialData.createdAt : now,
      updatedAt: now,
    };
  };

  const metadata = buildMetadata(Boolean(assetId));

  // ============================================================
  // INITIAL VALUES
  // ============================================================
  const initialValues = useMemo(() => {
    return { ...initialData };
  }, [initialData]);

  // ============================================================
  // SUCCESS HANDLER
  // ============================================================
  const handleSuccess = (result) => {
    if (onSuccessCallback) {
      onSuccessCallback(result);
      return;
    }

    console.log("Asset response:", result);

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 border-b border-zinc-100 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Dynamic Asset Form */}
      <AssetForm
        assetId={assetId}
        fields={fields}
        initialValues={initialValues}
        submitLabel={assetId ? "Update Data Record" : "Save Data Record"}
        metadata={metadata}
        onSuccess={handleSuccess}
        onCancel={() => router.back()}
      />
    </div>
  );
};

export default UniversalDataCollectionTemplate;