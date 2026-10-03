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
} from "lucide-react";

import { auth } from "@/Auth/lib/firebase";
import useAssets from "@/API/useAssets";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";

/* ============================================================
   PROFILE FORM FIELDS CONFIGURATION
============================================================ */

const PROFILE_FIELDS = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "businessType",
    label: "Account Type",
    type: "select",
    options: [
      { value: "school", label: "School" },
      { value: "training_center", label: "Training Center" },
      { value: "business", label: "Business" },
      { value: "individual", label: "Individual" },
    ],
    required: true,
  },
];

/* ============================================================
   ACCOUNT TYPE MAPPER (LABEL & BADGE STYLES)
============================================================ */

const ACCOUNT_TYPE_MAP = {
  school: { label: "School", color: "bg-blue-50 text-blue-700 border-blue-200" },
  training_center: { label: "Training Center", color: "bg-purple-50 text-purple-700 border-purple-200" },
  business: { label: "Business", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  individual: { label: "Individual", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
};

/* ============================================================
   AVATAR COMPONENT WITH BROKEN IMAGE FALLBACK
============================================================ */

const UserAvatar = ({ photoURL, name, email }) => {
  const [imgError, setImgError] = useState(false);

  const fallbackLetter = useMemo(() => {
    return (name || email || "?").charAt(0).toUpperCase();
  }, [name, email]);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || "Profile Avatar"}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="h-14 w-14 rounded-full border border-zinc-200 object-cover shadow-sm shrink-0"
      />
    );
  }

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-base font-semibold text-white shadow-sm select-none">
      {fallbackLetter}
    </div>
  );
};

/* ============================================================
   PROFILE COMPONENT
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
  } = useAssets({ type: "user" });

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
      const matchesType = asset.type === "user";
      const matchesEmail = asset.ownerEmail === user.email;
      const matchesUid = asset.ownerId === user.uid;
      const matchesAccess = asset.access?.some(
        (acc) => acc.email === user.email || acc.uid === user.uid
      );

      return matchesType && (matchesEmail || matchesUid || matchesAccess);
    });

    setProfileAsset(existingProfile || null);
  }, [user, assets]);

  const profileData = useMemo(() => profileAsset?.data || {}, [profileAsset]);

  /* ========================================================
      INITIAL DATA MEMO FOR UNIVERSAL TEMPLATE
  ======================================================== */

  const formInitialData = useMemo(() => {
    return {
      name: profileData.name || user?.displayName || "",
      phone: profileData.phone || "",
      businessType: profileData.businessType || "individual",
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
          <span>Loading profile information...</span>
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
            You must be logged in to view and manage your profile details.
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
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Account Profile
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Manage your personal credentials and application preferences.
          </p>
        </div>

        {/* Global Fetch Error Banner */}
        {assetsError && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>
                {assetsError.message || "Failed to sync profile data from server."}
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
            1. AUTHENTICATED FIREBASE ACCOUNT CARD
        ============================================================ */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <span className="text-xs font-semibold text-zinc-700">
              Authentication Credentials
            </span>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                photoURL={user.photoURL}
                name={user.displayName}
                email={user.email}
              />

              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  {user.displayName || "Anonymous User"}
                </h2>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 border border-emerald-200 sm:self-center">
              <ShieldCheck size={13} />
              <span>Verified Identity</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 border-t border-zinc-100">
            <ProfileRow
              icon={<User size={14} />}
              label="Display Name"
              value={user.displayName || "Not configured"}
            />
            <ProfileRow
              icon={<Mail size={14} />}
              label="Email Address"
              value={user.email}
            />
          </div>
        </section>

        {/* ============================================================
            2. APPLICATION PROFILE CARD
        ============================================================ */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <div>
              <h2 className="text-xs font-semibold text-zinc-700">
                Application Profile
              </h2>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                {profileAsset
                  ? "Your public application details and workspace roles."
                  : "Complete your profile information to proceed."}
              </p>
            </div>

            {profileAsset && !showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                <Edit3 size={13} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* VIEW: Existing Profile */}
          {profileAsset && !showForm && (
            <div className="divide-y divide-zinc-100">
              <ProfileRow
                icon={<User size={14} />}
                label="Full Name"
                value={profileData.name}
              />
              <ProfileRow
                icon={<Phone size={14} />}
                label="Phone Number"
                value={profileData.phone}
              />
              <ProfileRow
                icon={<Building2 size={14} />}
                label="Account Type"
                value={
                  profileData.businessType ? (
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${
                        ACCOUNT_TYPE_MAP[profileData.businessType]?.color ||
                        "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }`}
                    >
                      {ACCOUNT_TYPE_MAP[profileData.businessType]?.label ||
                        profileData.businessType}
                    </span>
                  ) : null
                }
              />
            </div>
          )}

          {/* VIEW: No Profile Found Prompt */}
          {!profileAsset && !showForm && (
            <div className="p-8 text-center">
              <p className="text-xs leading-relaxed text-zinc-500">
                You haven't set up an application profile asset yet. Creating one
                will grant you full access to features.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-zinc-800"
              >
                <Plus size={14} />
                <span>Create Profile</span>
              </button>
            </div>
          )}

          {/* VIEW: Form Editor using UniversalDataCollectionTemplate */}
          {showForm && (
            <div className="p-2 sm:p-4">
              <UniversalDataCollectionTemplate
                title={profileAsset ? "Edit Application Profile" : "Create Application Profile"}
                description="Update your identity and account credentials for this workspace."
                type="user"
                businessType={profileData.businessType || "individual"}
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
      <div className="flex w-44 shrink-0 items-center gap-2 text-xs font-medium text-zinc-500">
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