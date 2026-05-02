"use client";

/**
 * Floating contextual action bar that appears over the canvas on mobile
 * whenever a building, drawing or text annotation is selected. Mirrors the
 * pattern used by Procreate / Figma / Notability — keep the main toolbar
 * compact and put per-selection actions in a transient bar near the work.
 *
 * The trash slot doubles as a drop-zone: the parent (PlannerCanvas) checks
 * pointer-position-against-rect on dragend and forwards a delete callback.
 */

import { forwardRef } from "react";

type Kind = "building" | "drawing" | "text";

type Props = {
  kind: Kind;
  /** When the user is mid-drag, the trash chip glows red. */
  hovered: boolean;
  /** Optional opacity slider (drawings + text only). 0–1 */
  opacity?: number;
  onOpacityChange?: (v: number) => void;
  /** Optional colour swatches (drawings + text only). */
  color?: string;
  onColorChange?: (c: string) => void;
  /** Tap-to-delete fallback (also fires on drop). */
  onDelete: () => void;
  /** Deselect / dismiss the bar without changing anything. */
  onDone: () => void;
};

const SWATCHES = ["#EF4444", "#F97316", "#FBBF24", "#22C55E", "#3B82F6", "#A855F7", "#0F172A", "#FFFFFF"];

const MobileSelectionBar = forwardRef<HTMLDivElement, Props>(function MobileSelectionBar(
  { kind, hovered, opacity, onOpacityChange, color, onColorChange, onDelete, onDone },
  ref,
) {
  const showStyleControls = kind !== "building";

  return (
    <div
      ref={ref}
      data-mobile-selection-bar
      className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto"
    >
      <div className="flex items-center gap-1 bg-gray-900/92 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 px-1.5 py-1.5">
        {/* Colour — only for drawings/text */}
        {showStyleControls && color && onColorChange && (
          <details className="relative">
            <summary className="list-none cursor-pointer flex items-center justify-center w-9 h-9 rounded-xl hover:bg-white/10 active:bg-white/15">
              <span
                className="w-5 h-5 rounded-full border-2 border-white/40 shadow-inner"
                style={{ backgroundColor: color }}
                aria-label="Pick colour"
              />
            </summary>
            <div className="absolute bottom-full left-0 mb-1.5 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-2 flex flex-wrap gap-1 w-[152px]">
              {SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => onColorChange(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    color === c ? "border-white scale-110" : "border-white/30 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Colour ${c}`}
                />
              ))}
            </div>
          </details>
        )}

        {/* Opacity — only for drawings/text */}
        {showStyleControls && typeof opacity === "number" && onOpacityChange && (
          <div className="flex items-center gap-1.5 px-2 h-9">
            <span className="text-[10px] font-bold opacity-60">OPACITY</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
              className="w-20 h-1 accent-amber-400"
              aria-label="Opacity"
            />
            <span className="text-[10px] font-mono opacity-70 w-7 text-right">{Math.round(opacity * 100)}%</span>
          </div>
        )}

        {/* Trash — both tappable AND a drop-target. The parent looks at this
            element's bounding rect during dragend to decide whether to delete. */}
        <button
          data-trash-slot
          onClick={onDelete}
          className={`flex items-center gap-1 px-3 h-9 rounded-xl text-[11px] font-bold transition-colors ${
            hovered
              ? "bg-red-500 text-white scale-110 ring-2 ring-red-300/60 shadow-red-500/30 shadow-lg"
              : "bg-red-600/90 hover:bg-red-600 text-white"
          }`}
          title="Delete (or drag the item here)"
          aria-label="Delete selected item"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          {hovered ? "Drop to delete" : "Delete"}
        </button>

        {/* Done — close the bar without changing anything */}
        <button
          onClick={onDone}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          title="Deselect"
          aria-label="Deselect"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Pointer caret + helper hint */}
      <div className="text-center mt-1.5">
        <span className="inline-block px-2 py-0.5 rounded-full bg-gray-900/80 backdrop-blur text-[9px] font-bold uppercase tracking-wider text-white/70">
          {kind === "building" ? "Drag onto the trash to delete" : "Drag here or tap to delete"}
        </span>
      </div>
    </div>
  );
});

export default MobileSelectionBar;
