"use client";

import { useQuoteCart, type CartItem } from "@/context/QuoteCartContext";
import Link from "next/link";
import { useEffect } from "react";

const CATEGORY_LABELS: Record<CartItem["category"], string> = {
  "crib-rooms": "Crib Room",
  "site-offices": "Site Office",
  ablutions: "Ablution",
  containers: "Container",
  complexes: "Complex",
  ancillary: "Ancillary",
};

export default function QuoteCartPanel() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, itemCount } = useQuoteCart();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeCart}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Your Quote</h2>
            {itemCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gold text-gray-900">{itemCount}</span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your quote is empty</p>
              <p className="text-sm text-gray-400 mt-1">Browse our products and add items to get a quote.</p>
              <button onClick={closeCart} className="mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gold text-gray-900 hover:brightness-110 transition-all">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[item.category]} &middot; {item.size}</p>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-1 rounded hover:bg-gray-100 flex-shrink-0 transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                      </div>

                      {/* Quantity + Duration controls */}
                      <div className="flex items-center gap-3 mt-2.5">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="px-2 py-1 text-sm font-semibold text-gray-900 min-w-[28px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>

                      </div>

                      {/* Service Upgrades details */}
                      {item.serviceUpgrades && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide">Service Upgrades</span>
                          </div>
                          <div className="space-y-0.5">
                            {item.serviceUpgrades.powerType !== "self-contained" && (
                              <p className="text-[11px] text-gray-600">
                                <span className="font-medium text-gray-700">Power:</span>{" "}
                                {item.serviceUpgrades.powerType === "site"
                                  ? "Site Power"
                                  : `Generator — ${item.serviceUpgrades.plugSize || "32amp single phase"} Plug Required`}
                              </p>
                            )}
                            <p className="text-[11px] text-gray-600">
                              <span className="font-medium text-gray-700">Mine-Spec:</span>{" "}
                              {item.serviceUpgrades.mineSpec
                                ? item.serviceUpgrades.mineName || "Yes"
                                : "No — Standard"}
                            </p>
                            {item.serviceUpgrades.sewerConnected !== undefined && (
                              <p className="text-[11px] text-gray-600">
                                <span className="font-medium text-gray-700">Sewer:</span>{" "}
                                {item.serviceUpgrades.sewerConnected ? "Connected to sewer" : "Waste tank required"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{itemCount} item{itemCount !== 1 ? "s" : ""} in quote</span>
              <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors">
                Clear all
              </button>
            </div>
            <Link
              href="/quote"
              onClick={closeCart}
              className="block w-full px-5 py-3 rounded-lg font-semibold text-center text-gray-900 bg-gold hover:brightness-110 transition-all"
            >
              Review &amp; Submit Quote
            </Link>
            <button onClick={closeCart} className="block w-full px-5 py-2.5 rounded-lg font-medium text-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all">
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
