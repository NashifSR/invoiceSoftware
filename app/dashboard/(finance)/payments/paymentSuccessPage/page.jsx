"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle,
    ShoppingBag,
    ArrowRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const PaymentSuccessPage = () => {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const tranId =
        searchParams.get("tran_id");

    const [payment, setPayment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    useEffect(() => {

        const verifyPayment =
            async () => {

                if (!tranId) {
                    setError(
                        "Transaction ID is missing."
                    );
                    setLoading(false);
                    return;
                }

                try {

                    const response =
                        await axios.get(
                            `http://localhost:5000/api/payment/status/${tranId}`
                        );

                    const paymentData =
                        response.data;

                    if (
                        paymentData.status !==
                            "SUCCESS" ||
                        paymentData.purchaseStatus !==
                            "PURCHASED"
                    ) {
                        setError(
                            "Payment could not be confirmed."
                        );
                        return;
                    }

                    setPayment(
                        paymentData
                    );

                    // Clear cart only after
                    // backend confirms successful purchase.
                    localStorage.removeItem(
                        "cart"
                    );

                    window.dispatchEvent(
                        new Event(
                            "cartUpdated"
                        )
                    );

                } catch (err) {

                    console.error(
                        "PAYMENT VERIFICATION ERROR:",
                        err
                    );

                    setError(
                        err.response?.data?.error ||
                        "Unable to verify your payment."
                    );

                } finally {

                    setLoading(false);

                }
            };

        verifyPayment();

    }, [tranId]);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
                <div className="text-center">
                    <p className="text-sm text-zinc-500">
                        Verifying your payment...
                    </p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
                <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <CheckCircle size={32} />
                    </div>

                    <h1 className="text-2xl font-bold text-zinc-950">
                        Payment Verification Failed
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        {error}
                    </p>

                    {tranId && (
                        <p className="mt-4 break-all font-mono text-xs text-zinc-400">
                            Transaction: {tranId}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard"
                            )
                        }
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        Go to Dashboard
                        <ArrowRight size={17} />
                    </button>

                </div>
            </main>
        );
    }

    const totalAmount =
        Number(
            payment?.amount || 0
        );

    return (
        <main className="min-h-screen bg-zinc-50 p-6">

            <div className="mx-auto max-w-2xl">

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

                    <div className="text-center">

                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <CheckCircle size={34} />
                        </div>

                        <h1 className="text-2xl font-bold text-zinc-950">
                            Payment Successful
                        </h1>

                        <p className="mt-2 text-sm text-zinc-500">
                            Thank you for your purchase.
                            Your payment has been confirmed.
                        </p>

                    </div>

                    <div className="mt-8 rounded-xl bg-zinc-50 p-5">

                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Transaction ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm text-zinc-800">
                            {payment?.tran_id}
                        </p>

                    </div>

                    <div className="mt-6">

                        <div className="mb-4 flex items-center gap-2">
                            <ShoppingBag
                                size={18}
                                className="text-zinc-600"
                            />

                            <h2 className="font-semibold text-zinc-900">
                                Purchased Items
                            </h2>
                        </div>

                        <div className="space-y-3">

                            {payment?.items?.map(
                                (item, index) => (
                                    <div
                                        key={`${item.itemId}-${index}`}
                                        className="flex items-center justify-between rounded-xl border border-zinc-200 p-4"
                                    >

                                        <div>
                                            <p className="font-medium text-zinc-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-semibold text-zinc-900">
                                            {item.total}{" "}
                                            {payment.currency}
                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-5">

                        <span className="font-medium text-zinc-600">
                            Total
                        </span>

                        <span className="text-xl font-bold text-zinc-950">
                            {totalAmount}{" "}
                            {payment?.currency}
                        </span>

                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/dashboard"
                                )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                        >
                            Go to Dashboard
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/"
                                )
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default PaymentSuccessPage;