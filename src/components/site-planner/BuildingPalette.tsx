"use client";

import { useState } from "react";
import { BUILDING_TYPES, CATEGORY_LABELS, type BuildingType } from "@/lib/site-planner/buildings";

type Props = {
  className?: string;
  onAddCustom?: (widthM: number, depthM: number, label: string) => void;
  /** Mobile: currently selected building type for tap-to-place */
  selectedTypeId?: string | null;
  /** Mobile: callback when a building type is tapped */
  onSelectType?: (typeId: string, label: string) => void;
  isMobile?: boolean;
};

const grouped = Object.entries(
  BUILDING_TYPES.reduce<Record<string, BuildingType[]>>((acc, bt) => {
    (acc[bt.category] ??= []).push(bt);
    return acc;
  }, {}),
);

export default function BuildingPalette({ className = "", onAddCustom, selectedTypeId, onSelectType, isMobile }: Props) {
  const [customW, setCustomW] = useState(6);
  const [customD, setCustomD] = useState(3);
  const [customLabel, setCustomLabel] = useState("Custom");
  // Custom covered deck — clamped to 3.4m wide × 15m long
  const [deckW, setDeckW] = useState(6);
  const [deckD, setDeckD] = useState(3);
  const [deckLabel, setDeckLabel] = useState("Covered Deck");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<string>(grouped[0]?.[0] || "offices");

  const handleDragStart = (e: React.DragEvent, bt: BuildingType) => {
    e.dataTransfer.setData("buildingTypeId", bt.id);
    e.dataTransfer.setData("buildingLabel", bt.shortLabel);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCustomDragStart = (e: React.DragEvent) => {
    const w = Math.min(24, Math.max(1, customW));
    const h = Math.min(16, Math.max(1, customD));
    e.dataTransfer.setData("buildingTypeId", `custom-${w}x${h}`);
    e.dataTransfer.setData("buildingLabel", customLabel || `${w}×${h}m`);
    e.dataTransfer.setData("customWidth", String(w));
    e.dataTransfer.setData("customDepth", String(h));
    e.dataTransfer.effectAllowed = "copy";
  };

  const clampDeck = () => ({
    w: Math.min(15, Math.max(0.5, deckW)),
    d: Math.min(3.4, Math.max(0.5, deckD)),
  });

  const handleCustomDeckDragStart = (e: React.DragEvent) => {
    const { w, d } = clampDeck();
    e.dataTransfer.setData("buildingTypeId", `custom-deck-${w}x${d}`);
    e.dataTransfer.setData("buildingLabel", deckLabel || `${w}×${d}m Deck`);
    // Use the deck-flagged keys so the canvas calls onAddCustom in deck mode
    e.dataTransfer.setData("customWidth", String(w));
    e.dataTransfer.setData("customDepth", String(d));
    e.dataTransfer.setData("customMode", "deck");
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleItemTap = (bt: BuildingType) => {
    if (isMobile && onSelectType) {
      onSelectType(bt.id, bt.shortLabel);
    }
  };

  /* ── Mobile bottom-sheet palette ── */
  if (isMobile) {
    const categoryItems = grouped.find(([cat]) => cat === mobileCategory)?.[1] || [];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {/* Toggle bar */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200 shadow-lg"
        >
          <span className="text-xs font-bold text-gray-900">
            {selectedTypeId ? `Tap canvas to place` : "Buildings"}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="bg-white border-t border-gray-100 shadow-xl" style={{ maxHeight: "45vh", overflowY: "auto" }}>
            {/* Category tabs */}
            <div className="flex overflow-x-auto gap-1 px-3 py-2 border-b border-gray-100 scrollbar-hide">
              {grouped.map(([cat]) => (
                <button
                  key={cat}
                  onClick={() => setMobileCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    mobileCategory === cat
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-gray-50 text-gray-500 border border-gray-200"
                  }`}
                >
                  {CATEGORY_LABELS[cat] || cat}
                </button>
              ))}
            </div>

            {/* Building items grid */}
            <div className="grid grid-cols-2 gap-2 p-3">
              {categoryItems.map((bt) => (
                <button
                  key={bt.id}
                  onClick={() => handleItemTap(bt)}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border transition-colors text-left ${
                    selectedTypeId === bt.id
                      ? "border-amber-400 bg-amber-50 ring-1 ring-amber-400"
                      : "border-gray-100 active:bg-gray-50"
                  }`}
                >
                  {bt.category === "utilities" ? (
                    <div
                      className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                      style={{ width: 22, height: 22, backgroundColor: bt.color, borderColor: bt.stroke, fontSize: 12 }}
                    >
                      {bt.icon}
                    </div>
                  ) : (
                    <div
                      className="flex-shrink-0 rounded-sm border"
                      style={{
                        width: Math.max(14, bt.widthM * 3),
                        height: Math.max(10, bt.depthM * 3),
                        backgroundColor: bt.color,
                        borderColor: bt.stroke,
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-gray-900 truncate leading-tight">{bt.name}</p>
                    <p className="text-[9px] text-gray-500">{bt.widthM}×{bt.depthM}m</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom size (simplified for mobile) */}
            <div className="px-3 pb-3 space-y-2">
              <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Custom Size</p>
                <div className="flex items-center gap-1.5">
                  <input type="number" value={customW} onChange={(e) => setCustomW(Math.min(24, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    min={1} max={24} step={0.5} />
                  <span className="text-[10px] text-gray-400">×</span>
                  <input type="number" value={customD} onChange={(e) => setCustomD(Math.min(16, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    min={1} max={16} step={0.5} />
                  <span className="text-[10px] text-gray-400">m</span>
                  <button
                    onClick={() => {
                      const w = Math.min(24, Math.max(1, customW));
                      const h = Math.min(16, Math.max(1, customD));
                      onSelectType?.(`custom-${w}x${h}`, customLabel || `${w}×${h}m`);
                    }}
                    className="ml-auto px-3 py-1 text-[10px] font-semibold rounded-lg bg-amber-100 text-amber-800 border border-amber-200"
                  >
                    Select
                  </button>
                </div>
              </div>

              {/* Custom Covered Deck (mobile) */}
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Custom Covered Deck</p>
                <div className="flex items-center gap-1.5">
                  <input type="number" value={deckW}
                    onChange={(e) => setDeckW(Math.min(15, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                    className="w-14 px-1.5 py-1 text-xs text-center rounded border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    min={0.5} max={15} step={0.1} title="Length up to 15m" />
                  <span className="text-[10px] text-gray-400">×</span>
                  <input type="number" value={deckD}
                    onChange={(e) => setDeckD(Math.min(3.4, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                    className="w-14 px-1.5 py-1 text-xs text-center rounded border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    min={0.5} max={3.4} step={0.1} title="Width up to 3.4m" />
                  <span className="text-[10px] text-gray-400">m</span>
                  <button
                    onClick={() => {
                      const { w, d } = clampDeck();
                      onSelectType?.(`custom-deck-${w}x${d}`, deckLabel || `${w}×${d}m Deck`);
                    }}
                    className="ml-auto px-3 py-1 text-[10px] font-semibold rounded-lg bg-amber-100 text-amber-800 border border-amber-300"
                  >
                    Select
                  </button>
                </div>
                <p className="text-[9px] text-amber-700/70">Max 15 × 3.4m</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Desktop sidebar palette (unchanged) ── */
  return (
    <div className={`w-[260px] flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Buildings</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Drag onto the canvas to place</p>
      </div>

      <div className="p-3 space-y-4">
        {grouped.map(([category, items]) => (
          <div key={category}>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[category] || category}
            </h4>
            <div className="space-y-1.5">
              {items.map((bt) => (
                <div
                  key={bt.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, bt)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                >
                  {bt.category === "utilities" ? (
                    <div
                      className="flex-shrink-0 rounded-full border-2 flex items-center justify-center"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: bt.color,
                        borderColor: bt.stroke,
                        fontSize: 14,
                      }}
                    >
                      {bt.icon}
                    </div>
                  ) : (
                    <div
                      className="flex-shrink-0 rounded-sm border"
                      style={{
                        width: Math.max(16, bt.widthM * 4),
                        height: Math.max(12, bt.depthM * 4),
                        backgroundColor: bt.color,
                        borderColor: bt.stroke,
                      }}
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{bt.name}</p>
                    <p className="text-[10px] text-gray-500">{bt.widthM} × {bt.depthM}m</p>
                  </div>
                </div>
              ))}

              {/* Custom Covered Deck — only inside the decks category */}
              {category === "decks" && (
                <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-2">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Custom Deck</p>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={deckW}
                      onChange={(e) => setDeckW(Math.min(15, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                      className="w-14 px-1.5 py-1 text-xs text-center rounded border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      min={0.5} max={15} step={0.1}
                      title="Length up to 15m"
                    />
                    <span className="text-[10px] text-gray-400">×</span>
                    <input
                      type="number"
                      value={deckD}
                      onChange={(e) => setDeckD(Math.min(3.4, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                      className="w-14 px-1.5 py-1 text-xs text-center rounded border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      min={0.5} max={3.4} step={0.1}
                      title="Width up to 3.4m"
                    />
                    <span className="text-[10px] text-gray-400">m</span>
                  </div>
                  <input
                    type="text"
                    value={deckLabel}
                    onChange={(e) => setDeckLabel(e.target.value)}
                    placeholder="Label..."
                    className="w-full px-2 py-1 text-xs rounded border border-amber-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <div
                    draggable
                    onDragStart={handleCustomDeckDragStart}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-100 cursor-grab active:cursor-grabbing transition-colors text-xs font-medium text-amber-800"
                  >
                    <div
                      className="rounded-sm border"
                      style={{
                        width: Math.max(16, Math.min(56, deckW * 3.5)),
                        height: Math.max(10, Math.min(28, deckD * 6)),
                        backgroundColor: "#D2B48C",
                        borderColor: "#8B4513",
                      }}
                    />
                    Drag to place
                  </div>
                  <p className="text-[9px] text-amber-700/70 text-center">Max 15 × 3.4m</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Custom size building */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Custom Size
          </h4>
          <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={customW}
                onChange={(e) => setCustomW(Math.min(24, Math.max(1, parseFloat(e.target.value) || 1)))}
                className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                min={1}
                max={24}
                step={0.5}
              />
              <span className="text-[10px] text-gray-400">×</span>
              <input
                type="number"
                value={customD}
                onChange={(e) => setCustomD(Math.min(16, Math.max(1, parseFloat(e.target.value) || 1)))}
                className="w-14 px-1.5 py-1 text-xs text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                min={1}
                max={16}
                step={0.5}
              />
              <span className="text-[10px] text-gray-400">m</span>
            </div>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="Label..."
              className="w-full px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <div
              draggable
              onDragStart={handleCustomDragStart}
              className="flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50 cursor-grab active:cursor-grabbing transition-colors text-xs font-medium text-gray-600"
            >
              <div
                className="rounded-sm border border-gray-400 bg-gray-200"
                style={{
                  width: Math.max(16, Math.min(48, customW * 4)),
                  height: Math.max(12, Math.min(48, customD * 4)),
                }}
              />
              Drag to place
            </div>
            <p className="text-[9px] text-gray-400 text-center">Max 24 × 16m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
