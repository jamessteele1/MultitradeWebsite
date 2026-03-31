"use client";

import { useState } from "react";
import { useQuoteCart, type CartItem, type ServiceUpgrades } from "@/context/QuoteCartContext";
import { useServiceUpgrades } from "@/context/ServiceUpgradesContext";
import ServiceUpgradesDialog, { type ServiceUpgradesResult } from "@/components/ServiceUpgradesDialog";

// Products that skip service upgrades entirely (self-powered, self-contained, no electrical)
const NO_UPGRADES = new Set([
  "solar-toilet",
  "chemical-toilet",
  "pwd-chemical-toilet",
]);

// Products that only need mine-spec question (self-contained power/water)
const MINE_SPEC_ONLY = new Set([
  "self-contained-supervisor-office",
  "12x3m-mobile-crib",
  "6-6x3m-self-contained",
  "7-2x3m-self-contained",
  "9-6x3m-living-quarters",
  "solar-facility",
  "bathhouse",
]);

type Props = {
  product: Omit<CartItem, "quantity" | "duration" | "serviceUpgrades">;
  className?: string;
  compact?: boolean;
  /** Show the service upgrades dialog before adding to quote */
  showServiceUpgrades?: boolean;
  /** Building size for plug size logic in the dialog */
  buildingSize?: "12x3" | "6x3" | "3x3" | "other";
};

export default function AddToQuoteButton({ product, className = "", compact = false, showServiceUpgrades = false, buildingSize = "other" }: Props) {
  const { addItem, isInCart } = useQuoteCart();
  const serviceCtx = useServiceUpgrades();
  const inCart = isInCart(product.id);
  const [animating, setAnimating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Product-level rules: no upgrades for containers, ancillary, and specific self-contained products
  const skipUpgrades = product.category === "containers" || product.category === "ancillary" || NO_UPGRADES.has(product.id);
  const mineSpecOnly = MINE_SPEC_ONLY.has(product.id);
  const effectiveShowUpgrades = showServiceUpgrades && !skipUpgrades;

  const doAdd = (upgrades?: ServiceUpgrades) => {
    addItem(product, upgrades);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If already in cart, just increment
    if (inCart) {
      doAdd();
      return;
    }

    // If service upgrades enabled, check if already filled in via inline section
    if (effectiveShowUpgrades) {
      if (serviceCtx?.isComplete) {
        const { powerType, mineSpec, mineName } = serviceCtx.state;
        doAdd({
          powerType: powerType as "site" | "generator",
          mineSpec: mineSpec ?? false,
          mineName,
        });
        return;
      }
      // Show dialog
      setShowDialog(true);
      return;
    }

    // Default: add directly
    doAdd();
  };

  // Determine if water tank question should show (regular crib rooms & ablutions only, not self-contained)
  const showWaterTank =
    !mineSpecOnly &&
    (product.category === "crib-rooms" || product.category === "ablutions") &&
    !isInCart("5000l-tank-pump");

  const handleConfirm = (data: ServiceUpgradesResult) => {
    setShowDialog(false);
    const upgrades: ServiceUpgrades = {
      powerType: data.powerType,
      mineSpec: data.mineSpec,
      mineName: data.mineName,
      plugSize: data.plugSize,
    };
    // Also update shared context if available
    if (serviceCtx) {
      serviceCtx.update({
        powerType: data.powerType,
        mineSpec: data.mineSpec,
        mineName: data.mineName,
      });
    }
    doAdd(upgrades);

    // If user opted for a water tank, add it as a separate cart item
    if (data.addWaterTank) {
      addItem({
        id: "5000l-tank-pump",
        name: "5000L Tank & Pump Combo",
        size: "Skid mounted",
        img: "/images/products/5000l-tank-pump/1.jpg",
        category: "ancillary",
      });
    }
  };

  const handleSkip = () => {
    setShowDialog(false);
    doAdd();
  };

  const button = compact ? (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        animating
          ? "bg-green-50 text-green-700 border border-green-200 scale-110"
          : inCart
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gold/10 text-amber-700 border border-gold/30 hover:bg-gold/20"
      } ${className}`}
      style={{ transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {inCart || animating ? (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={animating ? "animate-[checkPop_0.4s_ease-out]" : ""}
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {animating ? "Added!" : "In Quote"}
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add to Quote
        </>
      )}
    </button>
  ) : (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        animating
          ? "bg-green-100 text-green-700 border border-green-300 scale-105"
          : inCart
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-gold text-gray-900 hover:brightness-110"
      } ${className}`}
      style={{ transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
    >
      {inCart || animating ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={animating ? "animate-[checkPop_0.4s_ease-out]" : ""}
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {animating ? "Added!" : "Added to Quote"}
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add to Quote
        </>
      )}
    </button>
  );

  return (
    <>
      {button}
      {effectiveShowUpgrades && (
        <ServiceUpgradesDialog
          open={showDialog}
          buildingSize={buildingSize}
          showWaterTank={showWaterTank}
          mineSpecOnly={mineSpecOnly}
          onConfirm={handleConfirm}
          onSkip={handleSkip}
        />
      )}
    </>
  );
}
