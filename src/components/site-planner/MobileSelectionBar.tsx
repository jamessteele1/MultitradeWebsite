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
  /** Rotate the selected item 90° clockwise (buildings only — drawings
      don't have a stable rotation pivot). */
  onRotate?: () => void;
  /** Rename / edit text. Buildings get a label prompt, text annotations
      get the text content prompt. */
  onRename?: () => void;
  /** When this is a dimension drawing, surface a "flip side" toggle so
      the user can move the measurement label to the other side. */
  isDimension?: boolean;
  onFlipSide?: () => void;
  /** Tap-to-delete fallback (also fires on drop). */
  onDelete: () => void;
  /** Deselect / dismiss the bar without changing anything. */
  onDone: () => void;
};

const SWATCHES = ["#EF4444", "#F97316", "#FBBF24", "#22C55E", "#3B82F6", "#A855F7", "#0F172A", "#FFFFFF"];

const KIND_LABELS: Record<Kind, string> = {
  building: "Building",
  drawing: "Shape",
  text: "Text",
};

const MobileSelectionBar = forwardRef<HTMLDivElement, Props>(function MobileSelectionBar(
  { kind, hovered, opacity, onOpacityChange, color, onColorChange, onRotate, onRename, isDimension, onFlipSide, onDelete, onDone },
  ref,
) {
  const showStyleControls = kind !== "building";

  return (
    <div
      ref={ref}
      data-mobile-selection-bar
      // position: fixed so the bar is always anchored to the viewport
      // bottom — never clipped by the canvas wrapper, never lost below
      // the page fold. iOS Safari's URL bar / home indicator are kept
      // clear via safe-area-inset-bottom + a generous 18px gap.
      className="fixed left-3 right-3 z-50 pointer-events-auto"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" }}
    >
      {/* Hint pill above the bar so users know what to do */}
      <div className="text-center mb-1.5">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all ${
          hovered
            ? "bg-red-500 text-white scale-105"
            : "bg-gray-900/90 backdrop-blur text-amber-200"
        }`}>
          {hovered ? (
            <>
              <span>↓</span>
              Release to delete
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {KIND_LABELS[kind]} selected — drag to bin or tap delete
            </>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl ring-1 ring-white/10 px-2 py-1.5">
        {/* Left: style controls (drawings + text only) */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {showStyleControls && color && onColorChange && (
            <details className="relative flex-shrink-0">
              <summary className="list-none cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 active:bg-white/15">
                <span
                  className="w-6 h-6 rounded-full border-2 border-white/40 shadow-inner"
                  style={{ backgroundColor: color }}
                  aria-label="Pick colour"
                />
              </summary>
              <div className="absolute bottom-full left-0 mb-1.5 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-2 flex flex-wrap gap-1 w-[176px] z-10">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    onClick={() => onColorChange(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      color === c ? "border-white scale-110" : "border-white/30 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Colour ${c}`}
                  />
                ))}
              </div>
            </details>
          )}

          {showStyleControls && typeof opacity === "number" && onOpacityChange && (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[9px] font-bold text-white/60 flex-shrink-0">OPACITY</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
                className="flex-1 min-w-[60px] h-1 accent-amber-400"
                aria-label="Opacity"
              />
              <span className="text-[10px] font-mono text-white/80 w-8 text-right flex-shrink-0">{Math.round(opacity * 100)}%</span>
            </div>
          )}

        </div>

        {/* Right: per-kind actions (rotate / rename / flip) + trash + done.
            Icon-only buttons so the bar stays narrow on small phones. */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onRotate && (
            <button
              onClick={onRotate}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90"
              title="Rotate 90°"
              aria-label="Rotate 90 degrees"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Refresh-style circular arrow */}
                <path d="M20.5 12a8.5 8.5 0 1 1-3.1-6.55" />
                <polyline points="20.5 3.5 20.5 9 15 9" />
              </svg>
            </button>
          )}
          {onRename && (
            <button
              onClick={onRename}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white/90"
              title={kind === "text" ? "Edit text" : "Rename"}
              aria-label={kind === "text" ? "Edit text" : "Rename"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Pencil */}
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}
          {isDimension && onFlipSide && (
            <button
              onClick={onFlipSide}
              className="flex items-center gap-1 px-2.5 h-10 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white/90"
              title="Move the dimension label to the other side"
              aria-label="Flip dimension label side"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 014-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              Flip
            </button>
          )}
          <button
            data-trash-slot
            onClick={onDelete}
            className={`flex items-center gap-1.5 px-3.5 h-10 rounded-xl text-[12px] font-bold transition-all ${
              hovered
                ? "bg-red-500 text-white scale-110 ring-2 ring-red-300 shadow-red-500/40 shadow-xl"
                : "bg-red-600 hover:bg-red-500 text-white shadow-md"
            }`}
            title="Delete (or drag the item here)"
            aria-label="Delete selected item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            Delete
          </button>

          <button
            onClick={onDone}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
            title="Deselect"
            aria-label="Deselect"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

export default MobileSelectionBar;
