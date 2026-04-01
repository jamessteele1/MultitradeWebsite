"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuoteCart } from "@/context/QuoteCartContext";
import type { ServiceUpgrades } from "@/context/QuoteCartContext";

/* ─── Types ────────────────────────────────────────────────── */

type Facility = "office" | "crib" | "toilets" | "storage";
type StepId = "facilities" | "headcount" | "details" | "services" | "review";

type RecommendedProduct = {
  id: string;
  name: string;
  size: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "ancillary";
  reason: string;
  quantity: number;
  isAncillary?: boolean;
  isSelfContained?: boolean;
};

/* ─── Product Catalog ──────────────────────────────────────── */

const PRODUCTS = {
  "3x3m-office":       { id: "3x3m-office",       name: "3x3m Office",            size: "3x3m",      img: "/images/products/3x3-office/1.jpg",       category: "site-offices" as const },
  "6x3m-office":       { id: "6x3m-office",       name: "6x3m Office",            size: "6x3m",      img: "/images/products/6x3-office/1.jpg",       category: "site-offices" as const },
  "12x3m-office":      { id: "12x3m-office",      name: "12x3m Office",           size: "12x3m",     img: "/images/products/12x3-office/1.jpg",      category: "site-offices" as const },
  "6x3m-crib-room":    { id: "6x3m-crib-room",    name: "6x3m Crib Room",         size: "6x3m",      img: "/images/products/6x3-crib/1.jpg",         category: "crib-rooms" as const },
  "12x3m-crib-room":   { id: "12x3m-crib-room",   name: "12x3m Crib Room",        size: "12x3m",     img: "/images/products/12x3-crib-room/1.jpg",   category: "crib-rooms" as const },
  "solar-toilet":      { id: "solar-toilet",      name: "Solar Toilet",           size: "5.45x2.4m", img: "/images/products/solar-toilet-6x24/1.jpg", category: "ablutions" as const },
  "3-6x2-4m-toilet":   { id: "3-6x2-4m-toilet",   name: "3.6x2.4m Toilet",       size: "3.6x2.4m",  img: "/images/products/36x24-toilet/1.jpg",     category: "ablutions" as const },
  "6x3m-toilet-block": { id: "6x3m-toilet-block", name: "6x3m Toilet Block",     size: "6x3m",      img: "/images/products/6x3-toilet/1.jpg",       category: "ablutions" as const },
  "20ft-container":    { id: "20ft-container",    name: "20ft Container",         size: "6x2.4m",    img: "/images/products/20ft-container/1.jpg",    category: "containers" as const },
  "5000l-tank-pump":   { id: "5000l-tank-pump",   name: "5000L Water Tank & Pump", size: "Skid mounted", img: "/images/products/5000l-tank-pump/1.jpg", category: "ancillary" as const },
  "6000l-waste-tank":  { id: "6000l-waste-tank",  name: "6000L Waste Tank",       size: "6000L",     img: "/images/products/6000l-waste-tank/1.jpg",  category: "ancillary" as const },
  "4000l-waste-tank":  { id: "4000l-waste-tank",  name: "4000L Waste Tank",       size: "4000L",     img: "/images/products/4000l-waste-tank/1.jpg",  category: "ancillary" as const },
  "stair-landing":     { id: "stair-landing",     name: "Stair & Landing",        size: "Various",   img: "/images/products/stair-landing/1.jpg",     category: "ancillary" as const },
};

/* ─── Mine Detection ───────────────────────────────────────── */

const MINE_TOWNS = ["moranbah", "blackwater", "dysart", "middlemount", "clermont", "tieri", "glenden", "nebo", "coppabella"];
const BOWEN_BASIN_MINES = [
  "Blackwater Mine", "Broadmeadow Mine", "Caval Ridge Mine", "Coppabella Mine",
  "Curragh Mine", "Daunia Mine", "Goonyella Riverside Mine", "Grosvenor Mine",
  "Hail Creek Mine", "Isaac Plains Mine", "Lake Vermont Mine", "Moranbah North Mine",
  "North Goonyella Mine", "Oaky Creek Mine", "Peak Downs Mine", "Poitrel Mine",
  "Saraji Mine", "South Walker Creek Mine", "Middlemount Mine", "Olive Downs Mine",
  "Rolleston Mine", "Foxleigh Mine", "Jellinbah Mine", "Moorvale Mine",
];

