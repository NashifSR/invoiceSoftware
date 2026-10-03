"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    ShoppingBag,
    ArrowRight,
} from "lucide-react";
import useAssets from "@/API/useAssets";
import usePayment from "@/API/usePayment";
import useAuth from "@/Auth/hooks/useAuth";

const CheckoutPage = () => {

    const {
        user,
        logout,
    } = useAuth();

    const [cartItems, setCartItems] =
        useState([]);

    const {
        assets,
        loading: assetsLoading,
    } = useAssets({
        type: "package",
    });

    const {
        initPayment,
        loading,
    } = usePayment();


    /*
    * LOAD CART FROM LOCAL STORAGE
    */

    useEffect(() => {

        const storedCart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                ) || "[]"
            );


        setCartItems(
            storedCart
        );

    }, []);


    /*
    * RESOLVE CART ITEMS
    * USING REAL BACKEND ASSET DATA
    */

    const checkoutItems =
        cartItems
            .map((cartItem) => {

                const asset =
                    assets.find(
                        (item) =>
                            item.id ===
                                cartItem.id ||
                            item._id ===
                                cartItem.id
                    );


                if (!asset) {
                    return null;
                }


                return {
                    ...asset,
                    quantity:
                        Number(
                            cartItem.quantity ||
                                1
                        ),
                };

            })
            .filter(Boolean);


    /*
    * CALCULATE TOTAL
    */

    const totalAmount =
        checkoutItems.reduce(
            (total, item) =>
                total +
                Number(
                    item.data?.amount ||
                        0
                ) *
                    item.quantity,
            0
        );


    /*
    * HANDLE SSLCommerz CHECKOUT
    */

    const handleCheckout =
        async () => {

            if (
                !user?.email
            ) {
                alert(
                    "Please log in before proceeding to payment."
                );
                return;
            }


            if (
                cartItems.length === 0
            ) {
                alert(
                    "Your cart is empty."
                );
                return;
            }


            try {

                const paymentItems =
                    cartItems.map(
                        (item) => ({
                            itemId:
                                item.id,
                            quantity:
                                Number(
                                    item.quantity ||
                                        1
                                ),
                        })
                    );


                const customer = {
                    name:
                        user?.name ||
                        user?.displayName ||
                        "",
                    email:
                        user?.email ||
                        "",
                    phone:
                        user?.phone ||
                        "",
                    address:
                        user?.address ||
                        "",
                };


                const response =
                    await initPayment({
                        items:
                            paymentItems,
                        customer,
                    });


                if (
                    response?.url
                ) {

                    window.location.href =
                        response.url;

                } else {

                    alert(
                        "Failed to connect to payment gateway."
                    );

                }

            } catch (error) {

                console.error(
                    "Checkout error:",
                    error
                );


                alert(
                    error.response?.data?.error ||
                    error.message ||
                    "Something went wrong during checkout."
                );

            }

        };


    const pageLoading =
        assetsLoading ||
        loading;


    return (

        <main className="mx-auto max-w-3xl p-6">

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">


                {/* Header */}

                <div className="flex items-center gap-3 border-b border-zinc-100 pb-6">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">

                        <ShoppingBag
                            size={22}
                        />

                    </div>


                    <div>

                        <h1 className="text-xl font-bold text-zinc-950">

                            Order Summary

                        </h1>


                        <p className="text-sm text-zinc-500">

                            Review your items before proceeding to secure payment.

                        </p>

                    </div>

                </div>


                {/* Cart Items */}

                <div className="divide-y divide-zinc-100 py-6">

                    {assetsLoading ? (

                        <div className="py-8 text-center text-sm text-zinc-500">

                            Loading order...

                        </div>

                    ) : cartItems.length === 0 ? (

                        <div className="py-8 text-center text-sm text-zinc-500">

                            Your cart is empty.

                        </div>

                    ) : checkoutItems.length === 0 ? (

                        <div className="py-8 text-center text-sm text-zinc-500">

                            No matching items found.

                        </div>

                    ) : (

                        checkoutItems.map(
                            (item) => {

                                const amount =
                                    Number(
                                        item.data?.amount ||
                                            0
                                    );

                                const itemTotal =
                                    amount *
                                    item.quantity;


                                return (

                                    <div
                                        key={
                                            item.id ||
                                            item._id
                                        }
                                        className="flex items-center justify-between py-4"
                                    >

                                        <div>

                                            <h3 className="font-semibold text-zinc-900">

                                                {item.data?.name ||
                                                    "Unnamed Item"}

                                            </h3>


                                            <p className="text-sm text-zinc-500">

                                                Qty:{" "}
                                                {item.quantity}

                                            </p>


                                            <p className="text-xs text-zinc-400">

                                                BDT{" "}
                                                {amount.toFixed(
                                                    2
                                                )}{" "}
                                                each

                                            </p>

                                        </div>


                                        <p className="font-semibold text-zinc-900">

                                            BDT{" "}
                                            {itemTotal.toFixed(
                                                2
                                            )}

                                        </p>

                                    </div>

                                );

                            }
                        )

                    )}

                </div>


                {/* Total & Checkout */}

                <div className="border-t border-zinc-100 pt-6">

                    <div className="mb-6 flex items-center justify-between">

                        <span className="text-base font-medium text-zinc-600">

                            Total Amount

                        </span>


                        <span className="text-2xl font-bold text-zinc-950">

                            BDT{" "}
                            {totalAmount.toFixed(
                                2
                            )}

                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={
                            handleCheckout
                        }
                        disabled={
                            pageLoading ||
                            checkoutItems.length ===
                                0
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-base font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >

                        {loading ? (

                            "Connecting to Gateway..."

                        ) : (

                            <>

                                <CreditCard
                                    size={18}
                                />

                                Pay with SSLCommerz

                                <ArrowRight
                                    size={18}
                                />

                            </>

                        )}

                    </button>


                    <p className="mt-4 text-center text-xs text-zinc-400">

                        🔒 Secure transaction powered by SSLCommerz

                    </p>

                </div>

            </div>

        </main>

    );

};

export default CheckoutPage;