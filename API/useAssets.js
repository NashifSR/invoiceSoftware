"use client";

import { AuthContext } from "@/Auth/context/AuthContext";
import axios from "axios";
import { useState, useEffect, useContext, useCallback, useMemo } from "react";

const API_URL = "https://myunifiedserver.onrender.com/api/assets/data";

const useAssets = ({ type } = {}) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [businessProfileId, setBusinessProfileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUserEmail = user?.email?.toLowerCase().trim() || null;
  const getAssetId = useCallback((asset) => asset?.id || asset?._id || null, []);

  // 1. Fetch the Business Profile ID in the background if we are on a non-profile page
  useEffect(() => {
    const fetchProfileId = async () => {
      if (!currentUserEmail || type === "isp_business_profile") return;
      try {
        const res = await axios.get(API_URL, {
          params: { email: currentUserEmail, type: "isp_business_profile" },
        });
        const profiles = Array.isArray(res.data) ? res.data : [];
        if (profiles.length > 0) {
          setBusinessProfileId(getAssetId(profiles[0]));
        }
      } catch (err) {
        console.error("Failed to fetch background business profile ID:", err);
      }
    };
    if (!authLoading && currentUserEmail) {
      fetchProfileId();
    }
  }, [currentUserEmail, authLoading, type, getAssetId]);

  // Fetch all assets for the current hook type
  const getAssets = useCallback(async () => {
    if (!currentUserEmail) return setAssets([]), [];

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(API_URL, {
        params: { email: currentUserEmail, ...(type && { type }) },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setAssets(data);
      return data;
    } catch (err) {
      console.error("GET ASSETS ERROR:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, type]);

  // Create an asset (Automatically injects businessProfileId if applicable!)
  const createAsset = useCallback(async (formData) => {
    if (!currentUserEmail) throw new Error("No user logged in.");
    if (!(formData instanceof FormData)) throw new Error("FormData is required.");

    if (!formData.has("email")) {
      formData.append("email", currentUserEmail);
    }

    // AUTOMATIC METADATA INJECTION:
    // If this hook is NOT managing the business profile itself, 
    // ensure the businessProfileId is automatically baked into the payload data!
    if (type !== "isp_business_profile" && businessProfileId) {
      const existingDataEntry = formData.get("data");
      let parsedPayload = {};

      try {
        parsedPayload = existingDataEntry ? JSON.parse(existingDataEntry) : {};
      } catch (e) {
        parsedPayload = { raw: existingDataEntry };
      }

      // Handle whether backend expects { data: { ... } } or flat structure
      if (parsedPayload.data && typeof parsedPayload.data === "object") {
        parsedPayload.data.businessProfileId = businessProfileId;
      } else {
        parsedPayload.businessProfileId = businessProfileId;
      }

      formData.set("data", JSON.stringify(parsedPayload));
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(API_URL, formData);
      const newAsset = res.data;
      setAssets((prev) => [newAsset, ...prev]);
      return newAsset;
    } catch (err) {
      console.error("CREATE ASSET ERROR:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, type, businessProfileId]);

  // Update an asset
  const updateAsset = useCallback(async (id, formData) => {
    if (!currentUserEmail) throw new Error("No user logged in.");
    if (!id) throw new Error("Asset ID is required.");
    if (!(formData instanceof FormData)) throw new Error("FormData is required.");

    try {
      setLoading(true);
      setError(null);
      const res = await axios.patch(`${API_URL}/${id}`, formData, {
        params: { email: currentUserEmail },
      });
      const updated = res.data;
      setAssets((prev) => prev.map((item) => (getAssetId(item) === id ? updated : item)));
      return updated;
    } catch (err) {
      console.error("UPDATE ASSET ERROR:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, getAssetId]);

  // Delete an asset
  const deleteAsset = useCallback(async (id) => {
    if (!currentUserEmail) throw new Error("No user logged in.");
    if (!id) throw new Error("Asset ID is required.");

    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/${id}`, {
        params: { email: currentUserEmail },
      });
      setAssets((prev) => prev.filter((item) => getAssetId(item) !== id));
      return true;
    } catch (err) {
      console.error("DELETE ASSET ERROR:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, getAssetId]);

  // Initial fetch
  useEffect(() => {
    if (!authLoading && currentUserEmail) {
      getAssets();
    }
  }, [authLoading, currentUserEmail, getAssets]);

  // Derive active profile for business profile page specifically
  const activeProfile = useMemo(() => (type === "isp_business_profile" ? assets[0] || null : null), [assets, type]);
  const profileId = useMemo(() => (type === "isp_business_profile" ? getAssetId(activeProfile) : businessProfileId), [activeProfile, businessProfileId, type, getAssetId]);

  return {
    assets,
    activeProfile,
    profileId,
    loading: loading || authLoading,
    error,
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
  };
};

export default useAssets;