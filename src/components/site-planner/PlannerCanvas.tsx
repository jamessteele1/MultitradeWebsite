"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Line, Text as KonvaText, Image as KonvaImage, Circle, Arrow, Group } from "react-konva";
import BuildingShape from "./BuildingShape";
import { getBuildingType } from "@/lib/site-planner/buildings";
import {
  PIXELS_PER_METRE,
  CANVAS_WIDTH_M,
  CANVAS_HEIGHT_M,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from "@/lib/site-planner/constants";
import type { PlacedBuilding } from "@/lib/site-planner/usePlannerState";
import type Konva from "konva";

export type MapData = {
  image: HTMLImageElement;
  scale: number; // canvas pixels per map pixel
  x: number; // position in canvas pixels
  y: number;
};

type Props = {
  buildings: PlacedBuilding[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onAdd: (typeId: string, x: number, y: number, label: string) => void;
  onAddCustom?: (widthM: number, depthM: number, x: number, y: number, label: string) => void;
  stageRef: React.RefObject<Konva.Stage>;
  mapData?: MapData | null;
  mapOpacity?: number;
  mapRotation?: number;
  onMapMove?: (x: number, y: number) => void;
  onMapRotation?: (degrees: number) => void;
  sunDirection?: number | null;
  annotations?: { id: string; x: number; y: number; text: string }[];
  onAnnotationMove?: (id: string, x: number, y: number) => void;
  /** Mobile: building type ID queued for tap-to-place */
  placingTypeId?: string | null;
  placingLabel?: string;
  onPlaced?: () => void;
  isMobile?: boolean;
};

export default function PlannerCanvas({
  buildings,
  selectedId,
  onSelect,
  onMove,
  onAdd,
  onAddCustom,
  stageRef,
  mapData,
  mapOpacity = 0.7,
  mapRotation = 0,
  onMapMove,
  onMapRotation,
  sunDirection,
  annotations = [],
  onAnnotationMove,
  placingTypeId,
  placingLabel,
  onPlaced,
  isMobile,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [initialFit, setInitialFit] = useState(false);

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
        setZoom(Math.min(1, fitZoom));
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
      if (!typeId) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - stagePos.x) / zoom / PIXELS_PER_METRE;
      const y = (e.clientY - rect.top - stagePos.y) / zoom / PIXELS_PER_METRE;

      if (customWidth && customDepth && onAddCustom) {
        const w = parseFloat(customWidth);
        const d = parseFloat(customDepth);
        onAddCustom(w, d, x - w / 2, y - d / 2, label || `${w}×${d}m`);
      } else {
        const type = getBuildingType(typeId);
        if (!type) return;
        onAdd(typeId, x - type.widthM / 2, y - type.depthM / 2, label);
      }
    },
    [zoom, stagePos, onAdd, onAddCustom],
  );

  // Click/tap on empty space — place building (mobile) or deselect
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target !== e.target.getStage()) return;

      // Mobile tap-to-place
      if (placingTypeId && onPlaced) {
        const stage = stageRef.current;
        if (!stage) return;
        const pointer = stage.getPointerPosition();
        if (!pointer) return;
        const x = (pointer.x - stagePos.x) / zoom / PIXELS_PER_METRE;
        const y = (pointer.y - stagePos.y) / zoom / PIXELS_PER_METRE;

        const customMatch = placingTypeId.match(/^custom-(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
        if (customMatch && onAddCustom) {
          const w = parseFloat(customMatch[1]);
          const d = parseFloat(customMatch[2]);
          onAddCustom(w, d, x - w / 2, y - d / 2, placingLabel || `${w}×${d}m`);
        } else {
          const type = getBuildingType(placingTypeId);
          if (type) {
            onAdd(placingTypeId, x - type.widthM / 2, y - type.depthM / 2, placingLabel || type.shortLabel);
          }
        }
        onPlaced();
        return;
      }

      onSelect(null);
    },
    [onSelect, placingTypeId, placingLabel, onPlaced, stageRef, stagePos, zoom, onAdd, onAddCustom],
  );

  // Pinch-to-zoom for touch
  const lastDist = useRef(0);
  const lastCenter = useRef({ x: 0, y: 0 });
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

  const handleTouchEnd = useCallback(() => {
    lastDist.current = 0;
  }, []);

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

  // Zoom controls
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  const zoomReset = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Tap-to-place indicator */}
      {placingTypeId && isMobile && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
          Tap canvas to place · {placingLabel}
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur rounded-lg border border-gray-200 shadow-sm px-1 py-1">
        <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Zoom out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
        <button onClick={zoomReset} className="px-2 h-8 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Zoom in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </button>
      </div>

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

      {/* Map rotation & compass — bottom right */}
      {hasMap && (
        <div className="absolute bottom-3 right-3 z-10 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-sm flex items-center justify-center" title={`North: ${mapRotation === 0 ? "up" : `${Math.round(mapRotation)}° rotated`}`}>
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: `rotate(${-mapRotation}deg)`, transition: "transform 0.2s" }}>
              <polygon points="16,4 20,18 16,15 12,18" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
              <polygon points="16,28 12,18 16,21 20,18" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.5" />
              <text x="16" y="3" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EF4444" style={{ transform: `rotate(${mapRotation}deg)`, transformOrigin: "16px 16px" }}>N</text>
            </svg>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-lg border border-gray-200 shadow-sm p-2 flex flex-col items-center gap-1.5">
            <span className="text-[9px] text-gray-500 font-medium">Map Rotation</span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={mapRotation}
              onChange={(e) => onMapRotation?.(parseFloat(e.target.value))}
              className="w-20 h-1 accent-amber-500"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={Math.round(mapRotation)}
                onChange={(e) => onMapRotation?.(parseFloat(e.target.value) || 0)}
                className="w-12 px-1 py-0.5 text-[10px] text-center rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                min={-180}
                max={180}
              />
              <span className="text-[9px] text-gray-400">°</span>
            </div>
            {mapRotation !== 0 && (
              <button
                onClick={() => onMapRotation?.(0)}
                className="text-[9px] text-amber-600 hover:text-amber-700 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full h-full min-h-[500px]"
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
          draggable
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStagePos({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onWheel={handleWheel}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Map background layer */}
          {mapData && (() => {
            const imgW = mapData.image.width * mapData.scale;
            const imgH = mapData.image.height * mapData.scale;
            return (
              <Layer>
                <KonvaImage
                  image={mapData.image}
                  x={mapData.x + imgW / 2}
                  y={mapData.y + imgH / 2}
                  offsetX={mapData.image.width / 2}
                  offsetY={mapData.image.height / 2}
                  scaleX={mapData.scale}
                  scaleY={mapData.scale}
                  rotation={mapRotation}
                  opacity={mapOpacity}
                  draggable
                  onDragEnd={(e) => {
                    onMapMove?.(e.target.x() - imgW / 2, e.target.y() - imgH / 2);
                  }}
                />
              </Layer>
            );
          })()}

          {/* Grid layer */}
          <Layer listening={false}>{gridLines}</Layer>

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
                  onDragEnd={(x, y) => onMove(b.instanceId, x, y)}
                />
              );
            })}
          </Layer>

          {/* Annotations layer */}
          {annotations.length > 0 && (
            <Layer>
              {annotations.map((a) => (
                <Group
                  key={a.id}
                  x={a.x}
                  y={a.y}
                  draggable
                  onDragEnd={(e) => {
                    onAnnotationMove?.(a.id, e.target.x(), e.target.y());
                  }}
                >
                  <Circle x={0} y={0} radius={4} fill="#EF4444" stroke="#fff" strokeWidth={1.5} />
                  <Line
                    points={[0, 0, 8, -12]}
                    stroke="#EF4444"
                    strokeWidth={1.5}
                  />
                  <KonvaText
                    x={10}
                    y={-20}
                    text={a.text}
                    fontSize={12}
                    fontStyle="bold"
                    fontFamily="system-ui, sans-serif"
                    fill="#1F2937"
                    padding={4}
                  />
                </Group>
              ))}
            </Layer>
          )}

          {/* Sun direction overlay */}
          {sunDirection !== null && sunDirection !== undefined && (() => {
            const canvasW = CANVAS_WIDTH_M * ppm;
            const canvasH = CANVAS_HEIGHT_M * ppm;
            const cx = canvasW / 2;
            const cy = canvasH / 2;
            const rad = (sunDirection * Math.PI) / 180;
            const radius = Math.min(canvasW, canvasH) * 0.45;
            const sunX = cx + Math.sin(rad) * radius;
            const sunY = cy - Math.cos(rad) * radius;
            const lineLen = Math.max(canvasW, canvasH) * 1.5;
            const perpRad = rad + Math.PI / 2;
            const perpDx = Math.cos(perpRad);
            const perpDy = Math.sin(perpRad);
            const shadowDx = Math.sin(rad);
            const shadowDy = -Math.cos(rad);

            const shadowLines: React.ReactNode[] = [];
            // More prominent shadow lines with gradient opacity
            for (let i = -12; i <= 12; i++) {
              const offsetDist = i * 30;
              const baseCx = cx + perpDx * offsetDist;
              const baseCy = cy + perpDy * offsetDist;
              const opacity = 0.35 - Math.abs(i) * 0.02;
              shadowLines.push(
                <Line
                  key={`sunray-${i}`}
                  points={[
                    baseCx - shadowDx * lineLen / 2,
                    baseCy - shadowDy * lineLen / 2,
                    baseCx + shadowDx * lineLen / 2,
                    baseCy + shadowDy * lineLen / 2,
                  ]}
                  stroke={`rgba(251, 191, 36, ${Math.max(0.05, opacity)})`}
                  strokeWidth={3}
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

            // Shadow band (semi-transparent fill on one side)
            const bandWidth = 400;
            const bandOffset = bandWidth / 2;
            const shadowBand = [
              cx + perpDx * bandOffset - shadowDx * lineLen / 2,
              cy + perpDy * bandOffset - shadowDy * lineLen / 2,
              cx + perpDx * bandOffset + shadowDx * lineLen / 2,
              cy + perpDy * bandOffset + shadowDy * lineLen / 2,
              cx + perpDx * (bandOffset + 200) + shadowDx * lineLen / 2,
              cy + perpDy * (bandOffset + 200) + shadowDy * lineLen / 2,
              cx + perpDx * (bandOffset + 200) - shadowDx * lineLen / 2,
              cy + perpDy * (bandOffset + 200) - shadowDy * lineLen / 2,
            ];

            return (
              <Layer listening={false}>
                {/* Shadow band on one side */}
                <Line
                  points={shadowBand}
                  fill="rgba(0, 0, 0, 0.06)"
                  closed
                />
                {shadowLines}
                {/* Sun glow */}
                <Circle x={sunX} y={sunY} radius={24} fill="rgba(251, 191, 36, 0.2)" />
                <Circle x={sunX} y={sunY} radius={18} fill="#FCD34D" stroke="#F59E0B" strokeWidth={2.5} />
                {rayLines}
                {/* Direction arrow */}
                <Arrow
                  points={[
                    sunX + shadowDx * 40,
                    sunY + shadowDy * 40,
                    sunX + shadowDx * 90,
                    sunY + shadowDy * 90,
                  ]}
                  fill="#F59E0B"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  pointerLength={10}
                  pointerWidth={8}
                />
                <KonvaText
                  x={sunX - 25}
                  y={sunY - 40}
                  text="☀ Sun"
                  fontSize={13}
                  fontStyle="bold"
                  fill="#B45309"
                  width={50}
                  align="center"
                />
              </Layer>
            );
          })()}
        </Stage>
      </div>
    </div>
  );
}
