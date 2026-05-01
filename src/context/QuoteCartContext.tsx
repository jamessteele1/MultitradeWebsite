"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

/* ── Types ── */
export type ServiceUpgrades = {
  powerType: "site" | "generator" | "self-contained";
  mineSpec: boolean;
  mineName: string;
  plugSize?: string;
  sewerConnected?: boolean;
};

export type CartItem = {
  id: string;
  name: string;
  size: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "complexes" | "ancillary";
  quantity: number;
  serviceUpgrades?: ServiceUpgrades;
};

/**
 * Snapshot of the site planner attached to a quote submission so the sales
 * team can see the actual layout the customer designed. Stored in-session
 * only — the PNG is base64 and we don't want it persisted to localStorage.
 */
export type SiteLayoutSnapshot = {
  /** Base64 dataURL of the planner canvas as a PNG */
  png: string;
  /** JSON string with buildings, drawings, texts, address, coords */
  json: string;
  /** Optional human-readable address for context */
  address?: string;
};

type QuoteCartContextType = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  addItem: (item: Omit<CartItem, "quantity">, serviceUpgrades?: ServiceUpgrades) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isInCart: (id: string) => boolean;
  /** Site planner snapshot attached to the next quote submission */
  siteLayout: SiteLayoutSnapshot | null;
  setSiteLayout: (layout: SiteLayoutSnapshot | null) => void;
};

const STORAGE_KEY = "multitrade-quote-cart";

const QuoteCartContext = createContext<QuoteCartContextType | null>(null);

/* ── Provider ── */
export function QuoteCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  // Session-only — never persisted to localStorage (PNG is large + sensitive)
  const [siteLayout, setSiteLayout] = useState<SiteLayoutSnapshot | null>(null);

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

  const addItem = useCallback((item: Omit<CartItem, "quantity">, serviceUpgrades?: ServiceUpgrades) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1, ...(serviceUpgrades ? { serviceUpgrades } : {}) } : i);
      }
      return [...prev, { ...item, quantity: 1, ...(serviceUpgrades ? { serviceUpgrades } : {}) }];
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

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
    setSiteLayout(null);
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
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        isInCart,
        siteLayout,
        setSiteLayout,
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
