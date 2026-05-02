"use client";

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
}: Props) {
  const isDrawing = tool === "freehand" || tool === "line" || tool === "polygon";
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
    return (
      <button
        key={name}
        onClick={() => onToolChange(active ? "select" : name)}
        title={title}
        className={`${btnBase} ${
          active
            ? "bg-amber-500 text-white border border-amber-500"
            : "border border-gray-200 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon}
        {label}
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
    <div className="space-y-2">
      {/* Tool selector */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 py-1.5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Draw</span>

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
          "Straight line — click and drag",
        )}

        {toolBtn(
          "polygon",
          "Area",
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 18 21 6 21 2 8.5" />
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

        {tool !== "select" && (
          <button
            onClick={() => onToolChange("select")}
            className={`${btnBase} ml-auto text-gray-500 hover:bg-gray-100`}
            title="Exit drawing mode"
          >
            Done
          </button>
        )}
      </div>

      {/* Style controls — drawing modes */}
      {isDrawing && (
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

      {/* Style controls — text mode */}
      {isText && (
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
