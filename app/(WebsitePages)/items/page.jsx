"use client";

import useAssets from "@/API/useAssets";
import {
    ShoppingCart,
    Check,
} from "lucide-react";
import { useState } from "react";


const Items = () => {

    const {
        assets,
        loading,
        error,
    } = useAssets({
        type: "package",
    });

    const [addedItems, setAddedItems] =
        useState({});



    const handleAddToCart = (item) => {

        const cartItem = {
            id: item._id,
            name: item.data?.name,
            amount: Number(
                item.data?.amount || 0
            ),
            type: item.type,
            quantity: 1,
        };


        const existingCart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                ) || "[]"
            );


        const existingItem =
            existingCart.find(
                (cartItem) =>
                    cartItem.id ===
                    item._id
            );


        console.log(
            "Item already in cart:",
            existingItem
        );


        const updatedCart = [
            ...existingCart,
            cartItem,
        ];


        localStorage.setItem(
            "cart",
            JSON.stringify(
                updatedCart
            )
        );


        console.log(
            "Cart:",
            updatedCart
        );


        // =====================================================
        // BUTTON FEEDBACK
        // =====================================================

        setAddedItems((prev) => ({
            ...prev,
            [item._id]: true,
        }));


        // Return button to normal
        // after a short delay.

        setTimeout(() => {

            setAddedItems((prev) => ({
                ...prev,
                [item._id]: false,
            }));

        }, 1200);

    };


    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    if (error) {

        return (
            <div>
                Failed to load packages.
            </div>
        );

    }


    return (

        <div className="mx-auto max-w-6xl p-6">

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-zinc-950">
                    Packages
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                    Choose a package that fits your needs.
                </p>

            </div>


            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {assets.map((item) => {

                    const name =
                        item.data?.name ||
                        "Unnamed Package";

                    const description =
                        item.data?.description ||
                        "";

                    const amount =
                        Number(
                            item.data?.amount || 0
                        );

                    const isAdded =
                        addedItems[
                            item._id
                        ];


                    return (

                        <div
                            key={item._id}
                            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                        >

                            <div className="flex-1">

                                <h2 className="text-lg font-semibold text-zinc-950">
                                    {name}
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                    {description}
                                </p>

                                <p className="mt-5 text-2xl font-bold text-zinc-950">
                                    BDT {amount.toFixed(2)}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    handleAddToCart(
                                        item
                                    )
                                }
                                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-all duration-200 ${
                                    isAdded
                                        ? "scale-[0.98] bg-green-600"
                                        : "bg-zinc-950 hover:bg-zinc-800"
                                }`}
                            >

                                {isAdded ? (

                                    <>
                                        <Check
                                            size={16}
                                            className="animate-pulse"
                                        />

                                        Added to Cart
                                    </>

                                ) : (

                                    <>
                                        <ShoppingCart
                                            size={16}
                                        />

                                        Add to Cart
                                    </>

                                )}

                            </button>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};


export default Items;