"use client";

import { AuthContext } from "@/Auth/context/AuthContext";
import axios from "axios";
import {
    useState,
    useEffect,
    useContext,
    useCallback,
} from "react";

const useAssets = ({ type } = {}) => {
    const {
        user,
        loading: authLoading,
    } = useContext(AuthContext);

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL =
        "https://myunifiedserver.onrender.com/api/assets/data";

    // =========================================================
    // CURRENT USER
    // =========================================================


    const currentUserEmail =
        user?.email
            ?.toLowerCase()
            .trim() || null;

    // =========================================================
    // ASSET ID
    // =========================================================

    const getAssetId = useCallback(
        (asset) => {
            if (!asset) return null;

            return (
                asset.id ||
                asset._id ||
                null
            );
        },
        []
    );

    // =========================================================
    // GET ALL ASSETS
    // =========================================================

    const getAssets = useCallback(
        async () => {
            if (!currentUserEmail) {
                setAssets([]);
                return [];
            }

            try {
                setLoading(true);
                setError(null);

                const response =
                    await axios.get(
                        API_URL,
                        {
                            params: {
                                email:
                                    currentUserEmail,
                                ...(type
                                    ? { type }
                                    : {}),
                            },
                        }
                    );

                const serverAssets =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : [];

                setAssets(serverAssets);

                return serverAssets;
            } catch (err) {
                console.error(
                    "GET ASSETS ERROR:",
                    err
                );

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [
            currentUserEmail,
            type,
        ]
    );

    // =========================================================
    // GET ONE ASSET
    // =========================================================

    const getAsset = useCallback(
        async (id) => {
            if (!currentUserEmail) {
                throw new Error(
                    "Cannot get asset: No user logged in."
                );
            }

            if (!id) {
                throw new Error(
                    "Cannot get asset: Asset ID is required."
                );
            }

            try {
                setLoading(true);
                setError(null);

                const response =
                    await axios.get(
                        `${API_URL}/${id}`,
                        {
                            params: {
                                email:
                                    currentUserEmail,
                                ...(type
                                    ? { type }
                                    : {}),
                            },
                        }
                    );

                const asset =
                    response.data;

                if (!asset) {
                    throw new Error(
                        "Asset not found."
                    );
                }

                setAssets((prev) => {
                    const exists =
                        prev.some(
                            (item) =>
                                getAssetId(
                                    item
                                ) === id
                        );

                    if (exists) {
                        return prev.map(
                            (item) =>
                                getAssetId(
                                    item
                                ) === id
                                    ? asset
                                    : item
                        );
                    }

                    return [
                        asset,
                        ...prev,
                    ];
                });

                return asset;
            } catch (err) {
                console.error(
                    "GET ASSET ERROR:",
                    err
                );

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [
            currentUserEmail,
            type,
            getAssetId,
        ]
    );

    // =========================================================
    // CREATE ASSET
    // =========================================================
    //
    // AssetForm creates the complete FormData.
    //
    // useAssets simply sends the FormData.
    // =========================================================

    const createAsset = useCallback(
        async (formData) => {
            if (
                !(formData instanceof FormData)
            ) {
                throw new Error(
                    "Cannot create asset: FormData is required."
                );
            }

            try {
                setLoading(true);
                setError(null);

                const response =
                    await axios.post(
                        API_URL,
                        formData
                    );

                const newAsset =
                    response.data;

                setAssets((prev) => [
                    newAsset,
                    ...prev,
                ]);

                return newAsset;
            } catch (err) {
                console.error(
                    "CREATE ASSET ERROR:",
                    err
                );

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // =========================================================
    // UPDATE ASSET
    // =========================================================

    const updateAsset = useCallback(
        async (id, formData) => {
            if (!currentUserEmail) {
                throw new Error(
                    "Cannot update asset: No user logged in."
                );
            }

            if (!id) {
                throw new Error(
                    "Cannot update asset: Asset ID is required."
                );
            }

            if (
                !(formData instanceof FormData)
            ) {
                throw new Error(
                    "Cannot update asset: FormData is required."
                );
            }

            try {
                setLoading(true);
                setError(null);

                const response =
                    await axios.patch(
                        `${API_URL}/${id}`,
                        formData,
                        {
                            params: {
                                email:
                                    currentUserEmail,
                            },
                        }
                    );

                const updatedAsset =
                    response.data;

                setAssets((prev) =>
                    prev.map((item) =>
                        getAssetId(
                            item
                        ) === id
                            ? updatedAsset
                            : item
                    )
                );

                return updatedAsset;
            } catch (err) {
                console.error(
                    "UPDATE ASSET ERROR:",
                    err
                );

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [
            currentUserEmail,
            getAssetId,
        ]
    );

    // =========================================================
    // DELETE ASSET
    // =========================================================

    const deleteAsset = useCallback(
        async (id) => {
            if (!currentUserEmail) {
                throw new Error(
                    "Cannot delete asset: No user logged in."
                );
            }

            if (!id) {
                throw new Error(
                    "Cannot delete asset: Asset ID is required."
                );
            }

            try {
                setLoading(true);
                setError(null);

                await axios.delete(
                    `${API_URL}/${id}`,
                    {
                        params: {
                            email:
                                currentUserEmail,
                        },
                    }
                );

                setAssets((prev) =>
                    prev.filter(
                        (item) =>
                            getAssetId(
                                item
                            ) !== id
                    )
                );

                return true;
            } catch (err) {
                console.error(
                    "DELETE ASSET ERROR:",
                    err
                );

                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [
            currentUserEmail,
            getAssetId,
        ]
    );

    // =========================================================
    // INITIAL FETCH
    // =========================================================

    useEffect(() => {
        if (
            !authLoading &&
            currentUserEmail
        ) {
            getAssets();
        }
    }, [
        authLoading,
        currentUserEmail,
        getAssets,
    ]);

    // =========================================================
    // RETURN
    // =========================================================

    return {
        assets,

        loading:
            loading ||
            authLoading,

        error,

        getAssets,
        getAsset,
        createAsset,
        updateAsset,
        deleteAsset,
    };
};

export default useAssets;