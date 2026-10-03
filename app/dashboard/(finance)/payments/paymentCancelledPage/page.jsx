"use client";

import {
    Ban,
    ArrowLeft,
    CreditCard,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentCancelledPage = () => {

    const router = useRouter();

    const searchParams =
        useSearchParams();

    const tranId =
        searchParams.get("tran_id");

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Ban size={32} />
                </div>

                <h1 className="text-2xl font-bold text-zinc-950">
                    Payment Cancelled
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                    You cancelled the payment process.
                    No payment was completed, and your
                    cart has been kept so you can try again.
                </p>

                {tranId && (
                    <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-left">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Transaction ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm text-zinc-800">
                            {tranId}
                        </p>
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard/checkoutpage"
                            )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                    >
                        <CreditCard size={17} />
                        Return to Checkout
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard"
                            )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </button>

                </div>

            </div>
        </main>
    );
};

export default PaymentCancelledPage;