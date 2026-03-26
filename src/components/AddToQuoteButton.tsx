"use client";

import { useQuoteCart, type CartItem } from "@/context/QuoteCartContext";

type Props = {
  product: Omit<CartItem, "quantity" | "duration">;
  className?: string;
  compact?: boolean;
};

export default function AddToQuoteButton({ product, className = "", compact = false }: Props) {
  const { addItem, isInCart } = useQuoteCart();
  const inCart = isInCart(product.id);

  if (compact) {
    return (
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
        className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          inCart
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gold/10 text-amber-700 border border-gold/30 hover:bg-gold/20"
        } ${className}`}
      >
        {inCart ? (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            In Quote
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add to Quote
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        inCart
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-gold text-gray-900 hover:brightness-110"
      } ${className}`}
    >
      {inCart ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          Added to Quote
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add to Quote
        </>
      )}
    </button>
  );
}
