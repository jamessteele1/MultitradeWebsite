"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BUILDING_TYPES, CATEGORY_LABELS, type BuildingType } from "@/lib/site-planner/buildings";
import { getTemplates, type SavedLayout } from "@/lib/site-planner/layoutStorage";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (typeId: string, label: string) => void;
  onAddCustom?: (widthM: number, depthM: number, label: string) => void;
  /** Apply a Template (saved layout flagged as template) — replaces the
      current canvas with the layout. The parent confirms with the user. */
  onApplyTemplate?: (template: SavedLayout) => void;
};

const grouped = Object.entries(
  BUILDING_TYPES.reduce<Record<string, BuildingType[]>>((acc, bt) => {
    (acc[bt.category] ??= []).push(bt);
    return acc;
  }, {}),
);

/** Compact sidebar labels (the long ones don't fit in a vertical pill on mobile) */
const SIDEBAR_LABELS: Record<string, string> = {
  offices: "Offices",
  "crib-rooms": "Crib Rooms",
  ablutions: "Ablutions",
  decks: "Decks",
  complexes: "Complexes",
  containers: "Containers",
  ancillary: "Ancillary",
  utilities: "Utilities",
  custom: "Custom",
  templates: "Templates",
};

/** Eight preset fills for the custom-building configurator. */
const CUSTOM_FILLS: { fill: string; label: string }[] = [
  { fill: "#E5E7EB", label: "Grey" },
  { fill: "#DBEAFE", label: "Blue" },
  { fill: "#D1FAE5", label: "Green" },
  { fill: "#FEF3C7", label: "Yellow" },
  { fill: "#FED7AA", label: "Orange" },
  { fill: "#FEE2E2", label: "Red" },
  { fill: "#EDE9FE", label: "Purple" },
  { fill: "#FCE7F3", label: "Pink" },
];

