"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Stage, Layer, Line, Rect, Text as KonvaText, Image as KonvaImage, Circle, Arrow, Group } from "react-konva";
import BuildingShape from "./BuildingShape";
import MobileSelectionBar from "./MobileSelectionBar";
import { getBuildingType } from "@/lib/site-planner/buildings";
import {
  PIXELS_PER_METRE,
  CANVAS_WIDTH_M,
  CANVAS_HEIGHT_M,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from "@/lib/site-planner/constants";
import { computeBuildingsBoundsPx } from "@/lib/site-planner/exportUtils";
import MapControls from "./MapControls";
import type { Drawing, PlacedBuilding, TextItem } from "@/lib/site-planner/usePlannerState";
import type { ToolMode, DrawStyle, TextStyle } from "@/lib/site-planner/toolState";
import type Konva from "konva";

export type MapData = {
  image: HTMLImageElement;
  scale: number; // canvas pixels per map pixel
  x: number; // position in canvas pixels
  y: number;
};

/* ─── Geometry helpers ─────────────────────────────────────────── */

/** Total length of a polyline in pixels. Adds the closing segment for polygons. */
function computePathLength(points: number[], closed: boolean): number {
  if (points.length < 4) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 2; i += 2) {
    total += Math.hypot(points[i + 2] - points[i], points[i + 3] - points[i + 1]);
  }
  if (closed) {
    total += Math.hypot(points[0] - points[points.length - 2], points[1] - points[points.length - 1]);
  }
  return total;
}

/** Signed polygon area via the shoelace formula. Returns pixel². */
function computePolygonArea(points: number[]): number {
  const n = points.length / 2;
  if (n < 3) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    sum += points[i * 2] * points[j * 2 + 1];
    sum -= points[j * 2] * points[i * 2 + 1];
  }
  return sum / 2;
}

/** Centroid of a polygon. Falls back to point-average for degenerate cases. */
function computeCentroid(points: number[]): { x: number; y: number } {
  const n = points.length / 2;
  if (n === 0) return { x: 0, y: 0 };
  // Mean of vertices (good enough for label placement)
  let sx = 0,
    sy = 0;
  for (let i = 0; i < n; i++) {
    sx += points[i * 2];
    sy += points[i * 2 + 1];
  }
  return { x: sx / n, y: sy / n };
}

/** Midpoint of an open path (mid-vertex for stable label placement). */
function computeMidpoint(points: number[]): { x: number; y: number } | null {
  if (points.length < 2) return null;
  const midIdx = Math.floor(points.length / 4) * 2; // even index
  return { x: points[midIdx], y: points[midIdx + 1] };
}

/** Format a m² area with sensible precision. */
function formatArea(m2: number): string {
  if (m2 >= 1000) return `${m2.toFixed(0)} m²`;
  if (m2 >= 100) return `${m2.toFixed(1)} m²`;
  return `${m2.toFixed(2)} m²`;
}

