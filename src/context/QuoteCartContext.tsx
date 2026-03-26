"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ── Types ── */
export type CartItem = {
  id: string;
  name: string;
  size: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "complexes" | "ancillary";
  quantity: number;
  duration: "weekly" | "monthly" | "purchase";
};

type QuoteCartContextType = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity" | "duration">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateDuration: (id: string, duration: CartItem["duration"]) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isInCart: (id: string) => boolean;
};

const STORAGE_KEY = "multitrade-quote-cart";

const QuoteCartContext = createContext<QuoteCartContextType | null>(null);

/* ── Provider ── */
export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = useCallback((item: Omit<CartItem, "quantity" | "duration">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, duration: "monthly" }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
  }, []);

  const updateDuration = useCallback((id: string, duration: CartItem["duration"]) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, duration } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);
  const isInCart = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  return (
    <QuoteCartContext.Provider
      value={{
        items,
        isOpen,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        updateDuration,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        isInCart,
      }}
    >
      {children}
    </QuoteCartContext.Provider>
  );
}

/* ── Hook ── */
export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext);
  if (!ctx) throw new Error("useQuoteCart must be used within QuoteCartProvider");
  return ctx;
}
