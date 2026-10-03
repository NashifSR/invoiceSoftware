"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  setCartItems,
}) {
  const router = useRouter();

  // Load cart from LocalStorage when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const combined = storedCart.reduce((acc, item) => {
        const existing = acc.find((i) => i.id === item.id);
        const qty = Number(item.quantity || 1);
        if (existing) {
          existing.quantity += qty;
        } else {
          acc.push({ ...item, quantity: qty });
        }
        return acc;
      }, []);

      setCartItems(combined);
    } catch (err) {
      console.error("Failed to parse cart:", err);
    }
  }, [isOpen, setCartItems]);

  // Central helper for updating local state and localStorage
  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleIncrease = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    updateCart(updated);
  };

  const handleDecrease = (id) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const handleRemove = (id) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(cartItems));
    onClose();
    router.push("/dashboard/checkoutpage");
  };

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.amount) || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 p-5">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white">
                <ShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </div>
              <h2 className="text-base font-bold text-zinc-950">Your Cart</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center text-zinc-500">
                <ShoppingBag size={40} className="mb-3 text-zinc-300" />
                <p className="text-sm font-medium">Your cart is empty</p>
                <p className="mt-1 text-xs text-zinc-400">
                  Add items to proceed to checkout.
                </p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <CartItem
                  key={`${item.id}-${index}`}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-zinc-100 bg-zinc-50/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">
                  Subtotal
                </span>
                <span className="text-xl font-bold text-zinc-950">
                  BDT {subtotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
              <p className="mt-3 text-center text-[11px] text-zinc-400">
                Secure checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual item rows
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const quantity = Number(item.quantity || 0);
  const amount = Number(item.amount || 0);
  const itemTotal = amount * quantity;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-zinc-900">
          {item.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            aria-label={`Decrease ${item.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
          >
            −
          </button>
          <span className="min-w-6 text-center text-sm font-medium text-zinc-700">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            aria-label={`Increase ${item.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
          >
            +
          </button>
          <span className="ml-2 text-xs text-zinc-500">
            BDT {amount.toFixed(2)} each
          </span>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-4">
        <span className="text-sm font-bold text-zinc-900">
          BDT {itemTotal.toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
          className="text-zinc-400 transition hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}