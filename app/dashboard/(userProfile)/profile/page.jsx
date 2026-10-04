"use client";

import { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Edit3,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Globe,
  Key,
  BadgeCheck,
  CreditCard,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

import { auth } from "@/Auth/lib/firebase";
import useAssets from "@/API/useAssets";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";

/* ============================================================
   MULTI-TENANT SAAS PROFILE FIELDS (WITH DIRECT IMAGE UPLOAD)
============================================================ */

const PROFILE_FIELDS = [
  {
    name: "displayName",
    label: "Account Admin Name",
    type: "text",
    placeholder: "e.g., Alex Johnson",
    required: true,
  },
  {
    name: "organizationName",
    label: "Organization / Business Name",
    type: "text",
    placeholder: "e.g., OptiVista Digital or SpeedNet ISP",
    required: true,
  },
  {
    name: "phone",
    label: "Primary Phone Number",
    type: "tel",
    placeholder: "+880 1700-000000",
  },
  {
    name: "accountType",
    label: "Business Vertical / Workspace Type",
    type: "select",
    options: [
      { value: "individual", label: "Individual / Freelancer" },
      { value: "business", label: "Commercial / General Business" },
      { value: "isp", label: "ISP & Broadband Provider" },
      { value: "tvet", label: "TVET / Training Institute" },
      { value: "agency", label: "Digital Marketing / Tech Agency" },
    ],
    required: true,
  },
  {
    name: "currency",
    label: "Default Billing Currency",
    type: "select",
    options: [
      { value: "BDT", label: "BDT (৳) - Bangladeshi Taka" },
      { value: "USD", label: "USD ($) - US Dollar" },
      { value: "EUR", label: "EUR (€) - Euro" },
    ],
    required: true,
  },
  {
    name: "website",
    label: "Primary Website / Domain",
    type: "url",
    placeholder: "https://yourdomain.com",
  },
  {
    name: "logoUrl",
    label: "Workspace Logo / Profile Image",
    type: "image", // Triggers direct file upload in UniversalDataCollectionTemplate
    placeholder: "Upload company logo or profile picture",
  },
  {
    name: "taxId",
    label: "BIN / Tax Identification Number",
    type: "text",
    placeholder: "e.g., BIN-123456789",
  },
];

/* ============================================================
   ACCOUNT TYPE BADGES
============================================================ */

const ACCOUNT_TYPE_MAP = {
  individual: { label: "Individual", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  business: { label: "Business", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  isp: { label: "ISP Provider", color: "bg-blue-50 text-blue-700 border-blue-200" },
  tvet: { label: "TVET Institute", color: "bg-amber-50 text-amber-700 border-amber-200" },
  agency: { label: "Agency", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

/* ============================================================
   AVATAR / LOGO COMPONENT WITH FALLBACK
============================================================ */

const WorkspaceAvatar = ({ logoUrl, photoURL, name, email }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackLetter = useMemo(() => {
    return (name || email || "U").charAt(0).toUpperCase();
  }, [name, email]);

  const activeImage = logoUrl || photoURL;

  if (activeImage && !imgError) {
    return (
      <img
        src={activeImage}
        alt={name || "Workspace Avatar"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="h-16 w-16 rounded-xl border border-zinc-200 object-cover shadow-sm shrink-0"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-semibold text-white shadow-sm select-none">
      {fallbackLetter}
    </div>
  );
};

/* ============================================================
   SAAS WORKSPACE & USER PROFILE
============================================================ */

const Profile = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [profileAsset, setProfileAsset] = useState(null);

  const {
    assets = [],
    loading: assetsLoading,
    error: assetsError,
    getAssets,
  } = useAssets({ type: "user_profile" });

  /* ========================================================
     FIREBASE AUTH LISTENER
  ======================================================== */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /* ========================================================
     FIND USER PROFILE ASSET
  ======================================================== */

  useEffect(() => {
    if (!user || !assets) return;

    const existingProfile = assets.find((asset) => {
      const matchesType = asset.type === "user_profile" || asset.type === "user";
      const matchesEmail = asset.ownerEmail === user.email;
      const matchesUid = asset.ownerId === user.uid;

      return matchesType && (matchesEmail || matchesUid);
    });

    setProfileAsset(existingProfile || null);
  }, [user, assets]);

  const profileData = useMemo(() => profileAsset?.data || {}, [profileAsset]);

  /* ========================================================
     INITIAL DATA MEMO
  ======================================================== */

  const formInitialData = useMemo(() => {
    return {
      displayName: profileData.displayName || user?.displayName || "",
      organizationName: profileData.organizationName || "",
      phone: profileData.phone || "",
      accountType: profileData.accountType || "business",
      currency: profileData.currency || "BDT",
      website: profileData.website || "",
      logoUrl: profileData.logoUrl || "",
      taxId: profileData.taxId || "",
    };
  }, [profileData, user]);

  /* ========================================================
     LOADING STATE
  ======================================================== */

  if (authLoading || (assetsLoading && !profileAsset)) {
    return (
      <main className="min-h-screen bg-zinc-50/50 p-6">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-2.5 py-24 text-sm text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          <span>Loading SaaS tenant profile...</span>
        </div>
      </main>
    );
  }

  /* ========================================================
     UNAUTHENTICATED STATE
  ======================================================== */

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50/50 p-6">
        <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <User size={20} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-zinc-900">
            Authentication Required
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Sign in to access your tenant dashboard and account preferences.
          </p>
        </div>
      </main>
    );
  }

  /* ========================================================
     MAIN RENDER
  ======================================================== */

  return (
    <main className="min-h-screen bg-zinc-50/50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              SaaS Tenant & Profile Settings
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Manage core workspace identity, active modules, and gateway preferences.
            </p>
          </div>
        </div>

        {/* Global Fetch Error Banner */}
        {assetsError && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>
                {assetsError.message || "Failed to sync profile information."}
              </span>
            </div>
            {getAssets && (
              <button
                type="button"
                onClick={() => getAssets()}
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        {/* ============================================================
            1. AUTHENTICATED CREDENTIALS & LOGO CARD
        ============================================================ */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <span className="text-xs font-semibold text-zinc-700">
              System Admin Credentials
            </span>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <WorkspaceAvatar
                logoUrl={profileData.logoUrl}
                photoURL={user.photoURL}
                name={profileData.organizationName || profileData.displayName || user.displayName}
                email={user.email}
              />

              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  {profileData.organizationName || profileData.displayName || user.displayName || "Workspace Owner"}
                </h2>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 sm:self-center">
              <ShieldCheck size={13} />
              <span>Verified Account</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 border-t border-zinc-100">
            <ProfileRow
              icon={<Mail size={14} />}
              label="Admin Email"
              value={user.email}
            />
            <ProfileRow
              icon={<Key size={14} />}
              label="Tenant / Owner UID"
              value={user.uid}
              mono={true}
            />
          </div>
        </section>

        {/* ============================================================
            2. APPLICATION & TENANT METADATA CARD
        ============================================================ */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <div>
              <h2 className="text-xs font-semibold text-zinc-700">
                Workspace Configuration & Branding
              </h2>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                {profileAsset
                  ? "Global settings driving your frontend navigation, invoices, and gateway identity."
                  : "Complete your workspace setup to unlock system modules."}
              </p>
            </div>

            {profileAsset && !showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                <Edit3 size={13} />
                <span>Edit Workspace</span>
              </button>
            )}
          </div>

          {/* VIEW: Existing Profile */}
          {profileAsset && !showForm && (
            <div className="divide-y divide-zinc-100">
              <ProfileRow
                icon={<User size={14} />}
                label="Admin Full Name"
                value={profileData.displayName}
              />
              <ProfileRow
                icon={<Building2 size={14} />}
                label="Organization / Brand"
                value={profileData.organizationName}
              />
              <ProfileRow
                icon={<ImageIcon size={14} />}
                label="Workspace Logo"
                value={
                  profileData.logoUrl ? (
                    <img
                      src={profileData.logoUrl}
                      alt="Brand Logo"
                      className="h-8 w-auto rounded border border-zinc-200 object-contain"
                    />
                  ) : (
                    "No custom logo uploaded"
                  )
                }
              />
              <ProfileRow
                icon={<Phone size={14} />}
                label="Phone Number"
                value={profileData.phone}
              />
              <ProfileRow
                icon={<CreditCard size={14} />}
                label="Primary Currency"
                value={profileData.currency || "BDT"}
              />
              <ProfileRow
                icon={<Globe size={14} />}
                label="Website URL"
                value={profileData.website}
              />
              <ProfileRow
                icon={<BadgeCheck size={14} />}
                label="Workspace Type"
                value={
                  profileData.accountType ? (
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                        ACCOUNT_TYPE_MAP[profileData.accountType]?.color ||
                        "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }`}
                    >
                      {ACCOUNT_TYPE_MAP[profileData.accountType]?.label ||
                        profileData.accountType}
                    </span>
                  ) : null
                }
              />
              <ProfileRow
                icon={<Layers size={14} />}
                label="Tax / BIN Number"
                value={profileData.taxId || "Not Configured"}
              />
            </div>
          )}

          {/* VIEW: No Profile Found Prompt */}
          {!profileAsset && !showForm && (
            <div className="p-8 text-center">
              <p className="text-xs leading-relaxed text-zinc-500">
                No workspace asset detected. Initialize your profile to set up your primary database tenant record.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-zinc-800"
              >
                <Plus size={14} />
                <span>Initialize Workspace Profile</span>
              </button>
            </div>
          )}

          {/* VIEW: Form Editor using UniversalDataCollectionTemplate */}
          {showForm && (
            <div className="p-2 sm:p-4">
              <UniversalDataCollectionTemplate
                title={profileAsset ? "Edit Workspace Details" : "Initialize Workspace"}
                description="Upload brand media, update business identity, and currency defaults."
                type="user_profile"
                fields={PROFILE_FIELDS}
                initialData={formInitialData}
                assetId={profileAsset?.id || profileAsset?._id || null}
                redirectTo={null}
                onSuccessCallback={(result) => {
                  setProfileAsset(result);
                  setShowForm(false);
                }}
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

/* ============================================================
   PROFILE ROW HELPER
============================================================ */

const ProfileRow = ({ icon, label, value, mono = false }) => {
  return (
    <div className="flex flex-col gap-1.5 px-6 py-3.5 sm:flex-row sm:items-center">
      <div className="flex w-48 shrink-0 items-center gap-2 text-xs font-medium text-zinc-500">
        {icon && <span className="text-zinc-400">{icon}</span>}
        <span>{label}</span>
      </div>

      <div
        className={`break-all text-xs font-medium text-zinc-800 ${
          mono ? "font-mono text-zinc-600" : ""
        }`}
      >
        {value || <span className="text-zinc-400">—</span>}
      </div>
    </div>
  );
};

export default Profile;