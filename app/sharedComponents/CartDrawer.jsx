"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CreditCard,
} from "lucide-react";

const CartDrawer = ({
  isOpen,
  onClose,
  cartItems = [],
  setCartItems,
}) => {
  const [loading, setLoading] = useState(false);

  /* ============================================================
     REMOVE ITEM
  ============================================================ */

  const handleRemove = (id) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );
  };

  /* ============================================================
     TOTAL
  ============================================================ */

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /* ============================================================
     CHECKOUT
  ============================================================ */

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return;
    }

    try {
      setLoading(true);

      /* ========================================================
         PAYMENT PAYLOAD

         These are currently placeholders.

         Later we can replace the customer information with
         the authenticated user's profile asset.
      ======================================================== */

      const paymentPayload = {
        tran_id: `TXN_${Date.now()}`,

        total_amount: totalAmount,

        cus_name: "Ahmed Nashif",
        cus_email: "nashif@example.com",
        cus_phone: "01700000000",
      };

      console.log(
        "PAYMENT REQUEST:",
        paymentPayload
      );

      /* ========================================================
         SEND TO BACKEND
      ======================================================== */

      const response = await axios.post(
        "http://localhost:5000/api/payment/init",
        paymentPayload
      );

      console.log(
        "PAYMENT RESPONSE:",
        response.data
      );

      /* ========================================================
         GATEWAY URL

         Depending on your backend implementation, it may return:

         {
           url: "..."
         }

         OR SSLCommerz's:

         {
           GatewayPageURL: "..."
         }
      ======================================================== */

      const gatewayUrl =
        response.data?.url ||
        response.data?.GatewayPageURL;

      if (!gatewayUrl) {

        console.error(
          "Gateway URL missing:",
          response.data
        );

        alert(
          "Payment gateway did not return a redirect URL."
        );

        return;
      }

      /* ========================================================
         REDIRECT TO SSLCommerz
      ======================================================== */

      window.location.href =
        gatewayUrl;

    } catch (error) {

      console.error(
        "CHECKOUT ERROR:",
        error
      );

      /* ========================================================
         BACKEND ERROR
      ======================================================== */

      console.error(
        "BACKEND RESPONSE:",
        error?.response?.data
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "REQUEST:",
        error?.config
      );

      /* ========================================================
         ERROR MESSAGE
      ======================================================== */

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data?.msg;

      if (backendMessage) {

        alert(
          backendMessage
        );

      } else if (
        error?.response?.status
      ) {

        alert(
          `Payment initialization failed. Server returned ${error.response.status}.`
        );

      } else {

        alert(
          "Unable to connect to the payment server."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  /* ============================================================
     CLOSED
  ============================================================ */

  if (!isOpen) {
    return null;
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">

      {/* ========================================================
          BACKDROP
      ======================================================== */}

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />


      {/* ========================================================
          DRAWER
      ======================================================== */}

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">

        <div className="flex w-screen max-w-md flex-col bg-white shadow-2xl">


          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex items-center justify-between border-b border-zinc-100 p-5">

            <div className="flex items-center gap-2.5">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">

                <ShoppingBag size={18} />

              </div>

              <h2 className="text-base font-bold text-zinc-950">
                Your Cart
              </h2>

            </div>


            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close cart"
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50"
            >

              <X size={20} />

            </button>

          </div>


          {/* ==================================================
              CART ITEMS
          ================================================== */}

          <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto p-5">

            {cartItems.length === 0 ? (

              <div className="flex h-full flex-col items-center justify-center py-12 text-center text-zinc-500">

                <ShoppingBag
                  size={40}
                  className="mb-3 text-zinc-300"
                />

                <p className="text-sm font-medium">
                  Your cart is empty
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Add items to proceed to checkout.
                </p>

              </div>

            ) : (

              cartItems.map((item) => {

                const quantity =
                  Number(item.quantity || 0);

                const price =
                  Number(item.price || 0);

                const itemTotal =
                  price * quantity;

                return (

                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4"
                  >

                    {/* Item information */}

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-semibold text-zinc-900">

                        {item.name}

                      </h3>

                      <p className="mt-0.5 text-xs text-zinc-500">

                        Qty: {quantity}

                      </p>

                    </div>


                    {/* Price + remove */}

                    <div className="ml-4 flex shrink-0 items-center gap-4">

                      <span className="text-sm font-bold text-zinc-900">

                        BDT {itemTotal.toFixed(2)}

                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item.id)
                        }
                        disabled={loading}
                        aria-label={`Remove ${item.name}`}
                        className="text-zinc-400 transition hover:text-red-600 disabled:opacity-50"
                      >

                        <Trash2 size={16} />

                      </button>

                    </div>

                  </div>

                );
              })

            )}

          </div>


          {/* ==================================================
              FOOTER
          ================================================== */}

          {cartItems.length > 0 && (

            <div className="border-t border-zinc-100 bg-zinc-50/50 p-5">

              {/* Subtotal */}

              <div className="mb-4 flex items-center justify-between">

                <span className="text-sm font-medium text-zinc-600">
                  Subtotal
                </span>

                <span className="text-xl font-bold text-zinc-950">
                  BDT {totalAmount.toFixed(2)}
                </span>

              </div>


              {/* Checkout */}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {loading ? (

                  <span>
                    Connecting to Gateway...
                  </span>

                ) : (

                  <>
                    <CreditCard size={16} />

                    <span>
                      Pay with SSLCommerz
                    </span>

                    <ArrowRight size={16} />
                  </>

                )}

              </button>


              {/* Security message */}

              <p className="mt-3 text-center text-[11px] text-zinc-400">

                🔒 Secure SSLCommerz encrypted gateway

              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default CartDrawer;