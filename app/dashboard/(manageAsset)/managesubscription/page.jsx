"use client";

import { useState } from "react";
import AssetManager from "@/API/ui/AssetManager";

const ManageSubscription = () => {

    return (
        <div>

            <AssetManager
                type="Subscription"
                title="Manage Assets"
            />
        </div>
    );
};

export default ManageSubscription;