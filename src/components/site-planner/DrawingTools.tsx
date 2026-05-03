"use client";

import { useState, useRef, useEffect } from "react";
import { type ToolMode, type DrawStyle, type TextStyle } from "@/lib/site-planner/toolState";

const SWATCH_COLOURS = [
  "#EF4444", // red
  "#F97316", // orange
  "#FBBF24", // amber
  "#22C55E", // green
  "#3B82F6", // blue
  "#A855F7", // purple
  "#0F172A", // near-black
  "#FFFFFF", // white
];

/** Subset of Drawing fields that can be edited after creation. */
export type SelectedDrawingEdit = {
  color: string;
  thickness: number;
  dashed: boolean;
  opacity: number;
  closed: boolean;
  /** Set when the drawing is a dimension line — exposes the flip-side
      toggle in the edit row. */
  dimension?: boolean;
  dimensionFlip?: boolean;
};

/** Subset of TextItem fields that can be edited after creation. */
export type SelectedTextEdit = {
  color: string;
  fontSize: number;
  opacity: number;
  text: string;
};

type Props = {
  tool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
  drawStyle: DrawStyle;
  onDrawStyleChange: (style: DrawStyle) => void;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
  /** Optional clear/finish-area helpers */
  onClearDrawings?: () => void;
  /** Currently-selected drawing in the canvas (or null). Pass to render
      the post-creation editor row. */
  selectedDrawing?: SelectedDrawingEdit | null;
  onSelectedDrawingChange?: (patch: Partial<SelectedDrawingEdit>) => void;
  onSelectedDrawingDelete?: () => void;
  onDeselectDrawing?: () => void;
  /** Currently-selected text annotation in the canvas (or null). */
  selectedText?: SelectedTextEdit | null;
  onSelectedTextChange?: (patch: Partial<SelectedTextEdit>) => void;
  onSelectedTextDelete?: () => void;
  onDeselectText?: () => void;
  /** Compact mode squeezes everything into a single wrapping row — used on
      mobile where vertical space is precious. The Done button moves inline
      with the tool selectors and styles condense. */
  compact?: boolean;
  /** Shape tool — default size in metres for the next shape placement.
      Lives in parent state so the canvas + popover share it. */
  shapeSize?: number;
  onShapeSizeChange?: (m: number) => void;
};

const btnBase =
  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors";

