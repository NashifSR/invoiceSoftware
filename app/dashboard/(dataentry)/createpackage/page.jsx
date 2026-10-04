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
        name: "amount",
        label: "Amount",
        type: "number",
        required: true,
        min: 0,
        placeholder: "Enter subscription price...",
      },
    ],
    []
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <UniversalDataCollectionTemplate
        title="Create Subscription Package"
        description="Set up a new subscription tier for schools, pricing terms, and limits."
        type="package"
        business="school"
        fields={fields}
      />
    </div>
  );
};

export default CreatePackage;