/** Convert "#RRGGBB" + alpha (0–1) to "rgba(r,g,b,a)". */
function hexToRGBA(hex: string, alpha: number): string {
  const m = hex.match(/^#?([\da-f]{6})$/i);
  if (!m) return hex;
  const r = parseInt(m[1].slice(0, 2), 16);
  const g = parseInt(m[1].slice(2, 4), 16);
  const b = parseInt(m[1].slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Props = {
  buildings: PlacedBuilding[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onLabelEdit?: (id: string) => void;
  /** Lets the canvas delete a building when the user drops it on the
      mobile trash chip. Optional — drag-to-trash falls back to no-op
      when not provided. */
  onRemoveBuilding?: (id: string) => void;
  /** Rotate a building 90° clockwise — wired to the mobile selection
      bar's rotate button. */
  onRotateBuilding?: (id: string) => void;
  onAdd: (typeId: string, x: number, y: number, label: string) => void;
  onAddCustom?: (widthM: number, depthM: number, x: number, y: number, label: string) => void;
  stageRef: React.RefObject<Konva.Stage>;
  mapData?: MapData | null;
  mapOpacity?: number;
  mapRotation?: number;
  onMapMove?: (x: number, y: number) => void;
  onMapRotation?: (degrees: number) => void;
  /** When true, the map can't be dragged or rotated by handle. */
  mapLocked?: boolean;
  onMapLockedChange?: (locked: boolean) => void;
  /** Scale multiplier on top of the satellite imagery's native scale. */
  mapScaleMultiplier?: number;
  onMapScaleChange?: (mul: number) => void;
  /** When true, dragging the map shifts buildings/drawings/texts with it. */
  moveSiteAsOne?: boolean;
  onMoveSiteAsOneChange?: (on: boolean) => void;
  onMapRecenter?: () => void;
  onMapDragShift?: (dxMetres: number, dyMetres: number) => void;
  /** Fetch additional satellite tiles centred at the given canvas-pixel
      coordinates and composite them onto the existing map. Wired to the
      "+ Add map here" button that appears when the user has panned to
      whitespace beyond the loaded imagery. */
  onMapExtend?: (canvasX: number, canvasY: number) => void;
  sunDirection?: number | null;
  /** Drawings + text annotations */
  drawings?: Drawing[];
  texts?: TextItem[];
  onAddDrawing?: (drawing: Omit<Drawing, "id">) => void;
  onRemoveDrawing?: (id: string) => void;
  onUpdateDrawing?: (id: string, patch: Partial<Omit<Drawing, "id">>) => void;
  onAddText?: (item: Omit<TextItem, "id">) => void;
  onMoveText?: (id: string, x: number, y: number) => void;
  onUpdateText?: (id: string, patch: Partial<Omit<TextItem, "id">>) => void;
  onRemoveText?: (id: string) => void;
  /** Notifies the parent which drawing / text the user has currently selected
      (or null when nothing is selected) so it can render edit-after-creation
      controls. */
  onSelectionChange?: (sel: { drawingId: string | null; textId: string | null }) => void;
  /** Active tool mode + style */
  tool?: ToolMode;
  /** Allow the canvas to switch the active tool (e.g. when the user taps an
      existing drawing in pen/area mode, we flip to "select" so the edit
      panel shows up and they can drag/delete the shape). */
  onToolChange?: (tool: ToolMode) => void;
  drawStyle?: DrawStyle;
  textStyle?: TextStyle;
  /** Default size (metres) for the next Shape-tool placement. Used as
      "longer side" for elongated shapes (cars/buses/trucks) and as the
      bounding-box side for rect/circle/triangle/arrow. */
  shapeSize?: number;
  /** Mobile: building type ID queued for tap-to-place */
  placingTypeId?: string | null;
  placingLabel?: string;
  onPlaced?: () => void;
  /** Mobile: pop the building selection picker. Wired to a prominent
      floating "+ Add Items" button overlaid on the canvas. */
  onRequestAdd?: () => void;
  isMobile?: boolean;
};

export default function PlannerCanvas({
  buildings,
  selectedId,
  onSelect,
  onMove,
  onLabelEdit,
  onRemoveBuilding,
  onRotateBuilding,
  onAdd,
  onAddCustom,
  stageRef,
  mapData,
  mapOpacity = 0.7,
  mapRotation = 0,
  onMapMove,
  onMapRotation,
  mapLocked = false,
  onMapLockedChange,
  mapScaleMultiplier = 1,
  onMapScaleChange,
  moveSiteAsOne = false,
  onMoveSiteAsOneChange,
  onMapRecenter,
  onMapDragShift,
  onMapExtend,
  sunDirection,
  drawings = [],
  texts = [],
  onAddDrawing,
  onRemoveDrawing,
  onUpdateDrawing,
  onAddText,
  onMoveText,
  onUpdateText,
  onRemoveText,
  onSelectionChange,
  tool = "select",
  onToolChange,
  drawStyle,
  textStyle,
  shapeSize = 5,
  placingTypeId,
  placingLabel,
  onPlaced,
  onRequestAdd,
  isMobile,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [initialFit, setInitialFit] = useState(false);

  // Desktop map-controls panel collapse state. Auto-opens whenever a
  // fresh map loads (so the user can position it), collapses when the
  // user hits Done, and re-opens via the "Edit map" pill that takes
  // its place.
  const [mapPanelOpen, setMapPanelOpen] = useState(true);
  useEffect(() => {
    if (mapData) setMapPanelOpen(true);
  }, [mapData]);

  // In-progress drawing buffer (current freehand stroke or polygon vertices)
  const [activeStroke, setActiveStroke] = useState<number[] | null>(null);
  const [activePolygon, setActivePolygon] = useState<number[] | null>(null);

  // Text input overlay (HTML positioned over the stage)
  const [textInput, setTextInput] = useState<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const [textInputValue, setTextInputValue] = useState("");

  // Selection state for texts and drawings (so they can be edited / deleted)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);

  // Mobile trash drop-zone — see <MobileSelectionBar/>. The bar exposes a
  // [data-trash-slot] element; we hit-test pointer position against its
  // bounding rect during a building / text drag to give the iOS-style
  // "drag to trash" feel.
  const trashRef = useRef<HTMLDivElement>(null);
  const [trashHover, setTrashHover] = useState(false);
  const isOverTrash = useCallback((clientPoint: { x: number; y: number } | null) => {
    if (!clientPoint || !trashRef.current) return false;
    const slot = trashRef.current.querySelector("[data-trash-slot]") as HTMLElement | null;
    const rect = (slot ?? trashRef.current).getBoundingClientRect();
    return (
      clientPoint.x >= rect.left &&
      clientPoint.x <= rect.right &&
      clientPoint.y >= rect.top &&
      clientPoint.y <= rect.bottom
    );
  }, []);

  // Surface selection changes to the parent so it can render edit controls
  useEffect(() => {
    onSelectionChange?.({ drawingId: selectedDrawingId, textId: selectedTextId });
  }, [selectedDrawingId, selectedTextId, onSelectionChange]);

  // Reset in-progress sketches when the tool changes
  useEffect(() => {
    setActiveStroke(null);
    setActivePolygon(null);
    setTextInput(null);
    setSelectedTextId(null);
    setSelectedDrawingId(null);
  }, [tool]);

  // Translate a stage pointer event into canvas-space pixel coords
  const pointerToCanvas = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    const p = stage.getPointerPosition();
    if (!p) return null;
    return {
      x: (p.x - stagePos.x) / zoom,
      y: (p.y - stagePos.y) / zoom,
      screen: p,
    };
  }, [stageRef, stagePos, zoom]);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      setDims({ w, h });
      if (!initialFit && w > 0) {
        const canvasW = CANVAS_WIDTH_M * PIXELS_PER_METRE;
        const canvasH = CANVAS_HEIGHT_M * PIXELS_PER_METRE;
        const fitZoom = Math.min(w / canvasW, h / canvasH) * 0.95;
        // Clamp to MIN_ZOOM so tiny viewports don't end up at 5%
        // (where the canvas turns into a blank haze).
        setZoom(Math.max(MIN_ZOOM, Math.min(1, fitZoom)));
        setInitialFit(true);
      }
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, [initialFit]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const oldZoom = zoom;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const dir = e.evt.deltaY > 0 ? -1 : 1;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZoom + dir * ZOOM_STEP));

      const mousePointTo = {
        x: (pointer.x - stagePos.x) / oldZoom,
        y: (pointer.y - stagePos.y) / oldZoom,
      };

      setZoom(newZoom);
      setStagePos({
        x: pointer.x - mousePointTo.x * newZoom,
        y: pointer.y - mousePointTo.y * newZoom,
      });
    },
    [zoom, stagePos, stageRef],
  );

  // Handle drag from palette (HTML5 drop)
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const typeId = e.dataTransfer.getData("buildingTypeId");
      const label = e.dataTransfer.getData("buildingLabel");
      const customWidth = e.dataTransfer.getData("customWidth");
      const customDepth = e.dataTransfer.getData("customDepth");
      const customMode = e.dataTransfer.getData("customMode"); // "deck" or empty
      if (!typeId) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - stagePos.x) / zoom / PIXELS_PER_METRE;
      const y = (e.clientY - rect.top - stagePos.y) / zoom / PIXELS_PER_METRE;

      if (customWidth && customDepth) {
        // Category-flagged customs use onAdd with the resolved typeId so the
        // custom-deck-WxD / custom-complex-WxD path through getBuildingType
        // picks the right colours and category. Generic shapes go through
        // onAddCustom which builds a custom-WxD type.
        if (customMode === "deck" || customMode === "complex") {
          const type = getBuildingType(typeId);
          if (type) {
            onAdd(typeId, x - type.widthM / 2, y - type.depthM / 2, label || type.shortLabel);
          }
        } else if (onAddCustom) {
          const w = parseFloat(customWidth);
          const d = parseFloat(customDepth);
          onAddCustom(w, d, x - w / 2, y - d / 2, label || `${w}×${d}m`);
        }
      } else {
        const type = getBuildingType(typeId);
        if (!type) return;
        onAdd(typeId, x - type.widthM / 2, y - type.depthM / 2, label);
      }
    },
    [zoom, stagePos, onAdd, onAddCustom],
  );

  /**
   * Click/tap dedupe: Konva fires BOTH `click` and `tap` for a single
   * touch on mobile, so the click handler ran twice per tap. That broke
   * the line / dimension two-tap flow (the second invocation found the
   * anchor that the first invocation just set, then computed a
   * zero-length commit and cleared it — the user saw the anchor flash
   * on and back off and no line drew on the second tap). 50ms is a
   * generous window for the within-same-tap double-fire, well below
   * any human's tap-tap rhythm.
   */
  const lastTapHandledAt = useRef(0);

  // Click/tap on empty space — place building (mobile), drop text, or deselect
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now - lastTapHandledAt.current < 60) return;
      lastTapHandledAt.current = now;
      if (e.target !== e.target.getStage()) return;

      // Mobile tap-to-place
      if (placingTypeId && onPlaced) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const x = (pointer.x - stagePos.x) / zoom / PIXELS_PER_METRE;
        const y = (pointer.y - stagePos.y) / zoom / PIXELS_PER_METRE;

        // Resolve via getBuildingType — handles fixed types and all custom
        // variants (custom-WxD, custom-deck-WxD, custom-complex-WxD).
        const type = getBuildingType(placingTypeId);
        if (type) {
          onAdd(placingTypeId, x - type.widthM / 2, y - type.depthM / 2, placingLabel || type.shortLabel);
        }
        onPlaced();
        return;
      }

      // Text mode — drop a text input at the click point
      if (tool === "text" && onAddText && textStyle) {
        const stage = stageRef.current;
        const container = containerRef.current;
        if (!stage || !container) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const cRect = container.getBoundingClientRect();
        setTextInput({
          x: (pointer.x - stagePos.x) / zoom,
          y: (pointer.y - stagePos.y) / zoom,
          clientX: cRect.left + pointer.x,
          clientY: cRect.top + pointer.y,
        });
        setTextInputValue("");
        return;
      }

      // Polygon mode — append a vertex (or close if near the start)
      if (tool === "polygon" && onAddDrawing && drawStyle) {
        const c = pointerToCanvas();
        if (!c) return;
        if (!activePolygon) {
          setActivePolygon([c.x, c.y]);
          return;
        }
        // Close if we clicked near the first point
        const fx = activePolygon[0];
        const fy = activePolygon[1];
        const closeDistPx = 12 / zoom;
        if (
          activePolygon.length >= 6 &&
          Math.hypot(c.x - fx, c.y - fy) <= closeDistPx
        ) {
          onAddDrawing({
            points: activePolygon,
            color: drawStyle.color,
            thickness: drawStyle.thickness,
            dashed: drawStyle.dashed,
            closed: true,
            opacity: drawStyle.opacity,
          });
          setActivePolygon(null);
          return;
        }
        setActivePolygon([...activePolygon, c.x, c.y]);
        return;
      }

      // Shape mode — tap once to drop a standard shape centred on the
      // tap point. Stays in shape mode so the user can drop more; "Done"
      // exits to select. Size comes from `shapeSize` (in metres) which
      // the user adjusts via the slider in the Shape popover.
      if (tool.startsWith("shape-") && onAddDrawing && drawStyle) {
        const c = pointerToCanvas();
        if (!c) return;
        const ppm = PIXELS_PER_METRE;
        const sizeM = Math.max(0.5, shapeSize);
        const halfPx = (sizeM * ppm) / 2;
        let pts: number[] = [];
        if (tool === "shape-rect") {
          pts = [
            c.x - halfPx, c.y - halfPx,
            c.x + halfPx, c.y - halfPx,
            c.x + halfPx, c.y + halfPx,
            c.x - halfPx, c.y + halfPx,
          ];
        } else if (tool === "shape-circle") {
          const segs = 32;
          pts = [];
          for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            pts.push(c.x + Math.cos(a) * halfPx, c.y + Math.sin(a) * halfPx);
          }
        } else if (tool === "shape-triangle") {
          const r = halfPx * 1.05;
          pts = [
            c.x, c.y - r,
            c.x + r * Math.sin((2 * Math.PI) / 3), c.y - r * Math.cos((2 * Math.PI) / 3),
            c.x - r * Math.sin((2 * Math.PI) / 3), c.y - r * Math.cos((2 * Math.PI) / 3),
          ];
        } else if (tool.startsWith("shape-arrow-")) {
          // Single directional arrow (one of up/down/left/right) — handy
          // for marking traffic flow, vehicle access direction, gate
          // ingress, etc. The shape is a 7-vertex arrow defined for
          // "up" then rotated for the other directions.
          const dir = tool.slice("shape-arrow-".length);
          const tThick = halfPx * 0.25;  // shaft thickness (half-width)
          const aw = halfPx * 0.55;      // arrowhead half-width
          const ah = halfPx * 0.45;      // arrowhead height (from tip)
          // Local vertices for an UP arrow centred at origin
          const local: Array<[number, number]> = [
            [0, -halfPx],          // tip
            [aw, -halfPx + ah],    // right of tip base
            [tThick, -halfPx + ah],// right inner
            [tThick, halfPx],      // right bottom of shaft
            [-tThick, halfPx],     // left bottom of shaft
            [-tThick, -halfPx + ah],// left inner
            [-aw, -halfPx + ah],   // left of tip base
          ];
          // Rotate to direction
          const rotated: Array<[number, number]> = local.map(([x, y]) => {
            switch (dir) {
              case "down":  return [-x, -y];
              case "left":  return [y, -x];
              case "right": return [-y, x];
              default:      return [x, y]; // up
            }
          });
          pts = rotated.flatMap(([x, y]) => [c.x + x, c.y + y]);
        } else if (tool === "shape-car" || tool === "shape-bus" || tool === "shape-truck") {
          // Vehicle markers — render as a rectangle proportional to the
          // real vehicle. Width fixed (vehicle "length"), depth fixed at
          // a realistic ratio. shapeSize sets the LENGTH; depth follows.
          const ratios: Record<string, { lenRatio: number; widthM: number }> = {
            "shape-car":   { lenRatio: 1,    widthM: 2 },     // 4 × 2 m at sizeM=4
            "shape-bus":   { lenRatio: 1,    widthM: 2.5 },   // 12 × 2.5 m at sizeM=12
            "shape-truck": { lenRatio: 1,    widthM: 2.5 },   // 8 × 2.5 m at sizeM=8
          };
          // Default lengths if user hasn't bumped size from the 5m default
          const defaults: Record<string, number> = {
            "shape-car": 4, "shape-bus": 12, "shape-truck": 8,
          };
          const lenM = sizeM === 5 ? defaults[tool] ?? sizeM : sizeM;
          const cfg = ratios[tool];
          const lenPx = (lenM * cfg.lenRatio * ppm) / 2;
          const widPx = (cfg.widthM * ppm) / 2;
          pts = [
            c.x - lenPx, c.y - widPx,
            c.x + lenPx, c.y - widPx,
            c.x + lenPx, c.y + widPx,
            c.x - lenPx, c.y + widPx,
          ];
        }
        if (pts.length) {
          onAddDrawing({
            points: pts,
            color: drawStyle.color,
            thickness: drawStyle.thickness,
            dashed: drawStyle.dashed,
            closed: true,
            opacity: drawStyle.opacity,
          });
        }
        return;
      }

      // Line / dimension mode — two-click flow (matches polygon UX).
      // First tap drops an anchor circle, the line then follows the
      // pointer; second tap commits. Dimension lines are forced-dashed
      // and get arrowheads at both ends in the renderer.
      if ((tool === "line" || tool === "dimension") && onAddDrawing && drawStyle) {
        const c = pointerToCanvas();
        if (!c) return;
        if (!activeStroke) {
          // First tap — anchor the start point.
          setActiveStroke([c.x, c.y, c.x, c.y]);
          return;
        }
        // Second tap — commit unless zero-length.
        const dx = c.x - activeStroke[0];
        const dy = c.y - activeStroke[1];
        if (Math.hypot(dx, dy) >= 4 / zoom) {
          const isDim = tool === "dimension";
          onAddDrawing({
            points: [activeStroke[0], activeStroke[1], c.x, c.y],
            color: drawStyle.color,
            thickness: drawStyle.thickness,
            dashed: isDim ? true : drawStyle.dashed,
            closed: false,
            opacity: drawStyle.opacity,
            dimension: isDim || undefined,
          });
        }
        setActiveStroke(null);
        return;
      }

      onSelect(null);
      setSelectedTextId(null);
      setSelectedDrawingId(null);
    },
    [
      onSelect,
      placingTypeId,
      placingLabel,
      onPlaced,
      stageRef,
      stagePos,
      zoom,
      onAdd,
      onAddCustom,
      tool,
      onAddText,
      textStyle,
      onAddDrawing,
      drawStyle,
      activePolygon,
      activeStroke,
      pointerToCanvas,
    ],
  );

  // Double-click — close polygon if we're drawing one, or open label inline
  const handleStageDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (tool === "polygon" && activePolygon && activePolygon.length >= 6 && onAddDrawing && drawStyle) {
        e.evt.preventDefault();
        onAddDrawing({
          points: activePolygon,
          color: drawStyle.color,
          thickness: drawStyle.thickness,
          dashed: drawStyle.dashed,
          closed: true,
        });
        setActivePolygon(null);
      }
    },
    [tool, activePolygon, onAddDrawing, drawStyle],
  );

  // Mouse-down / touchstart → anchor a freehand stroke OR a straight line.
  // The line tool supports BOTH gestures so the user can choose what's
  // comfortable on a phone:
  //   • tap-and-drag: hold finger, drag to second point, lift = commit
  //   • tap-then-tap: tap, lift, drag finger across (no contact, no
  //     preview), tap again to commit. Same gesture as the polygon tool.
  // If a line is already mid-flight (waiting for second tap), this anchors
  // the second point to the new touch position.
  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      // Only the freehand pen draws on press-and-drag now. The straight
      // line tool is click-to-anchor / click-to-commit (handled in
      // handleStageClick) — same UX as polygon, much friendlier on touch.
      if (tool !== "freehand" || !drawStyle) return;
      if (e.target !== e.target.getStage()) return;
      const c = pointerToCanvas();
      if (!c) return;
      setActiveStroke([c.x, c.y]);
    },
    [tool, drawStyle, pointerToCanvas],
  );

  // Mouse-move → extend the in-progress freehand stroke, OR update the
  // second endpoint of the line preview (so the user sees where their
  // line will land before the second tap).
  const handleStageMouseMove = useCallback(() => {
    if (!activeStroke) return;
    const c = pointerToCanvas();
    if (!c) return;
    if (tool === "line" || tool === "dimension") {
      setActiveStroke([activeStroke[0], activeStroke[1], c.x, c.y]);
      return;
    }
    if (tool !== "freehand") return;
    const lastX = activeStroke[activeStroke.length - 2];
    const lastY = activeStroke[activeStroke.length - 1];
    if (Math.hypot(c.x - lastX, c.y - lastY) < 2 / zoom) return;
    setActiveStroke([...activeStroke, c.x, c.y]);
  }, [tool, activeStroke, pointerToCanvas, zoom]);

  const handleStageMouseUp = useCallback(() => {
    if (!activeStroke || !drawStyle || !onAddDrawing) return;
    // Only freehand commits on mouse-up — the line tool now commits via
    // its second click in handleStageClick.
    if (tool === "freehand" && activeStroke.length >= 4) {
      onAddDrawing({
        points: activeStroke,
        color: drawStyle.color,
        thickness: drawStyle.thickness,
        dashed: drawStyle.dashed,
        closed: false,
        opacity: drawStyle.opacity,
      });
      setActiveStroke(null);
      return;
    }
  }, [tool, activeStroke, drawStyle, onAddDrawing]);

  // Commit an inline text input
  const commitTextInput = useCallback(() => {
    if (!textInput || !onAddText || !textStyle) return;
    const value = textInputValue.trim();
    if (value) {
      onAddText({
        x: textInput.x,
        y: textInput.y,
        text: value,
        fontSize: textStyle.fontSize,
        color: textStyle.color,
        opacity: textStyle.opacity,
      });
    }
    setTextInput(null);
    setTextInputValue("");
    // No need to scroll the canvas back into view — the body-lock
    // effect prevents the page from moving in the first place, and
    // restores scroll on cleanup.
  }, [textInput, textInputValue, onAddText, textStyle]);

  useEffect(() => {
    if (textInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textInput]);

  // While the text input is open on mobile, freeze the document so iOS
  // Safari can't pull the page upwards to make room for the keyboard.
  // We pin the body in place at the current scroll, then restore on
  // close. The input itself is rendered position:fixed at the top of
  // the visual viewport, so it sits above the keyboard already and iOS
  // has no reason to scroll.
  useEffect(() => {
    if (!textInput || !isMobile) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [textInput, isMobile]);

  // Delete-key removes selected text annotation OR selected drawing
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isTextField =
        e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if ((e.key === "Delete" || e.key === "Backspace") && !isTextField) {
        if (selectedTextId && onRemoveText) {
          e.preventDefault();
          onRemoveText(selectedTextId);
          setSelectedTextId(null);
          return;
        }
        if (selectedDrawingId && onRemoveDrawing) {
          e.preventDefault();
          onRemoveDrawing(selectedDrawingId);
          setSelectedDrawingId(null);
          return;
        }
      }
      if (e.key === "Escape") {
        setActiveStroke(null);
        setActivePolygon(null);
        setTextInput(null);
        setSelectedDrawingId(null);
        setSelectedTextId(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedTextId, selectedDrawingId, onRemoveText, onRemoveDrawing]);

  // Pinch-to-zoom for touch.
  //
  // Konva's Stage `draggable` claims the first finger for stage panning, which
  // means subsequent touch events from a second finger don't reliably trigger
  // multi-touch zoom. The fix: when 2+ fingers come down, explicitly disable
  // Stage drag so pinch-zoom owns the interaction. We restore drag on touchend
  // once we're back to <2 fingers.
  const lastDist = useRef(0);
  const lastCenter = useRef({ x: 0, y: 0 });
  const wasDraggablePinch = useRef(false);

  const handleStageTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const stage = stageRef.current;
      if (stage && e.evt.touches.length >= 2) {
        if (!wasDraggablePinch.current) wasDraggablePinch.current = stage.draggable();
        stage.draggable(false);
        // Reset accumulators so the first 2-finger move sets the baseline
        lastDist.current = 0;
      } else {
        // Single-finger touchstart — same as mouse-down, may start a freehand
        handleStageMouseDown(e);
      }
    },
    [stageRef, handleStageMouseDown],
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const touch = e.evt.touches;
      if (touch.length !== 2) return;
      e.evt.preventDefault();

      const p1 = { x: touch[0].clientX, y: touch[0].clientY };
      const p2 = { x: touch[1].clientX, y: touch[1].clientY };
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      if (lastDist.current === 0) {
        lastDist.current = dist;
        lastCenter.current = center;
        return;
      }

      const scale = dist / lastDist.current;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * scale));

      const stage = stageRef.current;
      if (stage) {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const pointTo = {
            x: (center.x - rect.left - stagePos.x) / zoom,
            y: (center.y - rect.top - stagePos.y) / zoom,
          };
          setZoom(newZoom);
          setStagePos({
            x: center.x - rect.left - pointTo.x * newZoom,
            y: center.y - rect.top - pointTo.y * newZoom,
          });
        }
      }

      lastDist.current = dist;
      lastCenter.current = center;
    },
    [zoom, stagePos, stageRef],
  );

  const handleTouchEnd = useCallback(
    (e?: Konva.KonvaEventObject<TouchEvent>) => {
      lastDist.current = 0;
      const stage = stageRef.current;
      // Restore stage drag once we're back to single-touch (or no-touch).
      if (stage && (!e || e.evt.touches.length < 2) && wasDraggablePinch.current) {
        stage.draggable(wasDraggablePinch.current && tool === "select");
        wasDraggablePinch.current = false;
      }
    },
    [stageRef, tool],
  );

  // Grid lines
  const ppm = PIXELS_PER_METRE;
  const gridW = CANVAS_WIDTH_M;
  const gridH = CANVAS_HEIGHT_M;
  const gridLines: React.ReactNode[] = [];
  const hasMap = !!mapData;

  for (let x = 0; x <= gridW; x++) {
    const isMajor = x % 5 === 0;
    gridLines.push(
      <Line
        key={`v${x}`}
        points={[x * ppm, 0, x * ppm, gridH * ppm]}
        stroke={hasMap ? (isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)") : (isMajor ? "#D1D5DB" : "#E5E7EB")}
        strokeWidth={isMajor ? 0.8 : 0.4}
      />,
    );
  }
  for (let y = 0; y <= gridH; y++) {
    const isMajor = y % 5 === 0;
    gridLines.push(
      <Line
        key={`h${y}`}
        points={[0, y * ppm, gridW * ppm, y * ppm]}
        stroke={hasMap ? (isMajor ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)") : (isMajor ? "#D1D5DB" : "#E5E7EB")}
        strokeWidth={isMajor ? 0.8 : 0.4}
      />,
    );
  }

  // Metre labels at 5m intervals along top edge
  for (let x = 0; x <= gridW; x += 5) {
    gridLines.push(
      <KonvaText
        key={`lx-${x}`}
        x={x * ppm - 12}
        y={-18}
        text={`${x}m`}
        fontSize={10}
        fill={hasMap ? "rgba(255,255,255,0.65)" : "#9CA3AF"}
        fontFamily="system-ui, sans-serif"
        width={24}
        align="center"
      />,
    );
    // Small tick mark
    gridLines.push(
      <Line key={`tx-${x}`} points={[x * ppm, -4, x * ppm, 0]} stroke={hasMap ? "rgba(255,255,255,0.5)" : "#D1D5DB"} strokeWidth={0.8} />,
    );
  }
  // Metre labels at 5m intervals along left edge
  for (let y = 0; y <= gridH; y += 5) {
    gridLines.push(
      <KonvaText
        key={`ly-${y}`}
        x={-32}
        y={y * ppm - 5}
        text={`${y}m`}
        fontSize={10}
        fill={hasMap ? "rgba(255,255,255,0.65)" : "#9CA3AF"}
        fontFamily="system-ui, sans-serif"
        width={28}
        align="right"
      />,
    );
    gridLines.push(
      <Line key={`ty-${y}`} points={[-4, y * ppm, 0, y * ppm]} stroke={hasMap ? "rgba(255,255,255,0.5)" : "#D1D5DB"} strokeWidth={0.8} />,
    );
  }

  gridLines.push(
    <KonvaText
      key="scale"
      x={4}
      y={gridH * ppm + 6}
      text="Grid: 1m   |   Bold lines: 5m"
      fontSize={11}
      fill={hasMap ? "rgba(255,255,255,0.7)" : "#9CA3AF"}
      fontFamily="system-ui, sans-serif"
    />,
  );

  // Dynamic scale bar — pick a "nice" metre value for a ~80-120px bar
  const scaleBar = (() => {
    const niceValues = [0.5, 1, 2, 5, 10, 20, 50, 100];
    const targetPx = 100;
    const rawMetres = targetPx / (ppm * zoom);
    let metres = niceValues[0];
    for (const v of niceValues) {
      if (v <= rawMetres * 1.5) metres = v;
    }
    return { metres, widthPx: metres * ppm * zoom };
  })();

  // Live totals chip — surfaces the building count + total footprint
  // m² so the user can see the camp size growing as they drop buildings.
  // Cheap reduce: only the buildings array changes drive recomputation.
  const totals = useMemo(() => {
    let area = 0;
    for (const b of buildings) {
      const t = getBuildingType(b.typeId);
      if (!t) continue;
      area += t.widthM * t.depthM;
    }
    // 1 dp under 100, 0 dp at or above (matches the area-label formatting
    // we already use on closed-polygon labels).
    const formatted = area >= 100 ? `${area.toFixed(0)}` : `${area.toFixed(1)}`;
    return { count: buildings.length, areaM2: formatted };
  }, [buildings]);

  // Zoom controls — anchor zoom on the centre of the visible viewport so
  // whatever the user is looking at stays roughly in the same spot rather
  // than the canvas drifting off-screen. Same maths the wheel-zoom uses,
  // just with the viewport centre instead of the cursor position.
  const zoomAtViewportCenter = useCallback((newZoom: number) => {
    const oldZoom = zoom;
    if (newZoom === oldZoom) return;
    const cx = dims.w / 2;
    const cy = dims.h / 2;
    const pointTo = {
      x: (cx - stagePos.x) / oldZoom,
      y: (cy - stagePos.y) / oldZoom,
    };
    setZoom(newZoom);
    setStagePos({
      x: cx - pointTo.x * newZoom,
      y: cy - pointTo.y * newZoom,
    });
  }, [zoom, dims, stagePos]);

  const zoomIn = () => zoomAtViewportCenter(Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  const zoomOut = () => zoomAtViewportCenter(Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  const zoomReset = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Live totals chip — count + total footprint of placed buildings.
          Only renders when there's at least one building so it doesn't
          chrome up the empty canvas. Sits top-left so it doesn't fight
          with the zoom controls (top-right) or the tap-to-place pill
          (top-centre). */}
      {totals.count > 0 && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur rounded-xl border border-gray-200 shadow-md px-3 py-1.5 pointer-events-none select-none">
          <div className="flex items-baseline gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <rect x="3" y="3" width="7" height="7" rx="0.5" />
              <rect x="14" y="3" width="7" height="7" rx="0.5" />
              <rect x="3" y="14" width="7" height="7" rx="0.5" />
              <rect x="14" y="14" width="7" height="7" rx="0.5" />
            </svg>
            <span className="text-xs font-extrabold text-gray-900 tabular-nums">{totals.count}</span>
            <span className="text-[10px] text-gray-500">{totals.count === 1 ? "building" : "buildings"}</span>
          </div>
          <span className="text-gray-300 text-xs">·</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-extrabold text-gray-900 tabular-nums">{totals.areaM2}</span>
            <span className="text-[10px] text-gray-500">m²</span>
          </div>
        </div>
      )}

      {/* Tap-to-place indicator */}
      {placingTypeId && isMobile && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
          Tap canvas to place · {placingLabel}
        </div>
      )}

      {/* Zoom controls — bigger touch targets on mobile so they're easy to find */}
      <div
        className={`absolute top-3 right-3 z-10 flex items-center bg-white/95 backdrop-blur rounded-xl border border-gray-200 shadow-md ${
          isMobile ? "gap-0.5 px-1 py-1" : "gap-1 px-1 py-1"
        }`}
      >
        <button
          onClick={zoomOut}
          className={`flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors ${
            isMobile ? "w-11 h-11" : "w-8 h-8"
          }`}
          title="Zoom out"
          aria-label="Zoom out"
        >
          <svg width={isMobile ? "20" : "16"} height={isMobile ? "20" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={zoomReset}
          className={`font-bold text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors ${
            isMobile ? "px-2.5 h-11 text-sm min-w-[58px]" : "px-2 h-8 text-xs"
          }`}
          title="Reset zoom to 100%"
          aria-label={`Current zoom ${Math.round(zoom * 100)} percent — tap to reset`}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={zoomIn}
          className={`flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors ${
            isMobile ? "w-11 h-11" : "w-8 h-8"
          }`}
          title="Zoom in"
          aria-label="Zoom in"
        >
          <svg width={isMobile ? "20" : "16"} height={isMobile ? "20" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Prominent + Add Items button — top-left of the canvas. The little
          "+ Add" in the action toolbar above was easy to miss on mobile;
          this floating button is the obvious entry point for new users. */}
      {isMobile && onRequestAdd && !placingTypeId && (
        <button
          onClick={onRequestAdd}
          className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-extrabold shadow-lg shadow-amber-500/30 hover:bg-amber-600 active:scale-95 transition-all"
          aria-label="Add building"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Items
        </button>
      )}

      {/* Mobile hint: pinch-to-zoom — moved to bottom-centre so it doesn't
          clash with the +Add button, and only shown when no shape is in
          flight. Tiny / faded so it doesn't draw the eye. */}
      {isMobile && !placingTypeId && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-md bg-white/60 backdrop-blur text-[9px] font-semibold text-gray-500 pointer-events-none select-none">
          Pinch to zoom
        </div>
      )}

      {/* "+ Add map here" button — appears at the visible viewport centre
          when the user has panned beyond the loaded satellite imagery and
          is looking at whitespace. Tapping fetches a fresh patch of tiles
          centred at that point and composites them onto the existing map.
          Hidden when no map is loaded (use the address search instead),
          when the centre is already over imagery, or while loading. */}
      {mapData && onMapExtend && tool === "select" && !placingTypeId && (() => {
        // Visible viewport centre in canvas-pixel coords.
        const cx = (dims.w / 2 - stagePos.x) / zoom;
        const cy = (dims.h / 2 - stagePos.y) / zoom;
        const eff = mapData.scale * mapScaleMultiplier;
        const imgL = mapData.x;
        const imgT = mapData.y;
        const imgR = imgL + mapData.image.width * eff;
        const imgB = imgT + mapData.image.height * eff;
        const overMap = cx >= imgL && cx <= imgR && cy >= imgT && cy <= imgB;
        if (overMap) return null;
        return (
          <button
            onClick={() => onMapExtend(cx, cy)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-white text-sm font-extrabold shadow-xl ring-2 ring-amber-300 hover:bg-amber-600 active:scale-95 transition-all"
            title="Load satellite tiles for this area"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add map here
          </button>
        );
      })()}

      {/* Scale bar — bottom left */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur rounded-lg border border-gray-200 shadow-sm px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="relative" style={{ width: scaleBar.widthPx }}>
            <div className="h-[2px] bg-gray-800 w-full" />
            <div className="absolute left-0 -top-[4px] w-[1.5px] h-[10px] bg-gray-800" />
            <div className="absolute right-0 -top-[4px] w-[1.5px] h-[10px] bg-gray-800" />
            <div className="absolute left-1/2 -top-[2px] w-[1px] h-[6px] bg-gray-500 -translate-x-1/2" />
          </div>
          <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{scaleBar.metres >= 1 ? `${scaleBar.metres}m` : `${scaleBar.metres * 100}cm`}</span>
        </div>
      </div>

      {/* Map controls + compass — bottom right (desktop overlay) */}
      {hasMap && !isMobile && (
        <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-2">
          <div
            className="w-12 h-12 rounded-full bg-white/95 backdrop-blur border border-gray-200 shadow-sm flex items-center justify-center"
            title={`North: ${mapRotation === 0 ? "up" : `${Math.round(mapRotation)}° rotated`}`}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: `rotate(${-mapRotation}deg)`, transition: "transform 0.2s" }}>
              <polygon points="16,4 20,18 16,15 12,18" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
              <polygon points="16,28 12,18 16,21 20,18" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.5" />
              <text x="16" y="3" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EF4444" style={{ transform: `rotate(${mapRotation}deg)`, transformOrigin: "16px 16px" }}>N</text>
            </svg>
          </div>
          {mapPanelOpen ? (
            <div className="w-[200px]">
              <MapControls
                rotation={mapRotation}
                onRotationChange={(d) => onMapRotation?.(d)}
                locked={mapLocked}
                onLockedChange={(v) => onMapLockedChange?.(v)}
                scaleMultiplier={mapScaleMultiplier}
                onScaleChange={(m) => onMapScaleChange?.(m)}
                moveAsOne={moveSiteAsOne}
                onMoveAsOneChange={(v) => onMoveSiteAsOneChange?.(v)}
                onRecenter={() => onMapRecenter?.()}
                onDone={() => {
                  onMapLockedChange?.(true);
                  setMapPanelOpen(false);
                }}
                compact
              />
            </div>
          ) : (
            // Collapsed: small pill where the panel was. Tapping
            // re-opens the panel for further adjustments.
            <button
              type="button"
              onClick={() => setMapPanelOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/95 backdrop-blur border border-gray-200 shadow-sm text-gray-700 text-[11px] font-bold hover:bg-white transition-colors"
              title="Re-open map controls"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Map locked — Edit
            </button>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px]"
        // Stop the browser from scrolling the page or pinch-zooming the
        // viewport while the user is interacting with the canvas. Konva
        // handles every gesture itself (pan, pinch-zoom, draw, polygon,
        // text-place) and we lose them all if the browser intercepts.
        style={{ touchAction: "none" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Stage
          ref={stageRef}
          width={dims.w}
          height={dims.h}
          scaleX={zoom}
          scaleY={zoom}
          x={stagePos.x}
          y={stagePos.y}
          draggable={tool === "select"}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStagePos({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onWheel={handleWheel}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onDblClick={handleStageDblClick}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
          onTouchStart={handleStageTouchStart}
          onTouchMove={(e) => {
            // Pinch-to-zoom for two-finger touch, single-finger draw
            if (e.evt.touches.length === 2) {
              handleTouchMove(e);
            } else {
              handleStageMouseMove();
            }
          }}
          onTouchEnd={(e) => {
            handleTouchEnd(e);
            handleStageMouseUp();
          }}
          style={{ cursor: tool === "freehand" || tool === "line" || tool === "dimension" || tool === "polygon" || tool.startsWith("shape-") ? "crosshair" : tool === "text" ? "text" : "default" }}
        >
          {/* Map background layer */}
          {mapData && (() => {
            const effectiveScale = mapData.scale * mapScaleMultiplier;
            const imgW = mapData.image.width * effectiveScale;
            const imgH = mapData.image.height * effectiveScale;
            const cx = mapData.x + imgW / 2;
            const cy = mapData.y + imgH / 2;
            // For the rotation handle: position above the (rotated) map's
            // top-centre so it always sits above the visible image.
            const rad = (mapRotation * Math.PI) / 180;
            const handleOffset = imgH / 2 + 30; // 30px above the map's top edge
            const handleX = cx + Math.sin(rad) * handleOffset;
            const handleY = cy - Math.cos(rad) * handleOffset;
            // The map image covers most of the canvas — if it stays
            // interactive while the user is trying to place a building or
            // draw a line, every tap hits the map first and silently does
            // nothing. Disable hit-testing on the map whenever the user
            // has a placement queued OR has a drawing/text tool active so
            // touches fall through to the stage and the placement / draw
            // handlers fire normally.
            const mapInteractive = !placingTypeId && tool === "select";
            return (
              <Layer>
                <KonvaImage
                  image={mapData.image}
                  x={cx}
                  y={cy}
                  offsetX={mapData.image.width / 2}
                  offsetY={mapData.image.height / 2}
                  scaleX={effectiveScale}
                  scaleY={effectiveScale}
                  rotation={mapRotation}
                  opacity={mapOpacity}
                  listening={mapInteractive}
                  draggable={mapInteractive && !mapLocked}
                  onDragEnd={(e) => {
                    const newX = e.target.x() - imgW / 2;
                    const newY = e.target.y() - imgH / 2;
                    if (moveSiteAsOne && onMapDragShift) {
                      const dxPx = newX - mapData.x;
                      const dyPx = newY - mapData.y;
                      onMapDragShift(dxPx / PIXELS_PER_METRE, dyPx / PIXELS_PER_METRE);
                    }
                    onMapMove?.(newX, newY);
                  }}
                />

                {/* Rotation handle — only when map isn't locked AND the
                    user isn't trying to place / draw something. Otherwise
                    a stray tap on the handle hijacks the placement
                    gesture. */}
                {!mapLocked && onMapRotation && mapInteractive && (
                  <>
                    {/* Connector line from map centre to handle */}
                    <Line
                      points={[cx, cy, handleX, handleY]}
                      stroke="rgba(245, 158, 11, 0.45)"
                      strokeWidth={1.2}
                      dash={[4, 3]}
                      listening={false}
                    />
                    <Circle
                      x={handleX}
                      y={handleY}
                      radius={9}
                      fill="#FCD34D"
                      stroke="#B45309"
                      strokeWidth={2}
                      shadowColor="black"
                      shadowBlur={4}
                      shadowOpacity={0.25}
                      draggable
                      onDragMove={(e) => {
                        const hx = e.target.x();
                        const hy = e.target.y();
                        // Compute angle from map centre to handle position.
                        // Atan2 returns radians from positive X axis; we want
                        // 0° pointing up so adjust accordingly.
                        const angle = Math.atan2(hx - cx, -(hy - cy)) * (180 / Math.PI);
                        onMapRotation(angle);
                      }}
                      onDragEnd={(e) => {
                        // Snap only to cardinal directions (0, ±90, ±180)
                        // and only inside a tight 2° window — gives the
                        // user true 1° precision. The earlier 15° snap
                        // made it impossible to land on e.g. 11°.
                        const hx = e.target.x();
                        const hy = e.target.y();
                        const raw = Math.atan2(hx - cx, -(hy - cy)) * (180 / Math.PI);
                        let stepped = raw;
                        for (const target of [-180, -90, 0, 90, 180]) {
                          if (Math.abs(raw - target) <= 2) {
                            stepped = target;
                            break;
                          }
                        }
                        onMapRotation(stepped);
                      }}
                      onMouseEnter={(e) => {
                        const c = e.target.getStage()?.container();
                        if (c) c.style.cursor = "grab";
                      }}
                      onMouseLeave={(e) => {
                        const c = e.target.getStage()?.container();
                        if (c) c.style.cursor = "default";
                      }}
                    />
                    {/* Tiny rotation icon inside the handle */}
                    <KonvaText
                      x={handleX - 6}
                      y={handleY - 6}
                      width={12}
                      height={12}
                      text="↻"
                      fontSize={11}
                      fontStyle="bold"
                      fill="#7C2D12"
                      align="center"
                      listening={false}
                    />
                  </>
                )}
              </Layer>
            );
          })()}

          {/* Grid layer */}
          <Layer listening={false}>{gridLines}</Layer>

          {/* Building drop shadows — drawn under the buildings so they read clearly */}
          {sunDirection !== null && sunDirection !== undefined && buildings.length > 0 && (() => {
            const rad = (sunDirection * Math.PI) / 180;
            // Shadow falls opposite the sun direction
            const shadowDx = -Math.sin(rad);
            const shadowDy = Math.cos(rad);
            const shadowOffsetPx = 0.9 * ppm; // ~0.9m offset
            return (
              <Layer listening={false}>
                {buildings.map((b) => {
                  const type = getBuildingType(b.typeId);
                  if (!type || type.category === "utilities") return null;
                  const w = type.widthM * ppm;
                  const h = type.depthM * ppm;
                  return (
                    <Rect
                      key={`shadow-${b.instanceId}`}
                      x={b.x * ppm + w / 2 + shadowDx * shadowOffsetPx}
                      y={b.y * ppm + h / 2 + shadowDy * shadowOffsetPx}
                      offsetX={w / 2}
                      offsetY={h / 2}
                      width={w}
                      height={h}
                      rotation={b.rotation}
                      fill="rgba(0, 0, 0, 0.45)"
                      cornerRadius={3}
                      shadowColor="black"
                      shadowBlur={10}
                      shadowOpacity={0.5}
                    />
                  );
                })}
              </Layer>
            );
          })()}

          {/* Closed-polygon visual underlay — areas / m² boundaries /
              filled shapes sit BENEATH the buildings layer so a
              building dropped inside the boundary isn't obscured by
              the translucent fill.
              The polygon's CLICK target also lives here (not in the
              FG drawings layer) so Konva's top-down hit detection
              naturally lets the buildings layer win wherever the two
              overlap. Result: tap inside-the-polygon-but-on-a-
              building → building selects; tap inside-the-polygon-
              over-empty-space → polygon selects.
              Selection halo, vertex handles, length / area labels
              still render in the FG drawings layer above buildings,
              so they remain visible + tappable. */}
          {drawings.some((d) => d.closed) && (
            <Layer>
              {drawings.filter((d) => d.closed).map((d) => {
                const op = d.opacity ?? 1;
                const fillRGBA = hexToRGBA(d.color, op * 0.32);
                const dashArr = d.dashed ? [d.thickness * 3, d.thickness * 2] : undefined;
                const selectThis = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
                  e.cancelBubble = true;
                  setSelectedDrawingId(d.id);
                  setSelectedTextId(null);
                  if (tool !== "select") onToolChange?.("select");
                };
                return (
                  <Group key={`bg-${d.id}`}>
                    {/* Black halo behind the colour — keeps the boundary
                        legible on bright satellite imagery. */}
                    <Line
                      points={d.points}
                      stroke="rgba(0,0,0,0.8)"
                      strokeWidth={d.thickness + 2}
                      dash={dashArr}
                      closed
                      lineCap="round"
                      lineJoin="round"
                      opacity={op}
                      listening={false}
                    />
                    <Line
                      points={d.points}
                      stroke={d.color}
                      strokeWidth={d.thickness}
                      dash={dashArr}
                      closed
                      fill={fillRGBA}
                      lineCap="round"
                      lineJoin="round"
                      opacity={op}
                      hitStrokeWidth={Math.max(d.thickness + 12, 16)}
                      onMouseEnter={(e) => {
                        const c = e.target.getStage()?.container();
                        if (c) c.style.cursor = "pointer";
                      }}
                      onMouseLeave={(e) => {
                        const c = e.target.getStage()?.container();
                        if (c) c.style.cursor = "default";
                      }}
                      onClick={selectThis}
                      onTap={selectThis}
                    />
                  </Group>
                );
              })}
            </Layer>
          )}

          {/* Buildings layer */}
          <Layer>
            {buildings.map((b) => {
              const type = getBuildingType(b.typeId);
              if (!type) return null;
              return (
                <BuildingShape
                  key={b.instanceId}
                  building={b}
                  type={type}
                  isSelected={b.instanceId === selectedId}
                  isAttached={!!b.parentId}
                  onSelect={() => onSelect(b.instanceId)}
                  onDragStart={() => setTrashHover(false)}
                  onDragMove={(p) => setTrashHover(isOverTrash(p))}
                  onDragEnd={(x, y, drop) => {
                    if (isOverTrash(drop) && onRemoveBuilding) {
                      onRemoveBuilding(b.instanceId);
                    } else {
                      onMove(b.instanceId, x, y);
                    }
                    setTrashHover(false);
                  }}
                  onDblClick={() => onLabelEdit?.(b.instanceId)}
                />
              );
            })}
          </Layer>

          {/* Drawings layer — freehand strokes and closed polygons.
              Listens for clicks so users can select an existing drawing.
              When a closed polygon is selected, vertex handles are rendered
              so the user can drag points to reshape the area. */}
          {(drawings.length > 0 || activeStroke || activePolygon) && (
            <Layer>
              {drawings.map((d) => {
                const op = d.opacity ?? 1;
                const isSelected = selectedDrawingId === d.id;
                // Geometry
                const lengthPx = computePathLength(d.points, d.closed);
                const lengthM = lengthPx / PIXELS_PER_METRE;
                const areaPxSq = d.closed ? Math.abs(computePolygonArea(d.points)) : 0;
                const areaMSq = areaPxSq / (PIXELS_PER_METRE * PIXELS_PER_METRE);
                const centroid = d.closed ? computeCentroid(d.points) : null;
                // Label position for open paths: midpoint of last segment
                const labelPos = !d.closed ? computeMidpoint(d.points) : null;
                // Dimension lines get the label offset perpendicular to
                // the line so it reads as a measurement annotation rather
                // than text-on-top-of-the-line. dimensionFlip moves it to
                // the other side. Falls back to mid-line for non-dim.
                const dimLabelPos = (() => {
                  if (!d.dimension || d.points.length !== 4) return null;
                  const [x1, y1, x2, y2] = d.points;
                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const len = Math.hypot(dx, dy);
                  if (len === 0) return null;
                  const mx = (x1 + x2) / 2;
                  const my = (y1 + y2) / 2;
                  // Perpendicular unit vector (rotate 90°); flip via sign.
                  const px = -dy / len;
                  const py = dx / len;
                  const sign = d.dimensionFlip ? -1 : 1;
                  const offset = 22 / zoom; // pixel offset, scale-independent
                  return { x: mx + px * offset * sign, y: my + py * offset * sign };
                })();
                // (Closed-polygon fill colour is computed inline in the
                // underlay layer above buildings — not needed here.)
                // Tap/click → select this drawing. If the user is in a
                // drawing tool we flip them to select mode so the edit
                // panel shows up and they can drag the vertex / change
                // colour without first hitting "Done".
                const selectThis = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
                  e.cancelBubble = true;
                  setSelectedDrawingId(d.id);
                  setSelectedTextId(null);
                  if (tool !== "select") onToolChange?.("select");
                };
                return (
                  <Group key={d.id}>
                    {/* Open drawings (lines / dimensions / freehand) get a
                        black halo behind the colour for satellite legibility.
                        Closed polygons render their visible halo + colour in
                        the underlay layer above buildings — here we only
                        keep an invisible hit target so taps still select the
                        polygon. */}
                    {!d.closed && (
                      <Line
                        points={d.points}
                        stroke="rgba(0,0,0,0.8)"
                        strokeWidth={d.thickness + 2}
                        dash={(d.dashed || d.dimension)
                          ? [d.thickness * 3, d.thickness * 2]
                          : undefined}
                        closed={false}
                        lineCap="round"
                        lineJoin="round"
                        opacity={op}
                        listening={false}
                      />
                    )}
                    {d.dimension ? (
                      // Dimension line: dashed Arrow with arrowheads on
                      // both ends. Konva.Arrow extends Line so we can
                      // reuse all the same hit / click handlers.
                      <Arrow
                        points={d.points}
                        stroke={d.color}
                        strokeWidth={d.thickness}
                        dash={[d.thickness * 3, d.thickness * 2]}
                        fill={d.color}
                        pointerAtBeginning
                        pointerAtEnding
                        pointerLength={Math.max(d.thickness * 3, 11)}
                        pointerWidth={Math.max(d.thickness * 2.5, 9)}
                        lineCap="round"
                        lineJoin="round"
                        opacity={op}
                        hitStrokeWidth={Math.max(d.thickness + 12, 16)}
                        onMouseEnter={(e) => {
                          const c = e.target.getStage()?.container();
                          if (c) c.style.cursor = "pointer";
                        }}
                        onMouseLeave={(e) => {
                          const c = e.target.getStage()?.container();
                          if (c) c.style.cursor = "default";
                        }}
                        onClick={selectThis}
                        onTap={selectThis}
                      />
                    ) : !d.closed ? (
                      // Open lines / freehand strokes — full visual + hit
                      // target lives in this layer (above buildings).
                      <Line
                        points={d.points}
                        stroke={d.color}
                        strokeWidth={d.thickness}
                        dash={d.dashed ? [d.thickness * 3, d.thickness * 2] : undefined}
                        closed={false}
                        lineCap="round"
                        lineJoin="round"
                        opacity={op}
                        hitStrokeWidth={Math.max(d.thickness + 12, 16)}
                        onMouseEnter={(e) => {
                          const c = e.target.getStage()?.container();
                          if (c) c.style.cursor = "pointer";
                        }}
                        onMouseLeave={(e) => {
                          const c = e.target.getStage()?.container();
                          if (c) c.style.cursor = "default";
                        }}
                        onClick={selectThis}
                        onTap={selectThis}
                      />
                    ) : null /* closed polygons are rendered + click-handled in the underlay layer above buildings */}

                    {/* Selection halo — re-stroke at lower opacity */}
                    {isSelected && (
                      <Line
                        points={d.points}
                        stroke="#2563EB"
                        strokeWidth={Math.max(d.thickness + 6, 8)}
                        closed={d.closed}
                        opacity={0.28}
                        lineCap="round"
                        lineJoin="round"
                        listening={false}
                      />
                    )}

                    {/* Length label — at midpoint for open strokes (>= 0.5m).
                        For a dimension drawing, the label sits perpendicular
                        to the line (one side, flippable via the edit panel)
                        so it reads as a measurement annotation rather than
                        sitting on top of the line. */}
                    {!d.closed && (dimLabelPos || labelPos) && lengthM >= 0.5 && (() => {
                      const pos = dimLabelPos ?? labelPos!;
                      // Dimension labels are bold and slightly bigger; centred
                      // on the offset point. Regular line labels stay where
                      // they always were.
                      const isDim = !!dimLabelPos;
                      const fontSize = isDim ? 13 : 12;
                      const text = `${lengthM.toFixed(2)} m`;
                      const textW = isDim ? 78 : 56;
                      const pillW = isDim ? 82 : 60;
                      const pillH = isDim ? 20 : 18;
                      const dy = isDim ? -pillH / 2 : -22 / zoom;
                      return (
                        <>
                          <Rect
                            x={pos.x - pillW / 2}
                            y={pos.y + dy}
                            width={pillW}
                            height={pillH}
                            fill="rgba(255,255,255,0.94)"
                            stroke={d.color}
                            strokeWidth={isDim ? 1.5 : 1}
                            cornerRadius={4}
                            listening={false}
                          />
                          <KonvaText
                            x={pos.x - textW / 2}
                            y={pos.y + dy + (pillH - fontSize) / 2}
                            width={textW}
                            align="center"
                            text={text}
                            fontSize={fontSize}
                            fontStyle="bold"
                            fontFamily="system-ui, sans-serif"
                            fill={d.color}
                            listening={false}
                          />
                        </>
                      );
                    })()}

                    {/* Area + perimeter label inside closed polygons */}
                    {d.closed && centroid && (
                      <>
                        <Rect
                          x={centroid.x - 52}
                          y={centroid.y - 18}
                          width={104}
                          height={36}
                          fill="rgba(255,255,255,0.92)"
                          stroke={d.color}
                          strokeWidth={1}
                          cornerRadius={4}
                          listening={false}
                        />
                        <KonvaText
                          x={centroid.x - 50}
                          y={centroid.y - 16}
                          width={100}
                          align="center"
                          text={`${formatArea(areaMSq)}\n${lengthM.toFixed(1)} m perim.`}
                          fontSize={12}
                          fontStyle="bold"
                          fontFamily="system-ui, sans-serif"
                          fill={d.color}
                          listening={false}
                        />
                      </>
                    )}

                    {/* Vertex handles — closed polygons (any vertex count)
                        AND straight lines (open + exactly 2 vertices). Skip
                        freehand strokes since their points are too dense to
                        edit individually. */}
                    {isSelected && onUpdateDrawing &&
                      (d.closed || d.points.length === 4) &&
                      Array.from({ length: d.points.length / 2 }).map((_, i) => (
                        <Circle
                          key={`vh-${i}`}
                          x={d.points[i * 2]}
                          y={d.points[i * 2 + 1]}
                          radius={6 / zoom}
                          fill="#FFFFFF"
                          stroke="#2563EB"
                          strokeWidth={2 / zoom}
                          shadowColor="black"
                          shadowBlur={3 / zoom}
                          shadowOpacity={0.25}
                          draggable
                          onMouseEnter={(e) => {
                            const c = e.target.getStage()?.container();
                            if (c) c.style.cursor = "grab";
                          }}
                          onMouseLeave={(e) => {
                            const c = e.target.getStage()?.container();
                            if (c) c.style.cursor = "default";
                          }}
                          onDragMove={(e) => {
                            const newPts = d.points.slice();
                            newPts[i * 2] = e.target.x();
                            newPts[i * 2 + 1] = e.target.y();
                            onUpdateDrawing(d.id, { points: newPts });
                          }}
                        />
                      ))}
                  </Group>
                );
              })}

              {/* In-progress freehand stroke or line preview. For the
                  line tool we also drop a white anchor circle on the
                  start point (matches the polygon UX) so the user can
                  see exactly where the line is anchored before they
                  tap to commit the second endpoint. */}
              {activeStroke && drawStyle && (
                <Group listening={false}>
                  <Line
                    points={activeStroke}
                    stroke={drawStyle.color}
                    strokeWidth={drawStyle.thickness}
                    dash={drawStyle.dashed ? [drawStyle.thickness * 3, drawStyle.thickness * 2] : undefined}
                    lineCap="round"
                    lineJoin="round"
                    opacity={drawStyle.opacity}
                  />
                  {(tool === "line" || tool === "dimension") && activeStroke.length === 4 && (
                    <>
                      {/* Anchored start point — same UX as polygon's
                          first vertex so the user sees their tap landed. */}
                      <Circle
                        x={activeStroke[0]}
                        y={activeStroke[1]}
                        radius={6 / zoom}
                        fill="#fff"
                        stroke={drawStyle.color}
                        strokeWidth={2 / zoom}
                      />
                      {/* Live cursor / second-tap target — only show if
                          the user has moved away from the anchor */}
                      {(activeStroke[2] !== activeStroke[0] || activeStroke[3] !== activeStroke[1]) && (
                        <Circle
                          x={activeStroke[2]}
                          y={activeStroke[3]}
                          radius={4 / zoom}
                          fill={drawStyle.color}
                          stroke="#fff"
                          strokeWidth={1.5 / zoom}
                        />
                      )}
                    </>
                  )}
                </Group>
              )}

              {/* In-progress polygon outline */}
              {activePolygon && drawStyle && (
                <Group listening={false}>
                  <Line
                    points={activePolygon}
                    stroke={drawStyle.color}
                    strokeWidth={drawStyle.thickness}
                    dash={drawStyle.dashed ? [drawStyle.thickness * 3, drawStyle.thickness * 2] : undefined}
                    lineCap="round"
                    lineJoin="round"
                    opacity={drawStyle.opacity}
                  />
                  {Array.from({ length: activePolygon.length / 2 }).map((_, i) => (
                    <Circle
                      key={`pv-${i}`}
                      x={activePolygon[i * 2]}
                      y={activePolygon[i * 2 + 1]}
                      radius={i === 0 ? 5 / zoom : 3 / zoom}
                      fill={i === 0 ? "#fff" : drawStyle.color}
                      stroke={drawStyle.color}
                      strokeWidth={1.5 / zoom}
                    />
                  ))}
                </Group>
              )}
            </Layer>
          )}

          {/* Text annotations layer — draggable styled text */}
          {texts.length > 0 && (
            <Layer>
              {texts.map((t) => {
                const isSel = selectedTextId === t.id;
                const op = t.opacity ?? 1;
                // Approx pill size — covers the rendered text plus padding
                const pillW = Math.max(60, t.text.length * t.fontSize * 0.6) + 12;
                const pillH = t.fontSize * 1.35 + 8;
                const selectThis = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
                  e.cancelBubble = true;
                  setSelectedTextId(t.id);
                  setSelectedDrawingId(null);
                  if (tool !== "select") onToolChange?.("select");
                };
                return (
                  <Group
                    key={t.id}
                    x={t.x}
                    y={t.y}
                    opacity={op}
                    draggable
                    onDragStart={() => setTrashHover(false)}
                    onDragMove={(e) => {
                      const stage = e.target.getStage();
                      const ptr = stage?.getPointerPosition();
                      const cRect = stage?.container().getBoundingClientRect();
                      if (ptr && cRect) {
                        setTrashHover(isOverTrash({ x: cRect.left + ptr.x, y: cRect.top + ptr.y }));
                      }
                    }}
                    onDragEnd={(e) => {
                      const stage = e.target.getStage();
                      const ptr = stage?.getPointerPosition();
                      const cRect = stage?.container().getBoundingClientRect();
                      const drop = ptr && cRect ? { x: cRect.left + ptr.x, y: cRect.top + ptr.y } : null;
                      if (isOverTrash(drop) && onRemoveText) {
                        onRemoveText(t.id);
                        setSelectedTextId(null);
                      } else {
                        onMoveText?.(t.id, e.target.x(), e.target.y());
                      }
                      setTrashHover(false);
                    }}
                    onClick={selectThis}
                    onTap={selectThis}
                    onDblClick={(e) => {
                      e.cancelBubble = true;
                      const next = window.prompt("Edit text", t.text);
                      if (next !== null && next.trim()) {
                        onUpdateText?.(t.id, { text: next.trim() });
                      }
                    }}
                    onDblTap={(e) => {
                      e.cancelBubble = true;
                      const next = window.prompt("Edit text", t.text);
                      if (next !== null && next.trim()) {
                        onUpdateText?.(t.id, { text: next.trim() });
                      }
                    }}
                  >
                    {/* White backing pill — guarantees the text reads on any
                        background (satellite, grass, dark surfaces). */}
                    <Rect
                      x={-6}
                      y={-4}
                      width={pillW}
                      height={pillH}
                      fill="rgba(255,255,255,0.92)"
                      stroke={t.color}
                      strokeWidth={1}
                      cornerRadius={4}
                      listening={false}
                    />
                    {isSel && (
                      <Rect
                        x={-9}
                        y={-7}
                        width={pillW + 6}
                        height={pillH + 6}
                        fill="transparent"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dash={[6, 4]}
                        cornerRadius={5}
                        listening={false}
                      />
                    )}
                    <KonvaText
                      text={t.text}
                      fontSize={t.fontSize}
                      fontStyle="bold"
                      fontFamily="system-ui, sans-serif"
                      fill={t.color}
                    />
                  </Group>
                );
              })}
            </Layer>
          )}

          {/* Sun direction overlay */}
          {sunDirection !== null && sunDirection !== undefined && (() => {
            const canvasW = CANVAS_WIDTH_M * ppm;
            const canvasH = CANVAS_HEIGHT_M * ppm;

            // Centre the sun on the user's work (bbox of placed buildings) so it
            // stays meaningful when their cluster isn't at the canvas centre.
            // Falls back to the canvas centre when nothing is placed.
            const bbox = computeBuildingsBoundsPx(buildings);
            const cx = bbox ? (bbox.minX + bbox.maxX) / 2 : canvasW / 2;
            const cy = bbox ? (bbox.minY + bbox.maxY) / 2 : canvasH / 2;
            const halfDiag = bbox
              ? Math.sqrt(
                  (bbox.maxX - bbox.minX) ** 2 + (bbox.maxY - bbox.minY) ** 2,
                ) / 2
              : 0;
            // Place the sun just outside the work area, with sensible min/max.
            const radius = bbox
              ? Math.min(Math.max(halfDiag + 1.5 * ppm, 4 * ppm), Math.min(canvasW, canvasH) * 0.45)
              : Math.min(canvasW, canvasH) * 0.45;

            const rad = (sunDirection * Math.PI) / 180;
            const sunX = cx + Math.sin(rad) * radius;
            const sunY = cy - Math.cos(rad) * radius;
            const lineLen = Math.max(canvasW, canvasH) * 1.5;
            const perpRad = rad + Math.PI / 2;
            const perpDx = Math.cos(perpRad);
            const perpDy = Math.sin(perpRad);
            const shadowDx = Math.sin(rad);
            const shadowDy = -Math.cos(rad);

            const shadowLines: React.ReactNode[] = [];
            // Bolder dashed sun rays, opacity fades toward the edges
            for (let i = -12; i <= 12; i++) {
              const offsetDist = i * 30;
              const baseCx = cx + perpDx * offsetDist;
              const baseCy = cy + perpDy * offsetDist;
              const opacity = 0.55 - Math.abs(i) * 0.03;
              shadowLines.push(
                <Line
                  key={`sunray-${i}`}
                  points={[
                    baseCx - shadowDx * lineLen / 2,
                    baseCy - shadowDy * lineLen / 2,
                    baseCx + shadowDx * lineLen / 2,
                    baseCy + shadowDy * lineLen / 2,
                  ]}
                  stroke={`rgba(245, 158, 11, ${Math.max(0.08, opacity)})`}
                  strokeWidth={i === 0 ? 4 : 3}
                  dash={[16, 10]}
                />,
              );
            }

            // Sun rays
            const rayLines: React.ReactNode[] = [];
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * Math.PI * 2;
              rayLines.push(
                <Line
                  key={`ray-${i}`}
                  points={[
                    sunX + Math.cos(angle) * 22,
                    sunY + Math.sin(angle) * 22,
                    sunX + Math.cos(angle) * 34,
                    sunY + Math.sin(angle) * 34,
                  ]}
                  stroke="#F59E0B"
                  strokeWidth={3}
                  lineCap="round"
                />,
              );
            }

            // Shadow band — clearly visible dark slab on the shadow side
            const bandStart = 0;
            const bandEnd = 240;
            const shadowBand = [
              cx + perpDx * bandStart - shadowDx * lineLen / 2,
              cy + perpDy * bandStart - shadowDy * lineLen / 2,
              cx + perpDx * bandStart + shadowDx * lineLen / 2,
              cy + perpDy * bandStart + shadowDy * lineLen / 2,
              cx + perpDx * bandEnd + shadowDx * lineLen / 2,
              cy + perpDy * bandEnd + shadowDy * lineLen / 2,
              cx + perpDx * bandEnd - shadowDx * lineLen / 2,
              cy + perpDy * bandEnd - shadowDy * lineLen / 2,
            ];

            return (
              <Layer listening={false}>
                {/* Shadow band on the side away from the sun */}
                <Line
                  points={shadowBand}
                  fill="rgba(0, 0, 0, 0.18)"
                  closed
                />
                {shadowLines}
                {/* Sun glow */}
                <Circle x={sunX} y={sunY} radius={28} fill="rgba(251, 191, 36, 0.28)" />
                <Circle
                  x={sunX}
                  y={sunY}
                  radius={20}
                  fill="#FCD34D"
                  stroke="#B45309"
                  strokeWidth={3}
                  shadowColor="black"
                  shadowBlur={6}
                  shadowOpacity={0.35}
                />
                {rayLines}
                {/* Direction arrow */}
                <Arrow
                  points={[
                    sunX + shadowDx * 44,
                    sunY + shadowDy * 44,
                    sunX + shadowDx * 100,
                    sunY + shadowDy * 100,
                  ]}
                  fill="#B45309"
                  stroke="#B45309"
                  strokeWidth={4}
                  pointerLength={12}
                  pointerWidth={10}
                />
                <KonvaText
                  x={sunX - 25}
                  y={sunY - 44}
                  text="☀ Sun"
                  fontSize={14}
                  fontStyle="bold"
                  fill="#92400E"
                  width={50}
                  align="center"
                />
              </Layer>
            );
          })()}
        </Stage>

        {/* Inline text input overlay (HTML) — appears when user clicks on
            stage in text mode.
            Desktop: positioned at the click point, in place.
            Mobile : pinned to the top of the visual viewport (above the
                     iOS keyboard) so iOS Safari doesn't yank the whole
                     page upwards to bring the input into view. The text
                     still drops at the user's tap point on the canvas
                     when they hit Enter — only the input UI moves. */}
        {textInput && textStyle && !isMobile && (
          <div
            className="absolute z-30"
            style={{
              left: textInput.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0),
              top: textInput.clientY - (containerRef.current?.getBoundingClientRect().top ?? 0),
            }}
          >
            <input
              ref={textInputRef}
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitTextInput();
                if (e.key === "Escape") {
                  setTextInput(null);
                  setTextInputValue("");
                }
              }}
              onBlur={commitTextInput}
              placeholder="Type text…"
              className="px-2 py-1 rounded border-2 border-amber-400 bg-white shadow-lg focus:outline-none"
              style={{
                fontSize: textStyle.fontSize,
                color: textStyle.color,
                fontWeight: 700,
                minWidth: 120,
              }}
            />
          </div>
        )}
        {textInput && textStyle && isMobile && (
          <div
            className="fixed left-3 right-3 z-50"
            // Centred vertically — sits just above where iOS slides the
            // keyboard up from. The body is locked so the page can't drift
            // while the input is open.
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <div className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl ring-1 ring-white/10 px-2 py-2">
              <input
                ref={textInputRef}
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTextInput();
                  }
                  if (e.key === "Escape") {
                    setTextInput(null);
                    setTextInputValue("");
                  }
                }}
                // enterKeyHint makes iOS / Android render the keyboard's
                // return key as an obvious tickable "Done" — tapping it
                // fires the Enter handler above and commits the text.
                enterKeyHint="done"
                placeholder="Type text — drops at your tap point"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                style={{ fontSize: 16 /* keep ≥16 so iOS doesn't auto-zoom */, fontWeight: 700 }}
              />
              <button
                type="button"
                onClick={commitTextInput}
                className="flex-shrink-0 px-3 py-2 rounded-lg bg-amber-500 text-gray-900 text-sm font-bold hover:bg-amber-400"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setTextInput(null);
                  setTextInputValue("");
                }}
                className="flex-shrink-0 w-9 h-9 rounded-lg text-white/70 hover:bg-white/10"
                aria-label="Cancel"
                title="Cancel"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ─── Mobile floating selection bar ───────────────────────
            Shows when something is selected on a small screen. Tap the
            trash to delete; or drag the building / text into the trash
            chip. The bar is also where you tweak opacity & colour for
            drawings / text — keeps the main toolbar compact. */}
        {isMobile && selectedId && (() => {
          const b = buildings.find((bb) => bb.instanceId === selectedId);
          if (!b) return null;
          return (
            <MobileSelectionBar
              ref={trashRef}
              kind="building"
              hovered={trashHover}
              onRotate={onRotateBuilding ? () => onRotateBuilding(selectedId) : undefined}
              onRename={onLabelEdit ? () => onLabelEdit(selectedId) : undefined}
              onDelete={() => {
                onRemoveBuilding?.(selectedId);
                onSelect(null);
              }}
              onDone={() => onSelect(null)}
            />
          );
        })()}
        {isMobile && selectedDrawingId && (() => {
          const d = drawings.find((dd) => dd.id === selectedDrawingId);
          if (!d) return null;
          // Scale the drawing's vertices around its centroid by `factor`.
          // Used by the +/- buttons in the selection bar — gives the
          // user a quick "make this 10% bigger / smaller" without having
          // to drag every vertex by hand.
          const handleResize = (factor: number) => {
            if (!onUpdateDrawing) return;
            const n = d.points.length / 2;
            if (n === 0) return;
            let cx = 0, cy = 0;
            for (let i = 0; i < n; i++) {
              cx += d.points[i * 2];
              cy += d.points[i * 2 + 1];
            }
            cx /= n;
            cy /= n;
            const next = d.points.slice();
            for (let i = 0; i < n; i++) {
              next[i * 2]     = cx + (d.points[i * 2]     - cx) * factor;
              next[i * 2 + 1] = cy + (d.points[i * 2 + 1] - cy) * factor;
            }
            onUpdateDrawing(d.id, { points: next });
          };
          return (
            <MobileSelectionBar
              ref={trashRef}
              kind="drawing"
              hovered={trashHover}
              opacity={d.opacity ?? 1}
              onOpacityChange={(v) => onUpdateDrawing?.(d.id, { opacity: v })}
              color={d.color}
              onColorChange={(c) => onUpdateDrawing?.(d.id, { color: c })}
              onResize={handleResize}
              isDimension={!!d.dimension}
              onFlipSide={d.dimension ? () => onUpdateDrawing?.(d.id, { dimensionFlip: !d.dimensionFlip }) : undefined}
              onDelete={() => {
                onRemoveDrawing?.(d.id);
                setSelectedDrawingId(null);
              }}
              onDone={() => setSelectedDrawingId(null)}
            />
          );
        })()}
        {isMobile && selectedTextId && (() => {
          const t = texts.find((tt) => tt.id === selectedTextId);
          if (!t) return null;
          return (
            <MobileSelectionBar
              ref={trashRef}
              kind="text"
              hovered={trashHover}
              opacity={t.opacity ?? 1}
              onOpacityChange={(v) => onUpdateText?.(t.id, { opacity: v })}
              color={t.color}
              onColorChange={(c) => onUpdateText?.(t.id, { color: c })}
              onRename={() => {
                const next = window.prompt("Edit text", t.text);
                if (next !== null && next.trim()) {
                  onUpdateText?.(t.id, { text: next.trim() });
                }
              }}
              onDelete={() => {
                onRemoveText?.(t.id);
                setSelectedTextId(null);
              }}
              onDone={() => setSelectedTextId(null)}
            />
          );
        })()}
      </div>
    </div>
  );
}
