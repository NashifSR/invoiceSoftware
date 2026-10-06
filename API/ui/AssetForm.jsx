"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Loader2, Upload, FileText, X, AlertCircle } from "lucide-react";
import useAssets from "@/API/useAssets";

const getInitialValues = (fields, initialValues) => {
  const values = {};

  fields.forEach((field) => {
    const rawVal =
      initialValues?.[field.name] ?? field.defaultValue ?? field.value ?? "";

    values[field.name] =
      field.type === "number" && rawVal !== "" ? Number(rawVal) : rawVal;
  });

  return values;
};

const AssetForm = ({
  fields = [],
  initialValues = {},
  assetId = null,
  metadata = {},
  submitLabel,
  cancelLabel = "Cancel",
  onSuccess,
  onCancel,
}) => {
  const { createAsset, updateAsset, loading, error } = useAssets();

  console.group("inside asset form", fields)
  console.groupEnd()

  const [formData, setFormData] = useState(() =>
    getInitialValues(fields, initialValues)
  );

  const [files, setFiles] = useState({});

  // Reset form values if props change
  const initialValuesKey = useMemo(
    () => JSON.stringify(initialValues),
    [initialValues]
  );
  const fieldsKey = useMemo(() => JSON.stringify(fields), [fields]);

  useEffect(() => {
    setFormData(getInitialValues(fields, initialValues));
    setFiles({});
  }, [assetId, fieldsKey, initialValuesKey]);

  // ============================================================
  // FIELD CHANGE HANDLER
  // ============================================================

  const handleChange = useCallback((name, value, type) => {
    setFormData((current) => ({
      ...current,
      [name]:
        type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  }, []);

  // ============================================================
  // FILE CHANGE HANDLER
  // ============================================================

  const handleFileChange = useCallback((name, selectedFiles) => {
    setFiles((current) => ({
      ...current,
      [name]: Array.from(selectedFiles || []),
    }));
  }, []);

  const handleRemoveFile = useCallback((fieldName, fileIndex) => {
    setFiles((current) => ({
      ...current,
      [fieldName]: current[fieldName]?.filter((_, idx) => idx !== fileIndex),
    }));
  }, []);

  // ============================================================
  // SUBMIT HANDLER
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...metadata,
        data: {
          ...formData,
        },
      };

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(payload));

      Object.entries(files).forEach(([fieldName, selectedFiles]) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        selectedFiles.forEach((file) => {
          formDataToSend.append(fieldName, file);
        });
      });

      let result;

      if (!assetId) {
        result = await createAsset(formDataToSend);
      } else {
        result = await updateAsset(assetId, formDataToSend);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error("Form submission failed:", err);
    }
  };

  // ============================================================
  // RENDER FIELD
  // ============================================================

  const renderField = (field) => {
    const {
      name,
      label,
      type = "text",
      placeholder = `Enter ${label.toLowerCase()}...`,
      required = false,
      options = [],
      disabled = false,
      rows = 4,
      multiple = false,
      accept = "image/*",
      min,
      max,
      step,
    } = field;

    const value = formData[name] ?? "";
    const isDisabled = disabled || loading;

    const inputClasses =
      "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition duration-150 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

    // File / Image Input
    if (type === "image" || type === "file") {
      const selectedFiles = files[name] || [];

      return (
        <div className="space-y-3">
          <label className="relative flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 p-4 text-center transition hover:bg-zinc-100/50">
            <Upload className="mb-2 h-5 w-5 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-700">
              Click to upload {type === "image" ? "image" : "file"}
            </span>
            <span className="mt-0.5 text-[11px] text-zinc-500">
              {multiple ? "Select single or multiple files" : "Select a single file"}
            </span>

            <input
              id={name}
              name={name}
              type="file"
              accept={accept}
              multiple={multiple}
              disabled={isDisabled}
              required={required && !value && selectedFiles.length === 0}
              onChange={(e) => handleFileChange(name, e.target.files)}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="space-y-1.5">
              {selectedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between rounded-md border border-zinc-200 bg-white p-2 text-xs text-zinc-700"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 shrink-0 text-zinc-400" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(name, idx)}
                    className="ml-2 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Select Input
    if (type === "select") {
      return (
        <select
          id={name}
          name={name}
          value={value}
          disabled={isDisabled}
          required={required}
          onChange={(e) => handleChange(name, e.target.value, type)}
          className={inputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((option) => {
            const optVal =
              typeof option === "object" ? option.value : option;
            const optLbl =
              typeof option === "object" ? option.label : option;

            return (
              <option key={optVal} value={optVal}>
                {optLbl}
              </option>
            );
          })}
        </select>
      );
    }

    // Textarea Input
    if (type === "textarea") {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          rows={rows}
          placeholder={placeholder}
          disabled={isDisabled}
          required={required}
          onChange={(e) => handleChange(name, e.target.value, type)}
          className={inputClasses}
        />
      );
    }

    // Checkbox Input
    if (type === "checkbox") {
      return (
        <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-zinc-700">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={Boolean(value)}
            disabled={isDisabled}
            onChange={(e) => handleChange(name, e.target.checked, type)}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
          />
          <span className="font-medium text-zinc-800">{label}</span>
        </label>
      );
    }

    // Default Input (Text, Number, Date, etc.)
    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={isDisabled}
        required={required}
        onChange={(e) => handleChange(name, e.target.value, type)}
        className={inputClasses}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
          <span>
            {error?.response?.data?.error ||
              error?.message ||
              "Something went wrong while saving."}
          </span>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          {field.type !== "checkbox" && (
            <label
              htmlFor={field.name}
              className="block text-xs font-semibold text-zinc-700 tracking-tight"
            >
              {field.label}
              {field.required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
          )}

          {renderField(field)}
        </div>
      ))}

      <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          <span>
            {loading
              ? "Saving..."
              : submitLabel || (assetId ? "Update Record" : "Create Record")}
          </span>
        </button>
      </div>
    </form>
  );
};

export default AssetForm;