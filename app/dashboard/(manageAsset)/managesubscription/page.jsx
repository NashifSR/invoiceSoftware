"use client";

import { useState } from "react";
import AssetManager from "@/API/ui/AssetManager";

const ManageSubscription = () => {
  return (
    <div>
      <AssetManager
        type="package"
        title="Manage Subscriptions"
      />
    </div>
  );
};

export default ManageSubscription;
