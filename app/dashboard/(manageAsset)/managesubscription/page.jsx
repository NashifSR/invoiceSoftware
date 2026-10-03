"use client";

import { useState } from "react";
import AssetManager from "@/API/ui/AssetManager";

const ManageSubscription = () => {

    return (
        <div>

            <AssetManager
                type="subscription"
                title="Manage Subscription"
            />
        </div>
    );
};

export default ManageSubscription;