export default function DrawingTools({
  tool,
  onToolChange,
  drawStyle,
  onDrawStyleChange,
  textStyle,
  onTextStyleChange,
  onClearDrawings,
  selectedDrawing,
  onSelectedDrawingChange,
  onSelectedDrawingDelete,
  onDeselectDrawing,
  selectedText,
  onSelectedTextChange,
  onSelectedTextDelete,
  onDeselectText,
  compact = false,
  shapeSize = 5,
  onShapeSizeChange,
}: Props) {
  const isDrawing =
    tool === "freehand" ||
    tool === "line" ||
    tool === "dimension" ||
    tool === "polygon" ||
    tool.startsWith("shape-");
  const isShapeMode = tool.startsWith("shape-");

  // Shape picker popover state — anchored under the Shape button. Click
  // a shape, the tool becomes "shape-<kind>" and the popover closes.
  const [shapesOpen, setShapesOpen] = useState(false);
  const shapesAnchorRef = useRef<HTMLDivElement>(null);
  // Click outside closes the popover
  useEffect(() => {
    if (!shapesOpen) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (shapesAnchorRef.current && !shapesAnchorRef.current.contains(e.target as Node)) {
        setShapesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [shapesOpen]);
  const isText = tool === "text";
  const hasSelectedDrawing = !!selectedDrawing && !!onSelectedDrawingChange;
  const hasSelectedText = !!selectedText && !!onSelectedTextChange;

  const toolBtn = (
    name: ToolMode,
    label: string,
    icon: React.ReactNode,
    title: string,
  ) => {
    const active = tool === name;
    const baseCls = compact
      ? "flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
      : btnBase;
    return (
      <button
        key={name}
        onClick={() => onToolChange(active ? "select" : name)}
        title={title}
        aria-label={label}
        className={`${baseCls} ${
          active
            ? "bg-amber-500 text-white border border-amber-500"
            : "border border-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon}
        {!compact && label}
      </button>
    );
  };

  const swatch = (c: string, current: string, onChange: (c: string) => void) => (
    <button
      key={c}
      onClick={() => onChange(c)}
      className={`w-5 h-5 rounded-full border transition-transform ${
        current === c ? "border-gray-900 scale-110" : "border-gray-300"
      }`}
      style={{ backgroundColor: c }}
      title={c}
      aria-label={`Pick colour ${c}`}
    />
  );

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {/* Tool selector */}
      <div className={`flex flex-wrap items-center gap-1.5 bg-white rounded-xl border border-gray-200 ${compact ? "px-2 py-1" : "px-3 py-1.5"}`}>
        {!compact && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Draw</span>
        )}

        {toolBtn(
          "freehand",
          "Pen",
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>,
          "Freehand pen",
        )}

        {toolBtn(
          "line",
          "Line",
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="4" y1="20" x2="20" y2="4" />
          </svg>,
          "Straight line — tap start, tap end",
        )}

        {toolBtn(
          "dimension",
          "Dim",
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Dashed dimension line with arrowheads each end — line spans
                edge-to-edge with the arrows tucked at the very ends so the
                dashed measurement is visible at small sizes. */}
            <line x1="2" y1="12" x2="22" y2="12" strokeDasharray="3 2" />
            <polyline points="2 12 6 9 6 15 2 12" fill="currentColor" />
            <polyline points="22 12 18 9 18 15 22 12" fill="currentColor" />
          </svg>,
          "Dimension line — tap two points to mark a measurement",
        )}

        {toolBtn(
          "polygon",
          "Area",
          // Square box with "m²" inside — reads as "this tool measures
          // an area in square metres" much more directly than a
          // generic polygon glyph.
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1.5" />
            <text
              x="12"
              y="16"
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="currentColor"
              stroke="none"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              m²
            </text>
          </svg>,
          "Click to add corners. Click first point or double-click to close (work area)",
        )}

        {toolBtn(
          "text",
          "Text",
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>,
          "Add free text",
        )}

        {/* Shape picker — opens a small popover of standard shapes
            (rectangle / circle / triangle). Picking one switches the
            tool to "shape-<kind>"; tapping the canvas drops a 5×5m
            shape there using the current colour / opacity / dashed
            settings. Tap "Done" to exit shape mode. */}
        <div ref={shapesAnchorRef} className="relative">
          <button
            type="button"
            onClick={() => setShapesOpen((v) => !v)}
            title="Standard shapes — rectangle, circle, triangle"
            aria-label="Add a standard shape"
            aria-expanded={shapesOpen}
            className={`${
              compact
                ? "flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                : btnBase
            } ${
              isShapeMode
                ? "bg-amber-500 text-white border border-amber-500"
                : "border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Three nested standard shapes — rect + circle + triangle */}
              <rect x="3" y="3" width="9" height="9" rx="0.5" />
              <circle cx="17" cy="7.5" r="4.5" />
              <polygon points="12 21 3 21 7.5 13" />
            </svg>
            {!compact && "Shape"}
          </button>

          {shapesOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl border border-gray-200 shadow-xl p-2 w-[280px]">
              <div className="grid grid-cols-4 gap-1 mb-2">
                {/* Geometric shapes */}
                {[
                  { kind: "shape-rect" as const, title: "Rectangle", svg: <rect x="4" y="6" width="16" height="12" rx="1" /> },
                  { kind: "shape-circle" as const, title: "Circle", svg: <circle cx="12" cy="12" r="8" /> },
                  { kind: "shape-triangle" as const, title: "Triangle", svg: <polygon points="12 4 21 20 3 20" /> },
                  {
                    kind: "shape-arrow" as const,
                    title: "All-direction arrow",
                    svg: (
                      <>
                        <line x1="12" y1="3" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <polyline points="9 6 12 3 15 6" />
                        <polyline points="6 9 3 12 6 15" />
                        <polyline points="9 18 12 21 15 18" />
                        <polyline points="18 9 21 12 18 15" />
                      </>
                    ),
                  },
                  {
                    kind: "shape-car" as const,
                    title: "Car (4×2 m)",
                    svg: (
                      <>
                        <rect x="3" y="9" width="18" height="6" rx="1.5" />
                        <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
                        <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
                      </>
                    ),
                  },
                  {
                    kind: "shape-bus" as const,
                    title: "Bus (12×2.5 m)",
                    svg: (
                      <>
                        <rect x="3" y="6" width="18" height="11" rx="1.5" />
                        <line x1="3" y1="11" x2="21" y2="11" />
                        <line x1="9" y1="6" x2="9" y2="11" />
                        <line x1="15" y1="6" x2="15" y2="11" />
                        <circle cx="7" cy="19" r="1.2" fill="currentColor" />
                        <circle cx="17" cy="19" r="1.2" fill="currentColor" />
                      </>
                    ),
                  },
                  {
                    kind: "shape-truck" as const,
                    title: "Truck (8×2.5 m)",
                    svg: (
                      <>
                        <rect x="3" y="8" width="11" height="9" rx="1" />
                        <path d="M14 11h4l3 3v3h-7z" />
                        <circle cx="7" cy="19" r="1.4" fill="currentColor" />
                        <circle cx="17" cy="19" r="1.4" fill="currentColor" />
                      </>
                    ),
                  },
                ].map(({ kind, title, svg }) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => {
                      onToolChange(kind);
                      setShapesOpen(false);
                    }}
                    title={title}
                    aria-label={title}
                    className={`flex items-center justify-center h-11 rounded-lg ${
                      tool === kind ? "bg-amber-500 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {svg}
                    </svg>
                  </button>
                ))}
              </div>

              {/* Size slider — sets the default size for the next shape
                  placement (the longer side will be this many metres). */}
              {onShapeSizeChange && (
                <div className="flex items-center gap-2 px-1.5 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size</span>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={shapeSize}
                    onChange={(e) => onShapeSizeChange(parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-amber-500"
                    aria-label="Shape size"
                  />
                  <span className="text-[11px] font-mono text-gray-700 w-12 text-right">{shapeSize.toFixed(1)} m</span>
                </div>
              )}
            </div>
          )}
        </div>

        {tool !== "select" && (
          <button
            onClick={() => onToolChange("select")}
            className={
              compact
                ? "ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[11px] font-bold shadow-sm hover:bg-gray-800 active:bg-black transition-colors"
                : `${btnBase} ml-auto bg-gray-900 text-white border border-gray-900 hover:bg-gray-800`
            }
            title="Exit drawing mode"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Done
          </button>
        )}
      </div>

      {/* Compact style row — splits cleanly into two short sub-rows so the
          opacity %, dashed toggle, and thickness value never get clipped on
          a 375px iPhone. Top sub-row: colours + Solid/Dashed. Bottom
          sub-row: thickness + flex-1 opacity slider with always-visible %. */}
      {compact && isDrawing && (
        <div className="flex flex-col gap-1.5 bg-white rounded-xl border border-amber-200 px-2 py-1.5">
          {/* Sub-row 1 — colours pinned left, line-style on right */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
              {SWATCH_COLOURS.slice(0, 6).map((c) =>
                swatch(c, drawStyle.color, (color) => onDrawStyleChange({ ...drawStyle, color })),
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => onDrawStyleChange({ ...drawStyle, dashed: false })}
                className={`w-9 h-7 flex items-center justify-center rounded transition-colors ${
                  !drawStyle.dashed ? "bg-gray-900 text-white" : "text-gray-500 border border-gray-200 hover:bg-gray-100"
                }`}
                title="Solid line"
                aria-label="Solid line"
                aria-pressed={!drawStyle.dashed}
              >
                <svg width="20" height="6" viewBox="0 0 20 6"><line x1="1" y1="3" x2="19" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <button
                onClick={() => onDrawStyleChange({ ...drawStyle, dashed: true })}
                className={`w-9 h-7 flex items-center justify-center rounded transition-colors ${
                  drawStyle.dashed ? "bg-gray-900 text-white" : "text-gray-500 border border-gray-200 hover:bg-gray-100"
                }`}
                title="Dashed line"
                aria-label="Dashed line"
                aria-pressed={drawStyle.dashed}
              >
                {/* Wider gaps so the dashed pattern is unmistakable next
                    to the solid line button. */}
                <svg width="22" height="6" viewBox="0 0 22 6"><line x1="1" y1="3" x2="21" y2="3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 4" /></svg>
              </button>
            </div>
          </div>

          {/* Sub-row 2 — thickness on left, opacity takes the rest with % */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thick</span>
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={drawStyle.thickness}
                onChange={(e) => onDrawStyleChange({ ...drawStyle, thickness: parseInt(e.target.value, 10) })}
                className="w-16 h-1 accent-amber-500"
                aria-label="Thickness"
              />
              <span className="text-[10px] text-gray-500 w-3 text-right">{drawStyle.thickness}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={drawStyle.opacity}
                onChange={(e) => onDrawStyleChange({ ...drawStyle, opacity: parseFloat(e.target.value) })}
                className="flex-1 min-w-0 h-1 accent-amber-500"
                aria-label="Opacity"
              />
              <span className="text-[10px] text-gray-600 font-mono w-9 text-right">{Math.round(drawStyle.opacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}
      {compact && isText && (
        <div className="flex flex-col gap-1.5 bg-white rounded-xl border border-amber-200 px-2 py-1.5">
          {/* Sub-row 1 — colours */}
          <div className="flex items-center gap-0.5">
            {SWATCH_COLOURS.slice(0, 6).map((c) =>
              swatch(c, textStyle.color, (color) => onTextStyleChange({ ...textStyle, color })),
            )}
          </div>

          {/* Sub-row 2 — size + opacity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size</span>
              <input
                type="range"
                min={10}
                max={48}
                step={2}
                value={textStyle.fontSize}
                onChange={(e) => onTextStyleChange({ ...textStyle, fontSize: parseInt(e.target.value, 10) })}
                className="w-16 h-1 accent-amber-500"
                aria-label="Text size"
              />
              <span className="text-[10px] text-gray-500 w-7 text-right">{textStyle.fontSize}px</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={textStyle.opacity}
                onChange={(e) => onTextStyleChange({ ...textStyle, opacity: parseFloat(e.target.value) })}
                className="flex-1 min-w-0 h-1 accent-amber-500"
                aria-label="Opacity"
              />
              <span className="text-[10px] text-gray-600 font-mono w-9 text-right">{Math.round(textStyle.opacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Style controls — drawing modes (full row, desktop only).
          On mobile (compact) the style controls are folded into the
          tool selector row above. */}
      {isDrawing && !compact && (
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-amber-200 px-3 py-2">
          {/* Colour */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Colour</span>
            <div className="flex items-center gap-1">
              {SWATCH_COLOURS.map((c) =>
                swatch(c, drawStyle.color, (color) => onDrawStyleChange({ ...drawStyle, color })),
              )}
            </div>
          </div>

          {/* Thickness */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thickness</span>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={drawStyle.thickness}
              onChange={(e) => onDrawStyleChange({ ...drawStyle, thickness: parseInt(e.target.value, 10) })}
              className="w-24 h-1 accent-amber-500"
            />
            <span className="text-[10px] text-gray-500 w-4">{drawStyle.thickness}</span>
          </div>

          {/* Solid / Dashed */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onDrawStyleChange({ ...drawStyle, dashed: false })}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                !drawStyle.dashed ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              ─── Solid
            </button>
            <button
              onClick={() => onDrawStyleChange({ ...drawStyle, dashed: true })}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                drawStyle.dashed ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              ‒ ‒ Dashed
            </button>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={drawStyle.opacity}
              onChange={(e) => onDrawStyleChange({ ...drawStyle, opacity: parseFloat(e.target.value) })}
              className="w-20 h-1 accent-amber-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{Math.round(drawStyle.opacity * 100)}%</span>
          </div>

          {onClearDrawings && (
            <button
              onClick={onClearDrawings}
              className={`${btnBase} ml-auto text-red-600 border border-red-200 hover:bg-red-50`}
              title="Clear all drawings"
            >
              Clear drawings
            </button>
          )}
        </div>
      )}

      {/* Style controls — text mode (desktop only) */}
      {isText && !compact && (
        <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-amber-200 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Colour</span>
            <div className="flex items-center gap-1">
              {SWATCH_COLOURS.map((c) =>
                swatch(c, textStyle.color, (color) => onTextStyleChange({ ...textStyle, color })),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size</span>
            <input
              type="range"
              min={10}
              max={48}
              step={2}
              value={textStyle.fontSize}
              onChange={(e) => onTextStyleChange({ ...textStyle, fontSize: parseInt(e.target.value, 10) })}
              className="w-24 h-1 accent-amber-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{textStyle.fontSize}px</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={textStyle.opacity}
              onChange={(e) => onTextStyleChange({ ...textStyle, opacity: parseFloat(e.target.value) })}
              className="w-20 h-1 accent-amber-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{Math.round(textStyle.opacity * 100)}%</span>
          </div>

          <span className="text-[10px] text-gray-400 italic">Click on the canvas to drop text</span>
        </div>
      )}

      {/* ─── Edit selected drawing ──────────────────────────────────
          Shown whenever a drawing (line / freehand / area) is selected.
          Lets the user re-style or delete it after creation. */}
      {hasSelectedDrawing && selectedDrawing && onSelectedDrawingChange && (
        <div className="flex flex-wrap items-center gap-3 bg-blue-50 rounded-xl border border-blue-300 px-3 py-2">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            {selectedDrawing.closed ? "Edit area" : "Edit line"}
          </span>

          {/* Colour */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Colour</span>
            <div className="flex items-center gap-1">
              {SWATCH_COLOURS.map((c) =>
                swatch(c, selectedDrawing.color, (color) => onSelectedDrawingChange({ color })),
              )}
            </div>
          </div>

          {/* Thickness */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Thickness</span>
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={selectedDrawing.thickness}
              onChange={(e) => onSelectedDrawingChange({ thickness: parseInt(e.target.value, 10) })}
              className="w-24 h-1 accent-blue-500"
            />
            <span className="text-[10px] text-gray-500 w-4">{selectedDrawing.thickness}</span>
          </div>

          {/* Solid / Dashed */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectedDrawingChange({ dashed: false })}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                !selectedDrawing.dashed ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              ─── Solid
            </button>
            <button
              onClick={() => onSelectedDrawingChange({ dashed: true })}
              className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                selectedDrawing.dashed ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              ‒ ‒ Dashed
            </button>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedDrawing.opacity}
              onChange={(e) => onSelectedDrawingChange({ opacity: parseFloat(e.target.value) })}
              className="w-20 h-1 accent-blue-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{Math.round(selectedDrawing.opacity * 100)}%</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Flip-side toggle for dimension lines — moves the
                measurement label to the other side of the line. */}
            {selectedDrawing.dimension && (
              <button
                onClick={() => onSelectedDrawingChange({ dimensionFlip: !selectedDrawing.dimensionFlip })}
                className={`${btnBase} text-gray-700 border border-gray-200 hover:bg-gray-50`}
                title="Flip the dimension label to the other side"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                Flip
              </button>
            )}
            {onSelectedDrawingDelete && (
              <button
                onClick={onSelectedDrawingDelete}
                className={`${btnBase} text-red-600 border border-red-200 hover:bg-red-50`}
                title="Delete this drawing"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Delete
              </button>
            )}
            {onDeselectDrawing && (
              <button
                onClick={onDeselectDrawing}
                className={`${btnBase} text-gray-600 border border-gray-200 hover:bg-gray-50`}
                title="Deselect"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Edit selected text annotation ─────────────────────────── */}
      {hasSelectedText && selectedText && onSelectedTextChange && (
        <div className="flex flex-wrap items-center gap-3 bg-blue-50 rounded-xl border border-blue-300 px-3 py-2">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Edit text</span>

          {/* Colour */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Colour</span>
            <div className="flex items-center gap-1">
              {SWATCH_COLOURS.map((c) =>
                swatch(c, selectedText.color, (color) => onSelectedTextChange({ color })),
              )}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Size</span>
            <input
              type="range"
              min={10}
              max={48}
              step={2}
              value={selectedText.fontSize}
              onChange={(e) => onSelectedTextChange({ fontSize: parseInt(e.target.value, 10) })}
              className="w-24 h-1 accent-blue-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{selectedText.fontSize}px</span>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Opacity</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedText.opacity}
              onChange={(e) => onSelectedTextChange({ opacity: parseFloat(e.target.value) })}
              className="w-20 h-1 accent-blue-500"
            />
            <span className="text-[10px] text-gray-500 w-7">{Math.round(selectedText.opacity * 100)}%</span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {onSelectedTextDelete && (
              <button
                onClick={onSelectedTextDelete}
                className={`${btnBase} text-red-600 border border-red-200 hover:bg-red-50`}
                title="Delete this text"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Delete
              </button>
            )}
            {onDeselectText && (
              <button
                onClick={onDeselectText}
                className={`${btnBase} text-gray-600 border border-gray-200 hover:bg-gray-50`}
                title="Deselect"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