function detectMiningContext(location: string): boolean {
  const lower = location.toLowerCase();
  if (lower.includes("mine")) return true;
  return MINE_TOWNS.some((town) => lower.includes(town));
}

/* ─── Recommendation Engine ────────────────────────────────── */

function getRecommendations(
  facilities: Set<Facility>,
  totalCrew: number,
  officeWorkers: number,
  powerType: "site" | "generator" | "off-grid",
  sewerConnected: boolean,
  waterAvailable: boolean,
): RecommendedProduct[] {
  const products: RecommendedProduct[] = [];

  // Office — sized by office workers (desk count), not total crew
  // 3x3m = 1 desk, 6x3m = 2–4 desks, 12x3m = 5–6 desks
  if (facilities.has("office")) {
    const d = officeWorkers;
    if (d <= 1) {
      products.push({ ...PRODUCTS["3x3m-office"], quantity: 1, reason: "1 desk for single occupant" });
    } else if (d <= 4) {
      products.push({ ...PRODUCTS["6x3m-office"], quantity: 1, reason: `2–4 desks for ${d} office workers` });
    } else if (d <= 6) {
      products.push({ ...PRODUCTS["12x3m-office"], quantity: 1, reason: `5–6 desks for ${d} office workers` });
    } else {
      // Mix 12x3m (6 desks) and 6x3m (4 desks) to cover the count
      const large = Math.floor(d / 6);
      const remainder = d - large * 6;
      if (large > 0) {
        products.push({ ...PRODUCTS["12x3m-office"], quantity: large, reason: `${large > 1 ? `${large} offices` : "Office"} — 6 desks each` });
      }
      if (remainder > 0 && remainder <= 4) {
        products.push({ ...PRODUCTS["6x3m-office"], quantity: 1, reason: remainder === 1 ? `Extra desk for remaining worker` : `2–4 desks for remaining ${remainder} workers` });
      } else if (remainder > 4) {
        products.push({ ...PRODUCTS["12x3m-office"], quantity: 1, reason: `5–6 desks for remaining ${remainder} workers` });
      }
    }
  }

  // Crib — sized by total crew (everyone needs a seat for breaks)
  // 6x3m = 12 seats, 12x3m = 24 seats
  if (facilities.has("crib")) {
    if (totalCrew <= 12) {
      products.push({ ...PRODUCTS["6x3m-crib-room"], quantity: 1, reason: `12 seats — suits ${totalCrew} workers` });
    } else if (totalCrew <= 24) {
      products.push({ ...PRODUCTS["12x3m-crib-room"], quantity: 1, reason: `24 seats for ${totalCrew} workers` });
    } else {
      // Mix 12x3m (24 seats) and 6x3m (12 seats) to cover the count
      const large = Math.floor(totalCrew / 24);
      const remainder = totalCrew - large * 24;
      if (large > 0) {
        products.push({ ...PRODUCTS["12x3m-crib-room"], quantity: large, reason: `${large > 1 ? `${large} cribs` : "Crib"} — 24 seats each` });
      }
      if (remainder > 0 && remainder <= 12) {
        products.push({ ...PRODUCTS["6x3m-crib-room"], quantity: 1, reason: `12 seats for remaining ${remainder} workers` });
      } else if (remainder > 12) {
        products.push({ ...PRODUCTS["12x3m-crib-room"], quantity: 1, reason: `24 seats for remaining ${remainder} workers` });
      }
    }
  }

  // Toilets — sized by total crew using QLD WHS toilet-to-personnel ratios
  // 3.6x2.4m: 1M + 1F + 1 urinal — covers ~10 workers
  // 6x3m:     3M + 1 urinal + 2F  — covers ~25 workers
  if (facilities.has("toilets")) {
    if (powerType === "off-grid") {
      products.push({ ...PRODUCTS["solar-toilet"], quantity: 1, reason: "Self-contained — no connections needed", isSelfContained: true });
    } else if (totalCrew <= 10) {
      products.push({ ...PRODUCTS["3-6x2-4m-toilet"], quantity: 1, reason: `1M + 1F + urinal — suits up to 10 workers` });
    } else if (totalCrew <= 15) {
      // Between the two sizes — recommend 2x small or 1x large
      products.push({ ...PRODUCTS["6x3m-toilet-block"], quantity: 1, reason: `3M + urinal + 2F — suits ${totalCrew} workers` });
    } else {
      const qty = Math.ceil(totalCrew / 25);
      products.push({
        ...PRODUCTS["6x3m-toilet-block"],
        quantity: qty,
        reason: qty > 1
          ? `${qty} blocks for ${totalCrew} workers (3M + urinal + 2F each)`
          : `3M + urinal + 2F — suits up to 25 workers`,
      });
    }
  }

  // Storage
  if (facilities.has("storage")) {
    products.push({ ...PRODUCTS["20ft-container"], quantity: 1, reason: "Secure lockable storage for tools and equipment" });
  }

  // Ancillary: Waste tank + stair & landing (toilets + not self-contained + no sewer)
  // Quantity matches the number of toilet buildings
  if (facilities.has("toilets") && powerType !== "off-grid" && !sewerConnected) {
    const isLarge = totalCrew > 10;
    const toiletQty = isLarge ? Math.ceil(totalCrew / 25) : 1;
    products.push({
      ...(isLarge ? PRODUCTS["6000l-waste-tank"] : PRODUCTS["4000l-waste-tank"]),
      quantity: toiletQty,
      reason: isLarge
        ? `Waste collection — 1 per toilet block`
        : "Waste collection for 3.6x2.4m toilet",
      isAncillary: true,
    });
    // Stair & landing for each waste tank (access for pump-outs)
    products.push({
      ...PRODUCTS["stair-landing"],
      quantity: toiletQty,
      reason: `Access to toilet — 1 per waste tank`,
      isAncillary: true,
    });
  }

  // Ancillary: Water tank (non-self-contained buildings + no water)
  const hasNonSelfContained = facilities.has("office") || facilities.has("crib") ||
    (facilities.has("toilets") && powerType !== "off-grid");
  if (hasNonSelfContained && !waterAvailable) {
    products.push({
      ...PRODUCTS["5000l-tank-pump"],
      quantity: 1,
      reason: "Potable water supply — no mains water on site",
      isAncillary: true,
    });
  }

  return products;
}

