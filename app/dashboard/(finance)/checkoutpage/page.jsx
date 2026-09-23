"use client";

import { useState } from "react";
import axios from "axios";
import { CreditCard, ShoppingBag, ArrowRight } from "lucide-react";

const CheckoutPage = () => {
  // Example cart items (in a real app, this comes from global state, context, or props)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Asset Plan Upgrade", price: 1000, quantity: 1 },
  ]);

  const [loading, setLoading] = useState(false);

  // Calculate total price automatically
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle the SSLCommerz Checkout flow
  const handleCheckout = async () => {
    try {
      setLoading(true);

      const paymentPayload = {
        tran_id: `TXN_${Date.now()}`,
        total_amount: totalAmount,
        cus_name: "John Doe", // You can hook this up to your logged-in user state
        cus_email: "johndoe@gmail.com",
        cus_phone: "01700000000",
      };

      // Call your backend init route
      const response = await axios.post(
        "http://localhost:5000/api/payment/init",
        paymentPayload
      );

      if (response.data?.url) {
        // Redirect user directly to SSLCommerz payment page
        window.location.href = response.data.url;
      } else {
        alert("Failed to connect to payment gateway.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-950">Order Summary</h1>
            <p className="text-sm text-zinc-500">Review your items before proceeding to secure payment.</p>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="divide-y divide-zinc-100 py-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold text-zinc-900">{item.name}</h3>
                <p className="text-sm text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-zinc-900">BDT {item.price * item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Total & Checkout Button */}
        <div className="border-t border-zinc-100 pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-medium text-zinc-600">Total Amount</span>
            <span className="text-2xl font-bold text-zinc-950">BDT {totalAmount}</span>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-base font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? (
              "Connecting to Gateway..."
            ) : (
              <>
                <CreditCard size={18} />
                Pay with SSLCommerz
                <ArrowRight size={18} />
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