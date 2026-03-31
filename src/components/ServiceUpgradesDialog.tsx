"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const BOWEN_BASIN_MINES = [
  "Blackwater Mine", "Broadmeadow Mine", "Caval Ridge Mine", "Coppabella Mine",
  "Curragh Mine", "Daunia Mine", "Goonyella Riverside Mine", "Grosvenor Mine",
  "Hail Creek Mine", "Isaac Plains Mine", "Lake Vermont Mine", "Moranbah North Mine",
  "North Goonyella Mine", "Oaky Creek Mine", "Peak Downs Mine", "Poitrel Mine",
  "Saraji Mine", "South Walker Creek Mine", "Middlemount Mine", "Carborough Downs Mine",
  "Burton Mine", "Foxleigh Mine", "Jellinbah Mine", "Millennium Mine", "Moorvale Mine",
  "Norwich Park Mine", "Olive Downs Mine", "Red Hill Mine", "Rolleston Mine",
  "Sonoma Mine", "Yarrabee Mine",
];

export type ServiceUpgradesResult = {
  powerType: "site" | "generator" | "self-contained";
  mineSpec: boolean;
  mineName: string;
  addWaterTank: boolean;
  plugSize?: string;
  /** Toilet sewer connection — true means connected to sewer, no waste tank needed */
  sewerConnected?: boolean;
  /** Auto-add waste tank (4000L or 6000L based on toilet size) */
  addWasteTank?: boolean;
  /** Auto-add stair & landing for non-sewer toilets */
  addStairLanding?: boolean;
};

type Props = {
  open: boolean;
  buildingSize: "12x3" | "6x3" | "3x3" | "other";
  /** Show the potable water tank question (for crib rooms & ablutions) */
  showWaterTank?: boolean;
  /** Only ask mine-spec question (for self-contained / solar buildings) */
  mineSpecOnly?: boolean;
  /** Show sewer connection question (for toilet blocks) */
  showSewerQuestion?: boolean;
  /** Toilet size for waste tank sizing — "6x3" = 6000L, "3.6x2.4" = 4000L */
  toiletSize?: "6x3" | "3.6x2.4";
  onConfirm: (data: ServiceUpgradesResult) => void;
  onSkip: () => void;
};

