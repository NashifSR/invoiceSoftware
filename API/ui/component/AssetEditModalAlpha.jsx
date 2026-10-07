"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2, Save, Check, Loader2, AlertCircle, User, MapPin, Wifi } from "lucide-react";

const AssetEditModalAlpha = ({
  selectedAsset,
  onClose,
  editableData,
  setEditableData,
  onUpdate,
  onDelete,
  saving,
  saveError,
  saveSuccess,
  setSaveError,
  setSaveSuccess,
}) => {
  // Local form state mapped to structured ISP data fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationalId: "",
    street: "",
    area: "",
    district: "",
    packageId: "pkg_01",
    connectionType: "PPPoE",
    username: "",
    ipAddress: "",
    macAddress: "",
    status: "active",
  });

  // When selectedAsset changes, safely parse and populate form fields from pre-existing data
  useEffect(() => {
    if (!selectedAsset) return;

    try {
      const d = typeof selectedAsset.data === "string" 
        ? JSON.parse(selectedAsset.data) 
        : (selectedAsset.data || {});

      const personal = d.client?.personalInfo || {};
      const address = d.client?.installationAddress || {};
      const sub = d.client?.subscription || {};

      setFormData({
        fullName: personal.fullName || "",
        email: personal.email || "",
        phone: personal.phone || "",
        nationalId: personal.nationalId || "",
        street: address.street || "",
        area: address.area || "",
        district: address.district || "",
        packageId: sub.packageId || d.package?.packageId || "pkg_01",
        connectionType: sub.connectionType || "PPPoE",
        username: sub.username || "",
        ipAddress: sub.ipAddress || "",
        macAddress: sub.macAddress || "",
        status: sub.status || "active",
      });
    } catch (err) {
      console.error("Failed to parse pre-existing asset data:", err);
    }
  }, [selectedAsset]);

  // Whenever local form fields change, sync them back into editableData (JSON string) for parent component compatibility
  useEffect(() => {
    if (!selectedAsset) return;

    const existingData = typeof selectedAsset.data === "string" 
      ? JSON.parse(selectedAsset.data || "{}") 
      : (selectedAsset.data || {});

    const updatedPayload = {
      ...existingData,
      client: {
        ...(existingData.client || {}),
        personalInfo: {
          ...(existingData.client?.personalInfo || {}),
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          nationalId: formData.nationalId,
        },
        installationAddress: {
          ...(existingData.client?.installationAddress || {}),
          street: formData.street,
          area: formData.area,
          district: formData.district,
        },
        subscription: {
          ...(existingData.client?.subscription || {}),
          packageId: formData.packageId,
          connectionType: formData.connectionType,
          username: formData.username,
          ipAddress: formData.ipAddress,
          macAddress: formData.macAddress,
          status: formData.status,
        },
      },
      package: {
        ...(existingData.package || {}),
        packageId: formData.packageId,
        packageName: formData.packageId === "pkg_01" ? "10 Mbps Unlimited" : formData.packageId === "pkg_02" ? "20 Mbps Fiber" : "50 Mbps Enterprise",
        speedMbps: formData.packageId === "pkg_01" ? 10 : formData.packageId === "pkg_02" ? 20 : 50,
        priceBdt: formData.packageId === "pkg_01" ? 1000 : formData.packageId === "pkg_02" ? 1500 : 3000,
      }
    };

    setEditableData(JSON.stringify(updatedPayload, null, 2));
  }, [formData, selectedAsset, setEditableData]);

  // Listen for 'Escape' key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedAsset && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAsset, onClose, saving]);

  if (!selectedAsset) return null;

  const recordId = selectedAsset.id || selectedAsset._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (saveError) setSaveError(null);
    if (saveSuccess) setSaveSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Edit Client Record ({selectedAsset.type || "Consumer"})
            </h3>
            <p className="mt-0.5 font-mono text-xs text-zinc-400">
              ID: {recordId || "—"}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Structured Form UI */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Section 1: Personal Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <User size={14} className="text-zinc-400" />
              <span>Personal Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">National ID</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Installation Address */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <MapPin size={14} className="text-zinc-400" />
              <span>Installation Address</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-zinc-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Area / Neighborhood</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-700 mb-1">District / City</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Subscription & Network */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <Wifi size={14} className="text-zinc-400" />
              <span>Subscription & Provisioning</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Package Plan</label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                >
                  <option value="pkg_01">10 Mbps Unlimited (BDT 1,000)</option>
                  <option value="pkg_02">20 Mbps Fiber (BDT 1,500)</option>
                  <option value="pkg_03">50 Mbps Enterprise (BDT 3,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Connection Type</label>
                <select
                  name="connectionType"
                  value={formData.connectionType}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                >
                  <option value="PPPoE">PPPoE</option>
                  <option value="Static IP">Static IP</option>
                  <option value="Hotspot">Hotspot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">PPPoE Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Assigned IP Address</label>
                <input
                  type="text"
                  name="ipAddress"
                  value={formData.ipAddress}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">CPE MAC Address</label>
                <input
                  type="text"
                  name="macAddress"
                  value={formData.macAddress}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-mono text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Account Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:opacity-60 capitalize"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending Installation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Validation or API Error Banner */}
          {saveError && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <span>{saveError}</span>
            </div>
          )}
        </div>

        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50 px-6 py-2.5 text-xs text-emerald-700">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200">
              <Check size={11} className="text-emerald-800" />
            </span>
            <span>Client record updated successfully.</span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/50 px-6 py-3.5">
          <button
            type="button"
            disabled={saving}
            onClick={(e) => onDelete(recordId, e)}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={onUpdate}
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetEditModalAlpha;