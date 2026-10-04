"use client";

import { useState } from "react";
import AssetManager from "@/API/ui/AssetManager";

const ManageSubscription = () => {

    return (
        <div>

            <AssetManager
                type="package"
                title="Manage Package"
            />
        </div>
    );
};

export default ManageSubscription;