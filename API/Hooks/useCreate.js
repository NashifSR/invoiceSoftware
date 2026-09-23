"use client";

import { useCallback } from "react";
import useAssets from "../useAssets";

const useCreate = () => {
    const {
        createAsset,
        loading,
        error,
    } = useAssets();

    const create = useCallback(
        async ({
            type,
            businessType,
            access = [],
            data = {},
        }) => {
            return await createAsset({
                type,
                businessType,
                access,
                data,
            });
        },
        [createAsset]
    );

    return {
        create,
        loading,
        error,
    };
};

export default useCreate;