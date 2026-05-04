"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchSuggestions, geocodeLocation, type GeoResult } from "@/lib/site-planner/mapUtils";

type Props = {
  selectedId: string | null;
  canUndo: boolean;
  buildingCount: number;
  onRotate: () => void;
  onDelete: () => void;
  onLabel: (label: string) => void;
  onUndo: () => void;
  onClear: () => void;
  onExportPNG: () => void;
  onExportPDF: () => void;
  currentLabel?: string;
  currentRotation?: number;
  onRotateTo: (degrees: number) => void;
  // Map props
  hasMap: boolean;
  mapOpacity: number;
  mapLoading: boolean;
  onMapSelect: (result: GeoResult) => void;
  onMapOpacityChange: (opacity: number) => void;
  onMapRemove: () => void;
  // Sun direction
  sunEnabled: boolean;
  onSunToggle: () => void;
  // Quote
  onGetQuote: () => void;
};

export default function PlannerToolbar({
  selectedId,
  canUndo,
  buildingCount,
  onRotate,
  onDelete,
  onLabel,
  onUndo,
  onClear,
  onExportPNG,
  onExportPDF,
  currentLabel,
  currentRotation,
  onRotateTo,
  hasMap,
  mapOpacity,
  mapLoading,
  onMapSelect,
  onMapOpacityChange,
  onMapRemove,
  sunEnabled,
  onSunToggle,
  onGetQuote,
}: Props) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelText, setLabelText] = useState("");
  const [mapQuery, setMapQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchingAddr, setSearchingAddr] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const hasSelection = selectedId !== null;

  const startLabelEdit = () => {
    setLabelText(currentLabel || "");
    setEditingLabel(true);
  };

  const confirmLabel = () => {
    if (labelText.trim()) onLabel(labelText.trim());
    setEditingLabel(false);
  };

  // Debounced address search
  const handleQueryChange = useCallback((value: string) => {
    setMapQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearchingAddr(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSearchingAddr(false);
    }, 400);
  }, []);

  const handleSelectSuggestion = (result: GeoResult) => {
    setMapQuery(result.displayName.split(",").slice(0, 2).join(","));
    setSuggestions([]);
    setShowSuggestions(false);
    onMapSelect(result);
  };

  const handleSearchKeyDown = useCallback(async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || !mapQuery.trim()) return;
    e.preventDefault();
    setShowSuggestions(false);
    setSearchingAddr(true);
    const result = await geocodeLocation(mapQuery);
    setSearchingAddr(false);
    if (result) {
      setMapQuery(result.displayName.split(",").slice(0, 2).join(","));
      onMapSelect(result);
    } else {
      alert("Address not found. Try adding the suburb or state (e.g. '6 South Trees Drive, Gladstone QLD').");
    }
  }, [mapQuery, onMapSelect]);

  // Close suggestions on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btnBase = "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors";
  const btnActive = `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-100`;
  const btnDisabled = `${btnBase} border border-gray-100 text-gray-300 cursor-not-allowed`;

  return (
    <div className="space-y-2">
      {/* Main toolbar */}
      <div className="flex items-center gap-2 flex-wrap bg-white rounded-xl border border-gray-200 px-4 py-2.5">
        {/* Selection actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={onRotate} disabled={!hasSelection} className={hasSelection ? btnActive : btnDisabled} title="Rotate 90°">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6" /><path d="M21.34 13.5A10 10 0 115.5 3.36L21.5 8" /></svg>
            90°
          </button>

          {hasSelection && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={Math.round(currentRotation ?? 0)}
                onChange={(e) => onRotateTo(parseFloat(e.target.value) || 0)}
                className="w-14 px-1.5 py-1.5 text-xs text-center rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                title="Rotation degrees"
                min={0}
                max={359}
              />
              <span className="text-[10px] text-gray-400">deg</span>
            </div>
          )}

          {editingLabel ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmLabel()}
                className="w-28 px-2 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Building label..."
              />
              <button onClick={confirmLabel} className={`${btnBase} bg-amber-100 text-amber-800 border border-amber-200`}>
                Save
              </button>
              <button onClick={() => setEditingLabel(false)} className={`${btnBase} text-gray-500`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          ) : (
            <button onClick={startLabelEdit} disabled={!hasSelection} className={hasSelection ? btnActive : btnDisabled} title="Rename">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
              Label
            </button>
          )}

          <button onClick={onDelete} disabled={!hasSelection} className={hasSelection ? `${btnBase} border border-red-200 text-red-600 hover:bg-red-50` : btnDisabled} title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
            Delete
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* General actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={onUndo} disabled={!canUndo} className={canUndo ? btnActive : btnDisabled} title="Undo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 0115.36-6.36L21 9" /></svg>
            Undo
          </button>

          <button onClick={onClear} disabled={buildingCount === 0} className={buildingCount > 0 ? btnActive : btnDisabled} title="Clear all">
            Clear
          </button>
        </div>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Sun overlay toggle. The legacy "Note" button has been removed —
            free text now lives entirely in the Drawing tools' Text mode,
            which gives the user proper colour / size / opacity controls
            and works on both desktop and mobile. */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSunToggle}
            className={sunEnabled ? `${btnBase} bg-amber-50 border border-amber-300 text-amber-700` : btnActive}
            title={sunEnabled ? "Hide sun overlay" : "Show sun overlay"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Sun
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export & Quote — note: the per-building count text that used to
            sit before PNG was dropped because it duplicated the live
            "N buildings · X m²" chip on the canvas (top-left), and it
            counted utility markers as buildings which inflated the
            number. The canvas chip is the single source of truth now. */}
        <div className="flex items-center gap-1.5">
          <button onClick={onExportPNG} disabled={buildingCount === 0} className={buildingCount > 0 ? `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-100` : btnDisabled}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            PNG
          </button>
          <button onClick={onExportPDF} disabled={buildingCount === 0} className={buildingCount > 0 ? `${btnBase} border border-gray-200 text-gray-700 hover:bg-gray-100` : btnDisabled}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            PDF
          </button>
          <button onClick={onGetQuote} disabled={buildingCount === 0} className={buildingCount > 0 ? `${btnBase} glow-gold bg-gold text-gray-900 hover:brightness-110` : btnDisabled}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 17H5a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2zm12-2h-4a2 2 0 00-2 2 2 2 0 002 2h2a2 2 0 002-2z" />
              <polyline points="9 11 12 14 22 4" />
            </svg>
            Get a Quote
          </button>
        </div>
      </div>

      {/* Map controls bar */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>

        <div className="relative flex-1 max-w-lg" ref={suggestionsRef}>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                value={mapQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Type an address and press Enter..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 pr-8"
              />
              {(searchingAddr || mapLoading) && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-gray-900 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <span className="font-medium">{s.displayName.split(",")[0]}</span>
                  <span className="text-gray-400">{s.displayName.split(",").slice(1).join(",")}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {mapLoading && (
          <span className="text-[10px] text-amber-600 font-medium">Loading satellite tiles...</span>
        )}

        {hasMap && !mapLoading && (
          <>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-medium">Opacity</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={mapOpacity}
                onChange={(e) => onMapOpacityChange(parseFloat(e.target.value))}
                className="w-20 h-1 accent-amber-500"
              />
              <span className="text-[10px] text-gray-400 w-7">{Math.round(mapOpacity * 100)}%</span>
            </div>
            <button
              onClick={onMapRemove}
              className={`${btnBase} border border-red-200 text-red-500 hover:bg-red-50`}
              title="Remove map"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Remove
            </button>
            <span className="text-[10px] text-gray-400 italic hidden xl:inline">Drag map to reposition</span>
          </>
        )}
      </div>

    </div>
  );
}
