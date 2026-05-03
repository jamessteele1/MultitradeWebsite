"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchSuggestions, geocodeLocation, type GeoResult } from "@/lib/site-planner/mapUtils";
import MapControls from "./MapControls";

type Props = {
  hasMap: boolean;
  mapLoading: boolean;
  mapRotation: number;
  onMapSelect: (result: GeoResult) => void;
  onMapRotation: (degrees: number) => void;
  onMapRemove: () => void;
  mapLocked?: boolean;
  onMapLockedChange?: (locked: boolean) => void;
  mapScaleMultiplier?: number;
  onMapScaleChange?: (mul: number) => void;
  moveSiteAsOne?: boolean;
  onMoveSiteAsOneChange?: (on: boolean) => void;
  onMapRecenter?: () => void;
};

/**
 * Mobile-only map controls — address search + rotation.
 * Lives directly under the action toolbar so the user can drop a satellite
 * background and orient it correctly without hunting through panels.
 */
export default function MobileMapBar({
  hasMap,
  mapLoading,
  mapRotation,
  onMapSelect,
  onMapRotation,
  onMapRemove,
  mapLocked = false,
  onMapLockedChange,
  mapScaleMultiplier = 1,
  onMapScaleChange,
  moveSiteAsOne = false,
  onMoveSiteAsOneChange,
  onMapRecenter,
}: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [rotateOpen, setRotateOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  // Becomes true the moment the user taps an autocomplete suggestion. Used
  // to suppress the input's onFocus auto-reopen briefly afterwards — without
  // this, the dropdown re-pops as soon as the input regains focus on iOS.
  const justSelectedRef = useRef(false);

  const [searchedNoResults, setSearchedNoResults] = useState(false);
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSearchedNoResults(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearching(true);
    setShowSuggestions(true); // open the panel immediately so user sees feedback
    debounceRef.current = setTimeout(async () => {
      const results = await searchSuggestions(value);
      setSuggestions(results);
      setShowSuggestions(true);
      setSearchedNoResults(results.length === 0);
      setSearching(false);
    }, 250);
  }, []);

  const handleSelect = (r: GeoResult) => {
    justSelectedRef.current = true;
    setQuery(r.displayName.split(",").slice(0, 2).join(","));
    setSuggestions([]);
    setShowSuggestions(false);
    setSearchedNoResults(false);
    // Drop input focus immediately so iOS doesn't refocus and re-trigger
    // the dropdown. Also close the iOS keyboard.
    inputRef.current?.blur();
    onMapSelect(r);
    // Re-allow auto-open after a short cooldown so future typing works.
    setTimeout(() => { justSelectedRef.current = false; }, 600);
  };

  const handleEnter = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.key !== "Enter" || !query.trim()) return;
      e.preventDefault();
      setShowSuggestions(false);
      setSearching(true);
      const result = await geocodeLocation(query);
      setSearching(false);
      if (result) {
        setQuery(result.displayName.split(",").slice(0, 2).join(","));
        onMapSelect(result);
      } else {
        alert("Address not found. Try adding suburb / state.");
      }
    },
    [query, onMapSelect],
  );

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1.5">
      <div ref={ref} className="relative flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-2 py-1.5">
        {/* Address search input */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
          <line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleEnter}
            onFocus={() => {
              // Don't reopen the dropdown if the user just picked a result
              // (iOS will briefly refocus the input behind the scenes).
              if (justSelectedRef.current) return;
              if (suggestions.length > 0 || query.length >= 3) setShowSuggestions(true);
            }}
            placeholder="Type your site address to bring up a map…"
            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 pr-7"
          />
          {(searching || mapLoading) && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="w-3 h-3 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Map rotation toggle (only when map loaded) */}
        {hasMap && (
          <button
            onClick={() => setRotateOpen((s) => !s)}
            className={`flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
              rotateOpen ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            title="Rotate map for correct orientation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6" /><path d="M21.34 13.5A10 10 0 115.5 3.36L21.5 8" />
            </svg>
            {Math.round(mapRotation)}°
          </button>
        )}

        {/* Remove map button */}
        {hasMap && (
          <button
            onClick={() => {
              onMapRemove();
              setQuery("");
              setRotateOpen(false);
            }}
            className="flex-shrink-0 p-1.5 rounded-lg text-red-500 hover:bg-red-50"
            title="Remove map"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Suggestions dropdown — shows "Searching…", real results, or
            "No matches" so the user always knows what's happening. */}
        {showSuggestions && query.length >= 3 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
            {searching && suggestions.length === 0 && (
              <div className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
                Searching addresses…
              </div>
            )}
            {!searching && searchedNoResults && (
              <div className="px-3 py-2 text-xs text-gray-500">
                No matches. Try adding the suburb &amp; state, or hit Enter to geocode.
              </div>
            )}
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelect(s)}
                className="w-full px-3 py-2 text-left text-xs text-gray-700 active:bg-amber-50 border-b border-gray-50 last:border-0"
              >
                <span className="font-medium">{s.displayName.split(",")[0]}</span>
                <span className="text-gray-400">{s.displayName.split(",").slice(1).join(",")}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Full map controls — appears when the rotate/settings button is toggled */}
      {hasMap && rotateOpen && onMapLockedChange && onMapScaleChange && onMoveSiteAsOneChange && onMapRecenter && (
        <MapControls
          rotation={mapRotation}
          onRotationChange={onMapRotation}
          locked={mapLocked}
          onLockedChange={onMapLockedChange}
          scaleMultiplier={mapScaleMultiplier}
          onScaleChange={onMapScaleChange}
          moveAsOne={moveSiteAsOne}
          onMoveAsOneChange={onMoveSiteAsOneChange}
          onRecenter={onMapRecenter}
          hideScale
        />
      )}
    </div>
  );
}
