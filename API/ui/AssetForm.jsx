"use client";

import { useEffect, useState, useCallback } from "react";
import useAssets from "@/API/useAssets";

const getInitialValues = (fields, initialValues) => {
    const values = {};

    fields.forEach((field) => {
        values[field.name] =
            initialValues?.[field.name] ??
            field.value ??
            "";
    });

    return values;
};

const AssetForm = ({
    fields = [],
    initialValues = {},
    assetId = null,

    // Metadata comes from the parent template.
    metadata = {},

    submitLabel,
    cancelLabel = "Cancel",
    onSuccess,
    onCancel,
}) => {
    const {
        createAsset,
        updateAsset,
        loading,
        error,
    } = useAssets();

    const [formData, setFormData] = useState(() =>
        getInitialValues(fields, initialValues)
    );

    const [files, setFiles] = useState({});

    useEffect(() => {
        setFormData(
            getInitialValues(
                fields,
                initialValues
            )
        );

        setFiles({});
    }, [
        assetId,
        fields,
        initialValues,
    ]);

    // ============================================================
    // NORMAL FIELD CHANGE
    // ============================================================

    const handleChange = useCallback(
        (name, value) => {
            setFormData((current) => ({
                ...current,
                [name]: value,
            }));
        },
        []
    );

    // ============================================================
    // FILE CHANGE
    // ============================================================

    const handleFileChange = useCallback(
        (name, selectedFiles) => {
            setFiles((current) => ({
                ...current,
                [name]: selectedFiles,
            }));
        },
        []
    );

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            /*
             * The template owns the metadata.
             *
             * The form owns the data.
             *
             * AssetForm simply combines them.
             */
            const payload = {
                ...metadata,

                data: {
                    ...formData,
                },
            };

            const formDataToSend = new FormData();

            /*
             * Complete asset payload.
             */
            formDataToSend.append(
                "data",
                JSON.stringify(payload)
            );

            /*
             * Files are added separately to multipart FormData.
             */
            Object.entries(files).forEach(
                ([fieldName, selectedFiles]) => {
                    if (
                        !selectedFiles ||
                        selectedFiles.length === 0
                    ) {
                        return;
                    }

                    Array.from(
                        selectedFiles
                    ).forEach((file) => {
                        formDataToSend.append(
                            fieldName,
                            file
                        );
                    });
                }
            );

            let result;

            if (!assetId) {
                result = await createAsset(
                    formDataToSend
                );
            } else {
                result = await updateAsset(
                    assetId,
                    formDataToSend
                );
            }

            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err) {
            console.error(
                "Form submission failed:",
                err
            );
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
            placeholder = `Enter ${label}`,
            required = false,
            options = [],
            disabled = false,
            rows = 4,
            multiple = false,
            accept = "image/*",
        } = field;

        const value =
            formData[name] ?? "";

        const isDisabled =
            disabled ||
            loading;

        // ========================================================
        // IMAGE / FILE
        // ========================================================

        if (type === "image") {
            const selectedFiles =
                files[name];

            return (
                <div className="space-y-2">
                    <input
                        id={name}
                        name={name}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        disabled={isDisabled}
                        required={
                            required &&
                            !value
                        }
                        onChange={(event) => {
                            handleFileChange(
                                name,
                                event.target.files
                            );
                        }}
                        className="block w-full cursor-pointer border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-100"
                    />

                    {selectedFiles?.length >
                        0 && (
                        <p className="text-xs text-zinc-500">
                            {
                                selectedFiles.length
                            }{" "}
                            {selectedFiles.length ===
                            1
                                ? "file"
                                : "files"}{" "}
                            selected
                        </p>
                    )}
                </div>
            );
        }

        // ========================================================
        // COMMON INPUT PROPS
        // ========================================================

        const commonProps = {
            id: name,
            name,
            value,
            disabled: isDisabled,
            required,
            placeholder,
            onChange: (event) =>
                handleChange(
                    name,
                    event.target.value
                ),
            className:
                "w-full border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 disabled:bg-zinc-100 disabled:text-zinc-500",
        };

        // ========================================================
        // SELECT
        // ========================================================

        if (type === "select") {
            return (
                <select {...commonProps}>
                    <option value="">
                        Select {label}
                    </option>

                    {options.map(
                        (option) => {
                            const optionValue =
                                typeof option ===
                                "object"
                                    ? option.value
                                    : option;

                            const optionLabel =
                                typeof option ===
                                "object"
                                    ? option.label
                                    : option;

                            return (
                                <option
                                    key={
                                        optionValue
                                    }
                                    value={
                                        optionValue
                                    }
                                >
                                    {
                                        optionLabel
                                    }
                                </option>
                            );
                        }
                    )}
                </select>
            );
        }

        // ========================================================
        // TEXTAREA
        // ========================================================

        if (type === "textarea") {
            return (
                <textarea
                    {...commonProps}
                    rows={rows}
                />
            );
        }

        // ========================================================
        // CHECKBOX
        // ========================================================

        if (type === "checkbox") {
            return (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={Boolean(
                            value
                        )}
                        disabled={
                            isDisabled
                        }
                        onChange={(event) =>
                            handleChange(
                                name,
                                event.target
                                    .checked
                            )
                        }
                    />

                    {label}
                </label>
            );
        }

        // ========================================================
        // NORMAL INPUT
        // ========================================================

        return (
            <input
                {...commonProps}
                type={type}
            />
        );
    };

    // ============================================================
    // RENDER
    // ============================================================

    const isSaving = loading;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error?.response
                        ?.data?.error ||
                        error?.message ||
                        "Something went wrong."}
                </div>
            )}

            {fields.map((field) => (
                <div
                    key={field.name}
                    className="space-y-1.5"
                >
                    {field.type !==
                        "checkbox" && (
                        <label
                            htmlFor={
                                field.name
                            }
                            className="block text-sm font-medium text-zinc-700"
                        >
                            {field.label}

                            {field.required && (
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            )}
                        </label>
                    )}

                    {renderField(field)}
                </div>
            ))}

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-5">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : submitLabel ||
                          (assetId
                              ? "Update"
                              : "Create")}
                </button>
            </div>
        </form>
    );
};

export default AssetForm;