/* ─── Service Upgrades for Cart ────────────────────────────── */

function getServiceUpgrades(
  product: RecommendedProduct,
  powerType: "site" | "generator" | "off-grid",
  mineSpec: boolean,
  mineName: string,
  sewerConnected: boolean,
): ServiceUpgrades | undefined {
  if (product.category === "containers" || product.category === "ancillary") return undefined;
  if (product.isSelfContained) {
    return { powerType: "self-contained", mineSpec, mineName };
  }
  return {
    powerType: powerType === "generator" ? "generator" : "site",
    mineSpec,
    mineName,
    ...(product.category === "ablutions" ? { sewerConnected } : {}),
  };
}

/* ─── Step Labels ──────────────────────────────────────────── */

const STEP_LABELS: Record<StepId, string> = {
  facilities: "What You Need",
  headcount: "Team Size",
  details: "Project Details",
  services: "Site Services",
  review: "Your Setup",
};

/* ─── Main Wizard ──────────────────────────────────────────── */

export default function ScopeWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [facilities, setFacilities] = useState<Set<Facility>>(new Set());
  const [totalCrew, setTotalCrew] = useState(15);
  const [officeWorkers, setOfficeWorkers] = useState(3);
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [hireOrBuy, setHireOrBuy] = useState<"hire" | "buy" | "unsure">("hire");
  const [mineSpec, setMineSpec] = useState(false);
  const [mineName, setMineName] = useState("");
  const [mineSearch, setMineSearch] = useState("");
  const [showMineDropdown, setShowMineDropdown] = useState(false);
  const [powerType, setPowerType] = useState<"site" | "generator" | "off-grid">("site");
  const [sewerConnected, setSewerConnected] = useState(false);
  const [waterAvailable, setWaterAvailable] = useState(true);
  const [quantityOverrides, setQuantityOverrides] = useState<Record<string, number>>({});

  const { addItem, isInCart } = useQuoteCart();

  // Whether we need separate office headcount (office + at least one crew facility)
  const needsOfficeSplit = facilities.has("office") && (facilities.has("crib") || facilities.has("toilets"));

  // Dynamic steps based on selections
  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ["facilities"];
    const needsPeople = facilities.has("office") || facilities.has("crib") || facilities.has("toilets");
    if (needsPeople) s.push("headcount");
    s.push("details");
    if (needsPeople) s.push("services");
    s.push("review");
    return s;
  }, [facilities]);

  const currentStep = steps[stepIndex] || "facilities";

  // For office-only (no crib/toilets), office workers = total crew
  const effectiveOfficeWorkers = needsOfficeSplit ? officeWorkers : totalCrew;

  // Recommendations update live
  const recommendations = useMemo(
    () => getRecommendations(facilities, totalCrew, effectiveOfficeWorkers, powerType, sewerConnected, waterAvailable),
    [facilities, totalCrew, effectiveOfficeWorkers, powerType, sewerConnected, waterAvailable],
  );

  const mainProducts = recommendations.filter((r) => !r.isAncillary);
  const ancillaryProducts = recommendations.filter((r) => r.isAncillary);

  // Auto-detect mining context
  useEffect(() => {
    if (detectMiningContext(location)) setMineSpec(true);
  }, [location]);

  // Keep office workers <= total crew
  useEffect(() => {
    if (officeWorkers > totalCrew) setOfficeWorkers(totalCrew);
  }, [totalCrew, officeWorkers]);

  // Navigation
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "facilities": return facilities.size > 0;
      case "headcount": return totalCrew > 0;
      case "details": return location.trim().length > 0 && duration.length > 0;
      default: return true;
    }
  }, [currentStep, facilities, totalCrew, location, duration]);

  const goNext = useCallback(() => setStepIndex((s) => Math.min(s + 1, steps.length - 1)), [steps.length]);
  const goBack = useCallback(() => setStepIndex((s) => Math.max(s - 1, 0)), []);

  const toggleFacility = useCallback((f: Facility) => {
    setFacilities((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  }, []);

  const getQty = (rec: RecommendedProduct) => quantityOverrides[rec.id] ?? rec.quantity;
  const setQty = (id: string, qty: number) => setQuantityOverrides((prev) => ({ ...prev, [id]: Math.max(1, qty) }));

  // Add a single product to the cart
  const handleAddProduct = useCallback((rec: RecommendedProduct) => {
    const su = getServiceUpgrades(rec, powerType, mineSpec, mineName, sewerConnected);
    const qty = quantityOverrides[rec.id] ?? rec.quantity;
    for (let i = 0; i < qty; i++) {
      addItem({ id: rec.id, name: rec.name, size: rec.size, img: rec.img, category: rec.category }, su);
    }
  }, [powerType, mineSpec, mineName, sewerConnected, quantityOverrides, addItem]);

  // Add all remaining (not yet in cart) products
  const handleAddAll = useCallback(() => {
    for (const rec of recommendations) {
      if (!isInCart(rec.id)) {
        handleAddProduct(rec);
      }
    }
  }, [recommendations, isInCart, handleAddProduct]);

  const allInCart = recommendations.length > 0 && recommendations.every((r) => isInCart(r.id));

  // Mine name filter
  const filteredMines = BOWEN_BASIN_MINES.filter((m) => m.toLowerCase().includes(mineSearch.toLowerCase())).sort();

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent";

  /* ── Wizard Layout ── */
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i < stepIndex && setStepIndex(i)}
                className={`flex items-center gap-2 ${i < stepIndex ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < stepIndex ? "bg-green-500 text-white" :
                  i === stepIndex ? "bg-gold text-gray-900" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {i < stepIndex ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-sm font-medium hidden md:inline ${
                  i === stepIndex ? "text-gray-900" : i < stepIndex ? "text-gray-600" : "text-gray-400"
                }`}>
                  {STEP_LABELS[s]}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-2 ${i < stepIndex ? "bg-green-300" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">

          {/* ── Step: Facilities ── */}
          {currentStep === "facilities" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">What does your site need?</h2>
              <p className="text-sm text-gray-500 mt-1">Select all that apply. You can always adjust later.</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {([
                  { id: "office" as Facility, label: "Site Office", desc: "Admin, management & coordination",
                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="12" y2="16" /></svg> },
                  { id: "crib" as Facility, label: "Crib Room", desc: "Lunch rooms & break areas for crew",
                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg> },
                  { id: "toilets" as Facility, label: "Toilets & Ablutions", desc: "Amenity facilities for your crew",
                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 100 6 3 3 0 000-6z" /><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /></svg> },
                  { id: "storage" as Facility, label: "Storage", desc: "Secure containers for tools & equipment",
                    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><line x1="10" y1="12" x2="14" y2="12" /></svg> },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleFacility(opt.id)}
                    className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 text-center transition-all ${
                      facilities.has(opt.id)
                        ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {facilities.has(opt.id) && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                    <div className={facilities.has(opt.id) ? "text-amber-700" : "text-gray-400"}>{opt.icon}</div>
                    <span className="text-sm font-bold text-gray-900">{opt.label}</span>
                    <span className="text-xs text-gray-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step: Headcount ── */}
          {currentStep === "headcount" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">How many people on site?</h2>
              <p className="text-sm text-gray-500 mt-1">
                {needsOfficeSplit
                  ? "Total crew for crib & toilet sizing, plus how many need desk space."
                  : facilities.has("office")
                    ? "How many people need desk space in the office?"
                    : "Total workers on site. This sizes your buildings."
                }
              </p>

              {/* Total crew */}
              <div className="mt-8">
                {needsOfficeSplit && (
                  <label className="block text-sm font-bold text-gray-700 mb-3">Total crew on site</label>
                )}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setTotalCrew(Math.max(1, totalCrew - 1))}
                    className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={totalCrew}
                    onChange={(e) => setTotalCrew(Math.max(1, Number(e.target.value) || 1))}
                    className="w-24 text-center text-3xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-amber-500 focus:outline-none py-2"
                  />
                  <button
                    onClick={() => setTotalCrew(totalCrew + 1)}
                    className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {[5, 10, 15, 20, 30, 50].map((n) => (
                    <button
                      key={n}
                      onClick={() => setTotalCrew(n)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        totalCrew === n
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Office workers (only when both office + crew facilities are selected) */}
              {needsOfficeSplit && (
                <div className="mt-8 p-5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    How many need desk space?
                  </label>
                  <p className="text-xs text-gray-500 mb-4">
                    Supervisors, admin, project managers — this sizes your office independently.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setOfficeWorkers(Math.max(1, officeWorkers - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={totalCrew}
                      value={officeWorkers}
                      onChange={(e) => setOfficeWorkers(Math.min(totalCrew, Math.max(1, Number(e.target.value) || 1)))}
                      className="w-20 text-center text-2xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none py-2 bg-transparent"
                    />
                    <button
                      onClick={() => setOfficeWorkers(Math.min(totalCrew, officeWorkers + 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {[1, 2, 3, 5, 8].filter(n => n <= totalCrew).map((n) => (
                      <button
                        key={n}
                        onClick={() => setOfficeWorkers(n)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          officeWorkers === n
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live sizing preview */}
              {mainProducts.length > 0 && (
                <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Recommended for {totalCrew} workers{needsOfficeSplit ? ` (${officeWorkers} in office)` : ""}
                  </h3>
                  <div className="space-y-2">
                    {mainProducts.map((r) => (
                      <div key={r.id} className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.img} alt={r.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{r.quantity > 1 ? `${r.quantity}× ` : ""}{r.name}</span>
                          <span className="text-xs text-gray-500 ml-2">{r.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step: Project Details ── */}
          {currentStep === "details" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
              <p className="text-sm text-gray-500 mt-1">Where and how long do you need these buildings?</p>

              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Moranbah, Gladstone, Peak Downs Mine"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select duration...</option>
                    <option value="1-2 weeks">1–2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="1-3 months">1–3 months</option>
                    <option value="3-6 months">3–6 months</option>
                    <option value="6-12 months">6–12 months</option>
                    <option value="12+ months">12+ months</option>
                    <option value="Ongoing">Ongoing / permanent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire or Buy</label>
                  <div className="flex gap-3">
                    {([
                      { value: "hire", label: "Hire" },
                      { value: "buy", label: "Purchase" },
                      { value: "unsure", label: "Not sure yet" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setHireOrBuy(opt.value)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                          hireOrBuy === opt.value
                            ? "border-amber-500 bg-amber-50 text-amber-800"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mine-spec toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Is this a mine site?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { setMineSpec(false); setMineName(""); setMineSearch(""); }}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        !mineSpec
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-900">No — Standard Electrical</span>
                      <p className="text-xs text-gray-500 mt-0.5">Standard electrical fit-out</p>
                    </button>
                    <button
                      onClick={() => setMineSpec(true)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        mineSpec
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-900">Yes — Mine Site</span>
                      <p className="text-xs text-gray-500 mt-0.5">Mine-spec electrical required</p>
                    </button>
                  </div>

                  {/* Mine name dropdown — shown when mine-spec is selected */}
                  {mineSpec && (
                    <div className="mt-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <label className="block text-sm font-medium text-amber-800 mb-2">Which mine?</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={mineSearch}
                          onChange={(e) => { setMineSearch(e.target.value); setMineName(""); setShowMineDropdown(true); }}
                          onFocus={() => setShowMineDropdown(true)}
                          placeholder="Type mine name to search..."
                          className={inputClass}
                        />
                        {showMineDropdown && mineSearch.length > 0 && (
                          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl max-h-48 overflow-y-auto">
                            {filteredMines.length > 0 ? (
                              filteredMines.map((mine) => (
                                <button
                                  key={mine}
                                  onClick={() => { setMineName(mine); setMineSearch(mine); setShowMineDropdown(false); }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors"
                                >
                                  {mine}
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={() => { setMineName(mineSearch); setShowMineDropdown(false); }}
                                className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                              >
                                Use &ldquo;{mineSearch}&rdquo;
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      {mineName && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                          {mineName}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Site Services ── */}
          {currentStep === "services" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Site Services</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us what&apos;s available on site so we can recommend the right equipment.</p>

              <div className="space-y-6 mt-6">
                {/* Power */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">How will buildings be powered?</h3>
                  <div className="space-y-2">
                    {([
                      { value: "site" as const, label: "Site Power", desc: "Hardwired to existing site power supply.", badge: "STANDARD" },
                      { value: "generator" as const, label: "Generator", desc: "Client supplies generator on site." },
                      { value: "off-grid" as const, label: "No Power Available", desc: "Off-grid location — we'll recommend solar options where possible." },
                    ]).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPowerType(opt.value)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                          powerType === opt.value
                            ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          powerType === opt.value ? "border-amber-500" : "border-gray-300"
                        }`}>
                          {powerType === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                          {opt.badge && <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{opt.badge}</span>}
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sewer — only if toilets selected and not off-grid */}
                {facilities.has("toilets") && powerType !== "off-grid" && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Is there a sewer connection on site?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSewerConnected(true)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          sewerConnected
                            ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-sm font-semibold text-gray-900">Yes — Sewer Available</span>
                        <p className="text-xs text-gray-500 mt-0.5">Toilets connected to sewer</p>
                      </button>
                      <button
                        onClick={() => setSewerConnected(false)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          !sewerConnected
                            ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-sm font-semibold text-gray-900">No — Need Waste Tank</span>
                        <p className="text-xs text-gray-500 mt-0.5">We&apos;ll add a waste tank</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Water */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Is potable water available on site?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWaterAvailable(true)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        waterAvailable
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-900">Yes — Water Available</span>
                      <p className="text-xs text-gray-500 mt-0.5">Mains or bore water on site</p>
                    </button>
                    <button
                      onClick={() => setWaterAvailable(false)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        !waterAvailable
                          ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-semibold text-gray-900">No — Need Water Tank</span>
                      <p className="text-xs text-gray-500 mt-0.5">We&apos;ll add a 5000L tank &amp; pump</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step: Review ── */}
          {currentStep === "review" && (
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Recommended Setup</h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalCrew} workers{needsOfficeSplit ? ` (${officeWorkers} in office)` : ""} in {location} for {duration}.
                {mineSpec && ` Mine-spec electrical${mineName ? ` (${mineName})` : ""}.`}
              </p>

              {/* Main buildings */}
              {mainProducts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Buildings</h3>
                  {mainProducts.map((rec) => {
                    const inCart = isInCart(rec.id);
                    return (
                      <div key={rec.id} className={`flex gap-4 p-4 rounded-xl border transition-colors ${inCart ? "border-green-200 bg-green-50/30" : "border-gray-200 hover:border-gray-300"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rec.img} alt={rec.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">{rec.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{rec.size} &middot; {rec.reason}</p>
                          <div className="flex items-center gap-3 mt-3">
                            {!inCart && (
                              <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                <button onClick={() => setQty(rec.id, getQty(rec) - 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30" disabled={getQty(rec) <= 1}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                                <span className="px-3 py-1.5 text-sm font-semibold text-gray-900 min-w-[32px] text-center">{getQty(rec)}</span>
                                <button onClick={() => setQty(rec.id, getQty(rec) + 1)} className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-50">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => handleAddProduct(rec)}
                              disabled={inCart}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                inCart
                                  ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                                  : "bg-gold/10 text-amber-700 border border-gold/30 hover:bg-gold/20"
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                                  In Quote
                                </>
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                  Add to Quote
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Ancillary */}
              {ancillaryProducts.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Supporting Equipment</h3>
                  {ancillaryProducts.map((rec) => {
                    const inCart = isInCart(rec.id);
                    return (
                      <div key={rec.id} className={`flex gap-4 p-4 rounded-xl border ${inCart ? "border-green-200 bg-green-50/30" : "border-gray-100 bg-gray-50"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={rec.img} alt={rec.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900">{rec.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{rec.reason}</p>
                          <div className="flex items-center gap-3 mt-2">
                            {!inCart && (
                              <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                                <button onClick={() => setQty(rec.id, getQty(rec) - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-30" disabled={getQty(rec) <= 1}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                                <span className="px-2.5 py-1 text-xs font-semibold text-gray-900 min-w-[24px] text-center">{getQty(rec)}</span>
                                <button onClick={() => setQty(rec.id, getQty(rec) + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-50">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => handleAddProduct(rec)}
                              disabled={inCart}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                inCart
                                  ? "bg-green-50 text-green-700 border border-green-200 cursor-default"
                                  : "bg-gold/10 text-amber-700 border border-gold/30 hover:bg-gold/20"
                              }`}
                            >
                              {inCart ? (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                                  In Quote
                                </>
                              ) : (
                                <>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                  Add to Quote
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Service upgrades summary */}
              <div className="mt-6 p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Configuration</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                  <p><span className="font-medium text-gray-700">Power:</span> {powerType === "site" ? "Site Power" : powerType === "generator" ? "Generator" : "Off-grid / Solar"}</p>
                  <p><span className="font-medium text-gray-700">Mine-Spec:</span> {mineSpec ? (mineName || "Yes") : "No — Standard"}</p>
                  {facilities.has("toilets") && powerType !== "off-grid" && (
                    <p><span className="font-medium text-gray-700">Sewer:</span> {sewerConnected ? "Connected" : "Waste tank"}</p>
                  )}
                  <p><span className="font-medium text-gray-700">Water:</span> {waterAvailable ? "Available on site" : "Tank & pump included"}</p>
                  <p><span className="font-medium text-gray-700">Duration:</span> {duration}</p>
                  <p><span className="font-medium text-gray-700">Type:</span> {hireOrBuy === "hire" ? "Hire" : hireOrBuy === "buy" ? "Purchase" : "TBC"}</p>
                </div>
              </div>

              {/* Add all / review CTA */}
              {allInCart ? (
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                    <span className="font-semibold">All items added to your quote</span>
                  </div>
                  <a href="/quote" className="inline-block px-6 py-3 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">
                    Review Your Quote
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleAddAll}
                  className="w-full mt-6 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-base"
                >
                  Add All to Quote
                </button>
              )}
              <p className="text-xs text-gray-400 text-center mt-2">
                Items are added to your quote cart. You can adjust quantities and add notes on the quote review page.
              </p>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          {currentStep !== "review" && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {stepIndex > 0 ? (
                <button onClick={goBack} className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={goNext}
                disabled={!canProceed}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* ── Live Preview Sidebar (desktop) ── */}
        {currentStep !== "review" && (
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                Live Preview
              </h3>

              {recommendations.length === 0 ? (
                <p className="text-sm text-gray-400">Select facilities to see your recommended setup.</p>
              ) : (
                <div className="space-y-4">
                  {mainProducts.length > 0 && (
                    <div className="space-y-2.5">
                      {mainProducts.map((r) => (
                        <div key={r.id} className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.img} alt={r.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{r.quantity > 1 ? `${r.quantity}× ` : ""}{r.name}</p>
                            <p className="text-[11px] text-gray-500">{r.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {ancillaryProducts.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Supporting</p>
                        {ancillaryProducts.map((r) => (
                          <div key={r.id} className="flex items-center gap-2.5 mt-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={r.img} alt={r.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-gray-700">{r.name}</p>
                              <p className="text-[10px] text-gray-500">{r.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{recommendations.length}</span> item{recommendations.length !== 1 ? "s" : ""} recommended
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
