import UniversalDataCollectionTemplate from '@/API/ui/UniversalDataCollectionTemplate';
import React from 'react'

const CreatePackage = () => {
    const fields = [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Enter subscription name...",
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            required: true,
            placeholder: "Enter price...",
        },
    ];

    return (
        <UniversalDataCollectionTemplate
            title="Create Subscription"
            description="Create a new subscription plan."
            type="subscription"
            businessType="school"
            fields={fields}
        />
    );
};


export default CreatePackage