/** Tiny inline icons for each category — visual cue beside the label */
function CategoryIcon({ cat }: { cat: string }) {
  const baseProps = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (cat === "offices") {
    // Desk + monitor — clearly says "office" not "house"
    return (
      <svg {...baseProps}>
        <rect x="3" y="6" width="18" height="2" rx="0.5" />
        <path d="M5 8v8" />
        <path d="M19 8v8" />
        <line x1="3" y1="16" x2="21" y2="16" />
        <rect x="9" y="2" width="6" height="4" rx="0.5" />
      </svg>
    );
  }
  if (cat === "crib-rooms") {
    return <svg {...baseProps}><path d="M17 8h1a4 4 0 010 8h-1" /><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" /></svg>;
  }
  if (cat === "ablutions") {
    return <svg {...baseProps}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
  }
  if (cat === "decks") {
    // House / structure with a roof — re-using what was previously the
    // offices icon, per user feedback (he liked it for decks).
    return <svg {...baseProps}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>;
  }
  if (cat === "complexes") {
    // Three equal-length rectangles joined — visual cue for a multi-
    // building complex.
    return (
      <svg {...baseProps}>
        <rect x="2" y="9" width="6.6" height="11" />
        <rect x="8.7" y="9" width="6.6" height="11" />
        <rect x="15.4" y="9" width="6.6" height="11" />
      </svg>
    );
  }
  if (cat === "containers") {
    return <svg {...baseProps}><rect x="3" y="6" width="18" height="12" rx="1" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="3" y1="14" x2="21" y2="14" /></svg>;
  }
  if (cat === "ancillary") {
    // Gear / cog — accessories & misc gear
    return (
      <svg {...baseProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    );
  }
  if (cat === "utilities") {
    return <svg {...baseProps}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
  }
  if (cat === "custom") {
    // Sliders / configurator glyph
    return (
      <svg {...baseProps}>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="9" cy="6" r="2" fill="currentColor" />
        <circle cx="15" cy="12" r="2" fill="currentColor" />
        <circle cx="11" cy="18" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (cat === "templates") {
    // Stacked rectangles = "templates / layouts"
    return (
      <svg {...baseProps}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    );
  }
  return null;
}

export default function BuildingSelectionPopup({ open, onClose, onSelect, onAddCustom, onApplyTemplate }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(grouped[0]?.[0] || "offices");
  const [customW, setCustomW] = useState(6);
  const [customD, setCustomD] = useState(3);
  const [customLabel, setCustomLabel] = useState("Custom");
  const [customFill, setCustomFill] = useState<string>(CUSTOM_FILLS[0].fill);
  const [templates, setTemplates] = useState<SavedLayout[]>([]);

  // Re-read templates from storage every time the popup opens so newly
  // saved templates appear without needing a page refresh.
  useEffect(() => {
    if (open) setTemplates(getTemplates());
  }, [open]);

  if (!open) return null;

  // Sidebar list — start with the data-driven categories then append the
  // synthetic "templates" + "custom" tabs.
  const sidebarCategories: string[] = [...grouped.map(([c]) => c), "templates", "custom"];
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

        {/* Two-pane layout: vertical category sidebar + buildings grid */}
        <div className="flex flex-1 min-h-0">
          {/* Vertical category sidebar — all categories visible, no swipe needed */}
          <nav
            className="flex-shrink-0 w-[128px] sm:w-[150px] bg-gray-50 border-r border-gray-100 overflow-y-auto py-2"
            aria-label="Building categories"
          >
            {sidebarCategories.map((cat) => {
              // Pick a colour swatch from the first building in the category
              // so each tab carries a visual cue matching the canvas. The
              // synthetic "custom" tab uses an amber accent.
              const sample = grouped.find(([c]) => c === cat)?.[1]?.[0];
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center gap-1.5 px-2 py-2.5 text-left text-[11px] font-bold transition-colors border-l-[3px] ${
                    active
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-transparent text-gray-600 hover:bg-white hover:text-gray-900"
                  }`}
                  aria-pressed={active}
                  aria-label={CATEGORY_LABELS[cat] || cat}
                >
                  <span
                    className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                      active ? "bg-white shadow-sm" : "bg-white/70"
                    }`}
                    style={{
                      color: sample?.stroke || "#6B7280",
                    }}
                  >
                    <CategoryIcon cat={cat} />
                  </span>
                  {/* Allow word-wrap so "Crib Rooms" / "Containers" /
                      "Complexes" never get truncated on narrow phones. */}
                  <span className="leading-tight whitespace-normal break-words flex-1 min-w-0">
                    {SIDEBAR_LABELS[cat] || CATEGORY_LABELS[cat] || cat}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Building grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              {activeCategory === "custom"
                ? "Custom Building"
                : activeCategory === "templates"
                  ? "Templates"
                  : CATEGORY_LABELS[activeCategory] || activeCategory}
            </h3>

            {/* Templates tab — saved layouts the user (or you) flagged as
                templates. Tapping one applies it to the canvas. To add
                a new template: design a layout, hit Layouts → Save with
                "Save as template" ticked. */}
            {activeCategory === "templates" && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Tap a template to drop a pre-arranged site layout onto the canvas. To add a new template:
                  design a layout you like, hit <span className="font-bold">Layouts → Save</span> and tick
                  <span className="font-bold"> &quot;Also save as a Template&quot;</span>.
                </p>

                {templates.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-gray-300 text-center">
                    <p className="text-sm text-gray-700 font-bold">No templates saved yet</p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Build out a layout you&apos;d like to reuse — a 30-person camp, a small site office, a
                      standard ablution block — then save it as a template.
                    </p>
                  </div>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {templates.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (onApplyTemplate) onApplyTemplate(t);
                            onClose();
                          }}
                          className="w-full flex flex-col gap-2 p-2 rounded-xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50 hover:shadow-md transition-all text-left"
                        >
                          <div className="aspect-[5/3] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                            {t.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={t.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            )}
                          </div>
                          <div className="px-1">
                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{t.name}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {t.buildings.length} buildings · {t.drawings.length} drawings
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Custom Building configurator — pick width × depth, name +
                colour, then "Place" places a custom-WxD-c{HEX} building
                that the user can drag/resize/relabel like any other. */}
            {activeCategory === "custom" && (
              <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 space-y-4">
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Drop any size building you need. Pick its dimensions, give
                  it a name, and choose a colour — perfect for one-off site
                  buildings that aren&apos;t in our standard catalogue.
                </p>

                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="text-[10px] text-amber-900/80 block mb-1">Width (m)</label>
                    <input
                      type="number"
                      value={customW}
                      onChange={(e) => setCustomW(Math.min(24, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                      className="w-20 px-2 py-1.5 text-sm text-center rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min={0.5} max={24} step={0.1}
                    />
                  </div>
                  <span className="text-amber-700 text-sm pb-1.5">×</span>
                  <div>
                    <label className="text-[10px] text-amber-900/80 block mb-1">Depth (m)</label>
                    <input
                      type="number"
                      value={customD}
                      onChange={(e) => setCustomD(Math.min(24, Math.max(0.5, parseFloat(e.target.value) || 0.5)))}
                      className="w-20 px-2 py-1.5 text-sm text-center rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      min={0.5} max={24} step={0.1}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-amber-900/80 block mb-1">Name (label on canvas)</label>
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value.slice(0, 24))}
                    placeholder="e.g. Mess hall, Workshop"
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    maxLength={24}
                  />
                </div>

                <div>
                  <label className="text-[10px] text-amber-900/80 block mb-2">Colour</label>
                  <div className="flex flex-wrap gap-2">
                    {CUSTOM_FILLS.map(({ fill, label }) => (
                      <button
                        key={fill}
                        type="button"
                        onClick={() => setCustomFill(fill)}
                        title={label}
                        aria-label={label}
                        className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                          customFill === fill ? "border-gray-900 scale-110 shadow-md" : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: fill }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const w = Math.min(24, Math.max(0.5, customW));
                    const d = Math.min(24, Math.max(0.5, customD));
                    const hex = customFill.replace("#", "").toUpperCase();
                    const label = customLabel.trim() || `${w}×${d}m`;
                    onSelect(`custom-${w}x${d}-c${hex}`, label);
                    onClose();
                  }}
                  className="w-full px-4 py-2.5 text-sm font-bold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                  Place {customW}×{customD}m “{customLabel || "Custom"}”
                </button>
              </div>
            )}

            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${activeCategory === "custom" || activeCategory === "templates" ? "hidden" : ""}`}>
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

          {/* Custom covered deck — only on the decks tab, clamped to 15m × 3.4m */}
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

          {/* Custom complex — only on the complexes tab, clamped to 24m × 18m */}
          {activeCategory === "complexes" && (
            <div className="mt-5 p-4 rounded-xl border border-dashed border-yellow-400 bg-yellow-50/60">
              <h4 className="text-[11px] font-bold text-yellow-900 uppercase tracking-wider mb-3">Custom Complex</h4>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="text-[10px] text-yellow-900/80 block mb-1">Width (m, max 24)</label>
                  <input
                    type="number"
                    value={customW}
                    onChange={(e) => setCustomW(Math.min(24, Math.max(3, parseFloat(e.target.value) || 3)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={3} max={24} step={0.5}
                  />
                </div>
                <span className="text-yellow-800 text-sm pb-1.5">x</span>
                <div>
                  <label className="text-[10px] text-yellow-900/80 block mb-1">Depth (m, max 18)</label>
                  <input
                    type="number"
                    value={customD}
                    onChange={(e) => setCustomD(Math.min(18, Math.max(3, parseFloat(e.target.value) || 3)))}
                    className="w-16 px-2 py-1.5 text-sm text-center rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    min={3} max={18} step={0.5}
                  />
                </div>
                <button
                  onClick={() => {
                    const w = Math.min(24, Math.max(3, customW));
                    const d = Math.min(18, Math.max(3, customD));
                    onSelect(`custom-complex-${w}x${d}`, `${w}×${d}m Complex`);
                    onClose();
                  }}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                >
                  Place
                </button>
              </div>
              <p className="text-[9px] text-yellow-900/80 mt-2">Max 24m × 18m</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