export default function ServiceUpgradesDialog({ open, buildingSize, showWaterTank = false, mineSpecOnly = false, showSewerQuestion = false, toiletSize, onConfirm, onSkip }: Props) {
  const [powerType, setPowerType] = useState<"site" | "generator" | "">("");
  const [mineSpec, setMineSpec] = useState<boolean | null>(null);
  const [mineName, setMineName] = useState("");
  const [mineSearch, setMineSearch] = useState("");
  const [showMineDropdown, setShowMineDropdown] = useState(false);
  const [waterTank, setWaterTank] = useState<boolean | null>(null);
  const [sewerConnected, setSewerConnected] = useState<boolean | null>(null);

  const plugSize = buildingSize === "12x3" || buildingSize === "other" ? "32amp single phase" : "15amp";

  const filteredMines = BOWEN_BASIN_MINES.filter((m) =>
    m.toLowerCase().includes(mineSearch.toLowerCase())
  ).sort();

  const mineSpecComplete = mineSpec !== null && (mineSpec === false || mineName !== "");

  const electricalComplete = mineSpecOnly
    ? mineSpecComplete
    : powerType !== "" && mineSpecComplete;

  const sewerComplete = !showSewerQuestion || sewerConnected !== null;
  // Water tank question shows for crib rooms, ablutions, and toilets (regardless of sewer answer)
  const effectiveShowWaterTank = showWaterTank;
  const canConfirm = electricalComplete && sewerComplete && (!effectiveShowWaterTank || waterTank !== null);

  const selectMine = (name: string) => {
    setMineName(name);
    setMineSearch(name);
    setShowMineDropdown(false);
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setPowerType("");
      setMineSpec(null);
      setMineName("");
      setMineSearch("");
      setShowMineDropdown(false);
      setWaterTank(null);
      setSewerConnected(null);
    }
  }, [open]);

  // Prevent body scroll and hide MobileCTA when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-dialog-open", "true");
      return () => {
        document.body.style.overflow = "";
        document.body.removeAttribute("data-dialog-open");
      };
    }
  }, [open]);

  if (!open) return null;

  // Progress steps
  const extraSteps = (showSewerQuestion ? 1 : 0) + (effectiveShowWaterTank ? 1 : 0);
  const totalSteps = mineSpecOnly ? (1 + extraSteps) : (2 + extraSteps);
  const step = mineSpecOnly
    ? (!mineSpecComplete ? 1 : showSewerQuestion && sewerConnected === null ? 2 : effectiveShowWaterTank && waterTank === null ? totalSteps - 1 : totalSteps)
    : powerType === ""
      ? 1
      : !electricalComplete
        ? 2
        : showSewerQuestion && sewerConnected === null
          ? 3
          : effectiveShowWaterTank && waterTank === null
            ? totalSteps - 1
            : totalSteps;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onSkip} />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-[dialogSlideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Service Upgrades</h3>
                <p className="text-xs text-gray-500">Quick setup before adding to quote</p>
              </div>
            </div>
            <button
              onClick={onSkip}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 transition-colors ${step >= i + 1 ? "bg-amber-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Step 1: Power Connection (skip for self-contained / solar buildings) */}
          {!mineSpecOnly && (<div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">Power Connection</h4>
            <p className="text-xs text-gray-500 mb-3">How will this building be powered on site?</p>
            <div className="space-y-2">
              <button
                onClick={() => setPowerType("site")}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  powerType === "site"
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  powerType === "site" ? "border-amber-500" : "border-gray-300"
                }`}>
                  {powerType === "site" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Site Power</span>
                  <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">STANDARD</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hardwired to existing site power supply. Standard {plugSize} connection included.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPowerType("generator")}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  powerType === "generator"
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  powerType === "generator" ? "border-amber-500" : "border-gray-300"
                }`}>
                  {powerType === "generator" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Generator Power</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Building will be powered via generator. Requires {plugSize} plug input.
                  </p>
                </div>
              </button>
            </div>

            {powerType === "generator" && (
              <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  <p className="text-[11px] text-blue-700">
                    {plugSize === "32amp single phase" ? "32A single phase" : "15A"} plug required. Multitrade does not hire generators.
                  </p>
                </div>
              </div>
            )}
          </div>

          )}

          {/* Step 2: Mine Spec — show after power selected, or immediately for mineSpecOnly */}
          {(mineSpecOnly || powerType !== "") && (
            <div className="animate-[dialogFadeIn_0.2s_ease-out]">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Mine-Spec Electrical</h4>
              <p className="text-xs text-gray-500 mb-3">Does this building require mine-spec electrical compliance?</p>
              <div className="space-y-2">
                <button
                  onClick={() => { setMineSpec(true); }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    mineSpec === true
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    mineSpec === true ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {mineSpec === true && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Yes — Mine-Spec Required</span>
                    <p className="text-xs text-gray-500 mt-0.5">Electrical fit-out to mine site standards.</p>
                  </div>
                </button>

                <button
                  onClick={() => { setMineSpec(false); setMineName(""); setMineSearch(""); }}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    mineSpec === false
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    mineSpec === false ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {mineSpec === false && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">No — Standard Electrical</span>
                    <p className="text-xs text-gray-500 mt-0.5">Standard commercial electrical fit-out.</p>
                  </div>
                </button>
              </div>

              {/* Mine selector */}
              {mineSpec === true && (
                <div className="mt-3 animate-[dialogFadeIn_0.2s_ease-out]">
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select Mine Site</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={mineSearch}
                      onChange={(e) => {
                        setMineSearch(e.target.value);
                        setMineName("");
                        setShowMineDropdown(true);
                      }}
                      onFocus={() => setShowMineDropdown(true)}
                      placeholder="Type to search or enter mine name..."
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                    />
                    {showMineDropdown && mineSearch.length > 0 && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl max-h-36 overflow-y-auto">
                        {filteredMines.length > 0 ? (
                          filteredMines.map((mine) => (
                            <button
                              key={mine}
                              onClick={() => selectMine(mine)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              {mine}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => selectMine(mineSearch)}
                            className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                          >
                            Use &ldquo;{mineSearch}&rdquo; as mine name
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {mineName && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {mineName}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step: Sewer Connection — only for toilet blocks, after electrical complete */}
          {showSewerQuestion && electricalComplete && (
            <div className="animate-[dialogFadeIn_0.2s_ease-out]">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Sewer Connection</h4>
              <p className="text-xs text-gray-500 mb-3">Will this toilet be connected to a sewer line?</p>
              <div className="space-y-2">
                <button
                  onClick={() => setSewerConnected(true)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    sewerConnected === true
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    sewerConnected === true ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {sewerConnected === true && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Yes — Sewer Connected</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Toilet will be plumbed into existing sewer infrastructure. No waste tank required.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSewerConnected(false)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    sewerConnected === false
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    sewerConnected === false ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {sewerConnected === false && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">No — Needs Waste Tank</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {toiletSize === "6x3"
                        ? "A 6000L waste tank and stair & landing will be added to your quote."
                        : "A 4000L waste tank and stair & landing will be added to your quote."}
                    </p>
                  </div>
                </button>
              </div>

              {sewerConnected === false && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <p className="text-[11px] text-amber-700">
                      {toiletSize === "6x3" ? "6000L waste tank" : "4000L waste tank"} + stair &amp; landing will be automatically added to your quote.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step: Water Tank — only for crib rooms / sewer-connected toilets, after electrical + sewer complete */}
          {effectiveShowWaterTank && electricalComplete && sewerComplete && (
            <div className="animate-[dialogFadeIn_0.2s_ease-out]">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Potable Water Supply</h4>
              <p className="text-xs text-gray-500 mb-3">Does this building need a fresh water tank & pump?</p>
              <div className="space-y-2">
                <button
                  onClick={() => setWaterTank(true)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    waterTank === true
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    waterTank === true ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {waterTank === true && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">Yes — Add Water Tank & Pump</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      5000L skid-mounted tank with pressure pump. Provides fresh water supply for sinks and appliances.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setWaterTank(false)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                    waterTank === false
                      ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    waterTank === false ? "border-amber-500" : "border-gray-300"
                  }`}>
                    {waterTank === false && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">No — Site Has Water Supply</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Building will be connected to existing site water supply.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Skip for now
          </button>
          <button
            onClick={() => {
              if (canConfirm) {
                const resolvedPower = mineSpecOnly ? "self-contained" as const : powerType as "site" | "generator";
                onConfirm({
                  powerType: resolvedPower,
                  mineSpec: mineSpec ?? false,
                  mineName,
                  addWaterTank: waterTank === true,
                  plugSize: mineSpecOnly ? undefined : plugSize,
                  sewerConnected: showSewerQuestion ? sewerConnected ?? undefined : undefined,
                  addWasteTank: showSewerQuestion && sewerConnected === false,
                  addStairLanding: showSewerQuestion && sewerConnected === false,
                });
              }
            }}
            disabled={!canConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              canConfirm
                ? "bg-gold text-gray-900 hover:brightness-110"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add to Quote
          </button>
        </div>
      </div>

    </div>,
    document.body
  );
}
