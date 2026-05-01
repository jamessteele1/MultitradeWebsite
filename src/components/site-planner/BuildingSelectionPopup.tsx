"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { BUILDING_TYPES, CATEGORY_LABELS, type BuildingType } from "@/lib/site-planner/buildings";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (typeId: string, label: string) => void;
  onAddCustom?: (widthM: number, depthM: number, label: string) => void;
};

const grouped = Object.entries(
  BUILDING_TYPES.reduce<Record<string, BuildingType[]>>((acc, bt) => {
    (acc[bt.category] ??= []).push(bt);
    return acc;
  }, {}),
);

export default function BuildingSelectionPopup({ open, onClose, onSelect, onAddCustom }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(grouped[0]?.[0] || "offices");
  const [customW, setCustomW] = useState(6);
  const [customD, setCustomD] = useState(3);
  const [customLabel, setCustomLabel] = useState("Custom");

  if (!open) return null;

  const activeItems = grouped.find(([cat]) => cat === activeCategory)?.[1] || [];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Popup */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-[90vw] max-w-[600px] max-h-[80vh] flex flex-col overflow-hidden"
        style={{ animation: "dialogSlideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Select a Building</h2>
            <p className="text-xs text-gray-500 mt-0.5">Choose a building, then click the canvas to place it</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-1.5 px-5 py-3 border-b border-gray-100 scrollbar-hide">
          {grouped.map(([cat]) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeCategory === cat
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Building grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeItems.map((bt) => (
              <button
                key={bt.id}
                onClick={() => {
                  onSelect(bt.id, bt.shortLabel);
                  onClose();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md transition-all group text-center"
              >
                {bt.category === "utilities" ? (
                  <div
                    className="rounded-full border-2 flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: bt.color,
                      borderColor: bt.stroke,
                      fontSize: 20,
                    }}
                  >
                    {bt.icon}
                  </div>
                ) : (
                  <div
                    className="rounded border-2 group-hover:scale-110 transition-transform"
                    style={{
                      width: Math.max(24, Math.min(80, bt.widthM * 6)),
                      height: Math.max(18, Math.min(60, bt.depthM * 6)),
                      backgroundColor: bt.color,
                      borderColor: bt.stroke,
                    }}
                  />
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{bt.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{bt.widthM} x {bt.depthM}m</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom size section — generic shape (used in containers / utilities) */}
          {activeCategory !== "decks" && (
            <div className="mt-5 p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Custom Size</h4>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Width (m)</label>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Math.min(24, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={1} max={24} step={0.5}
                  />
                </div>
                <span className="text-gray-400 text-sm pb-1.5">x</span>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Depth (m)</label>
                  <input
                    type="number"
                    value={customD}
                    onChange={(e) => setCustomD(Math.min(16, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={1} max={16} step={0.5}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Label</label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Label..."
                    className="w-24 px-2 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={() => {
                    const w = Math.min(24, Math.max(1, customW));
                    const d = Math.min(16, Math.max(1, customD));
                    if (onAddCustom) {
                      onAddCustom(w, d, customLabel || `${w}x${d}m`);
                    } else {
                      onSelect(`custom-${w}x${d}`, customLabel || `${w}x${d}m`);
                    }
                    onClose();
                  }}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Place
                </button>
              </div>
              <p className="text-[9px] text-gray-400 mt-2">Max 24 x 16m</p>
            </div>
          )}

          {/* Custom covered deck — only on the decks tab, clamped to 3.4m × 15m */}
          {activeCategory === "decks" && (
            <div className="mt-5 p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50">
              <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-3">Custom Covered Deck</h4>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-[10px] text-amber-800/80 block mb-1">Length (m, max 15)</label>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Math.min(15, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={0.5} max={15} step={0.1}
                  />
                </div>
                <span className="text-amber-700 text-sm pb-1.5">x</span>
                <div>
                  <label className="text-[10px] text-amber-800/80 block mb-1">Width (m, max 3.4)</label>
                  <input
                    type="number"
                    value={customD}
                    onChange={(e) => setCustomD(Math.min(3.4, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={0.5} max={3.4} step={0.1}
                  />
                </div>
                <button
                  onClick={() => {
                    const w = Math.min(15, Math.max(0.5, customW));
                    const d = Math.min(3.4, Math.max(0.5, customD));
                    onSelect(`custom-deck-${w}x${d}`, `${w}×${d}m Deck`);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Place
                </button>
              </div>
              <p className="text-[9px] text-amber-700/80 mt-2">Max 15m long × 3.4m wide</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
