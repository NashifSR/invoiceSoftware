"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/Auth/lib/firebase";
import useAssets from "@/API/useAssets";
import AssetForm from "@/API/ui/AssetForm";


/* ============================================================
   PROFILE FIELDS

   These are the actual fields stored inside:

   asset.data

   The user does NOT enter:
   ownerEmail
   ownerId
   type

   Those are handled by the application.
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
        label: "Phone",
        type: "tel",
        placeholder: "Enter your phone number",
    },

    {
        name: "businessType",
        label: "Account Type",
        type: "select",
        options: [
            {
                value: "school",
                label: "School",
            },
            {
                value: "training_center",
                label: "Training Center",
            },
            {
                value: "business",
                label: "Business",
            },
            {
                value: "individual",
                label: "Individual",
            },
        ],
        required: true,
    },
];


/* ============================================================
   PROFILE
============================================================ */

const Profile = () => {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [profileAsset, setProfileAsset] = useState(null);

    const {
        assets,
        loading,
        error,
        createAsset,
        getAssets,
    } = useAssets();


    /* ========================================================
       FIREBASE USER
    ======================================================== */

    useEffect(() => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {

                    setUser(currentUser);
                    setAuthLoading(false);

                }
            );

        return unsubscribe;

    }, []);


    /* ========================================================
       FIND USER PROFILE ASSET
       
       A user's profile is simply an asset where:

       type === "user"

       and

       ownerEmail === logged-in user's email
       
       Later we can make this stricter with ownerId.
    ======================================================== */

    useEffect(() => {

        if (!user || !assets) {
            return;
        }

        const existingProfile =
            assets.find(
                (asset) =>
                    asset.type === "user" &&
                    (
                        asset.ownerEmail ===
                        user.email
                    )
            );

        setProfileAsset(
            existingProfile || null
        );

    }, [user, assets]);


    /* ========================================================
       LOADING
    ======================================================== */

    if (authLoading) {

        return (
            <main className="min-h-screen bg-zinc-50 p-6">

                <div className="mx-auto max-w-4xl">

                    <p className="text-sm text-zinc-500">
                        Loading...
                    </p>

                </div>

            </main>
        );
    }


    /* ========================================================
       NOT LOGGED IN
    ======================================================== */

    if (!user) {

        return (
            <main className="min-h-screen bg-zinc-50 p-6">

                <div className="mx-auto max-w-4xl">

                    <p className="text-sm text-zinc-500">
                        You are not logged in.
                    </p>

                </div>

            </main>
        );
    }


    /* ========================================================
       CREATE PROFILE
    ======================================================== */

    const handleCreateProfile =
        async (formData) => {

            const result =
                await createAsset({

                    /*
                     * Application metadata.
                     */

                    type: "user",

                    /*
                     * This can represent the
                     * user's selected account/business
                     * category.
                     */

                    businessType:
                        formData.businessType ||
                        "individual",

                    /*
                     * The creator automatically
                     * receives access.
                     */

                    access: [
                        {
                            email: user.email,
                            role: "owner",
                        },
                    ],

                    /*
                     * Actual profile information.
                     */

                    data: {
                        name:
                            formData.name,

                        phone:
                            formData.phone,

                        businessType:
                            formData.businessType,
                    },
                });

            setProfileAsset(result);
            setShowForm(false);

            return result;
        };


    /* ========================================================
       PROFILE DATA
    ======================================================== */

    const profileData =
        profileAsset?.data || {};


    /* ========================================================
       RENDER
    ======================================================== */

    return (
        <main className="min-h-screen bg-zinc-50 p-6">

            <div className="mx-auto max-w-4xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">

                    <h1 className="text-xl font-semibold text-zinc-900">
                        Profile
                    </h1>

                    <p className="mt-1 text-sm text-zinc-500">
                        Manage your application profile.
                    </p>

                </div>


                {/* ==================================================
                    FIREBASE ACCOUNT
                ================================================== */}

                <div className="border border-zinc-200 bg-white">

                    <div className="flex items-center gap-4 border-b border-zinc-200 px-5 py-5">

                        {/* Avatar */}

                        {user.photoURL ? (

                            <img
                                src={user.photoURL}
                                alt={
                                    user.displayName ||
                                    "Profile"
                                }
                                className="h-14 w-14 rounded-full"
                            />

                        ) : (

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-600">

                                {
                                    (
                                        user.displayName ||
                                        user.email ||
                                        "?"
                                    )
                                        .charAt(0)
                                        .toUpperCase()
                                }

                            </div>

                        )}


                        {/* User */}

                        <div>

                            <h2 className="text-base font-semibold text-zinc-900">

                                {
                                    user.displayName ||
                                    "No name set"
                                }

                            </h2>

                            <p className="text-sm text-zinc-500">
                                {user.email}
                            </p>

                        </div>

                    </div>


                    {/* Firebase information */}

                    <div className="divide-y divide-zinc-100">

                        <ProfileRow
                            label="Name"
                            value={
                                user.displayName ||
                                "Not set"
                            }
                        />

                        <ProfileRow
                            label="Email"
                            value={
                                user.email
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    APPLICATION PROFILE
                ================================================== */}

                <div className="mt-6 border border-zinc-200 bg-white">

                    {/* Header */}

                    <div className="border-b border-zinc-200 px-5 py-5">

                        <h2 className="text-sm font-semibold text-zinc-900">
                            Application Profile
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">

                            {profileAsset
                                ? "Your application profile."
                                : "Complete your profile to use the application."}

                        </p>

                    </div>


                    {/* ==================================================
                        EXISTING PROFILE
                    ================================================== */}

                    {profileAsset && !showForm && (

                        <div className="divide-y divide-zinc-100">

                            <ProfileRow
                                label="Name"
                                value={
                                    profileData.name
                                }
                            />

                            <ProfileRow
                                label="Phone"
                                value={
                                    profileData.phone
                                }
                            />

                            <ProfileRow
                                label="Account Type"
                                value={
                                    profileData.businessType
                                }
                            />


                            {/* Update button */}

                            <div className="px-5 py-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowForm(true)
                                    }
                                    className="border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                                >
                                    Update Profile
                                </button>

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        NO PROFILE
                    ================================================== */}

                    {!profileAsset && !showForm && (

                        <div className="px-5 py-5">

                            <p className="text-sm text-zinc-500">

                                You haven't created your
                                application profile yet.

                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowForm(true)
                                }
                                className="mt-4 border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                            >
                                Create Profile
                            </button>

                        </div>

                    )}


                    {/* ==================================================
                        FORM
                    ================================================== */}

                    {showForm && (

                        <div className="px-5 py-5">

                            <AssetForm
                                fields={
                                    PROFILE_FIELDS
                                }

                                initialValues={{
                                    name:
                                        profileData.name ||
                                        user.displayName ||
                                        "",

                                    phone:
                                        profileData.phone ||
                                        "",

                                    businessType:
                                        profileData.businessType ||
                                        "",
                                }}

                                assetId={
                                    profileAsset?.id ||
                                    profileAsset?._id ||
                                    null
                                }

                                onSuccess={(
                                    result
                                ) => {

                                    setProfileAsset(
                                        result
                                    );

                                    setShowForm(
                                        false
                                    );

                                }}

                                onCancel={() =>
                                    setShowForm(false)
                                }
                            />

                        </div>

                    )}

                </div>

            </div>

        </main>
    );
};


/* ============================================================
   PROFILE ROW
============================================================ */

const ProfileRow = ({
    label,
    value,
    mono = false,
}) => {

    return (
        <div className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center">

            <div className="w-40 shrink-0 text-xs font-medium text-zinc-500">
                {label}
            </div>

            <div
                className={`break-all text-sm text-zinc-800 ${
                    mono
                        ? "font-mono text-xs"
                        : ""
                }`}
            >
                {value || "—"}
            </div>

        </div>
    );
};


export default Profile;