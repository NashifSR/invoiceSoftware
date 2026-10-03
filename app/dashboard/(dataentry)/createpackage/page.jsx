"use client";

import React, { useMemo } from "react";
import UniversalDataCollectionTemplate from "@/API/ui/UniversalDataCollectionTemplate";

const CreatePackage = () => {
  const fields = useMemo(
    () => [
      {
        name: "name",
        label: "Package Name",
        type: "text",
        required: true,
        placeholder: "e.g. Standard School Plan, Premium Campus",
      },
      {
        name: "code",
        label: "Package Code / SKU",
        type: "text",
        required: false,
        placeholder: "e.g. SCH-PREM-001",
      },
      {
        name: "price",
        label: "Price",
        type: "number",
        required: true,
        min: 0,
        placeholder: "Enter subscription price...",
      },
      {
        name: "billingCycle",
        label: "Billing Cycle",
        type: "select",
        required: true,
        defaultValue: "monthly",
        options: [
          { label: "Monthly", value: "monthly" },
          { label: "Quarterly", value: "quarterly" },
          { label: "Semi-Annually", value: "semi_annual" },
          { label: "Yearly", value: "yearly" },
          { label: "One-Time", value: "one_time" },
        ],
      },
      {
        name: "trialDays",
        label: "Trial Period (Days)",
        type: "number",
        required: false,
        min: 0,
        defaultValue: 0,
        placeholder: "0 for no trial",
      },
      {
        name: "maxStudents",
        label: "Max Students Included",
        type: "number",
        required: false,
        placeholder: "e.g. 500 (Leave empty for unlimited)",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        defaultValue: "active",
        options: [
          { label: "Active", value: "active" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ],
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: false,
        rows: 3,
        placeholder: "Write a short summary of what this plan includes...",
      },
      {
        name: "features",
        label: "Included Features",
        type: "textarea",
        required: false,
        rows: 4,
        placeholder: "Enter feature points separated by line breaks...",
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <UniversalDataCollectionTemplate
        title="Create Subscription Package"
        description="Set up a new subscription tier for schools, pricing terms, and limits."
        type="subscription"
        businessType="school"
        fields={fields}
      />
    </div>
  );
};

export default CreatePackage;