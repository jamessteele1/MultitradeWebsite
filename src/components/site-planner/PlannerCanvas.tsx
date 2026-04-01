"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Stage, Layer, Line, Text as KonvaText, Image as KonvaImage } from "react-konva";
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
  stageRef: React.RefObject<Konva.Stage>;
  mapData?: MapData | null;
  mapOpacity?: number;
  mapRotation?: number;
  onMapMove?: (x: number, y: number) => void;
  onMapRotation?: (degrees: number) => void;
};

export default function PlannerCanvas({
  buildings,
  selectedId,
  onSelect,
  onMove,
  onAdd,
  stageRef,
  mapData,
  mapOpacity = 0.7,
  mapRotation = 0,
  onMapMove,
  onMapRotation,
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
      // Auto-fit zoom on first render so full grid is visible
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
      if (!typeId) return;

      const type = getBuildingType(typeId);
      if (!type) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - stagePos.x) / zoom / PIXELS_PER_METRE;
      const y = (e.clientY - rect.top - stagePos.y) / zoom / PIXELS_PER_METRE;

      // Center the building on the drop point
      onAdd(typeId, x - type.widthM / 2, y - type.depthM / 2, label);
    },
    [zoom, stagePos, onAdd],
  );

  // Click on empty space deselects
  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
      }
    },
    [onSelect],
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

  // Scale indicator
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

  // Zoom controls
  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  const zoomReset = () => {
    setZoom(1);
    setStagePos({ x: 0, y: 0 });
  };

  return (
    <div className="relative flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
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

      {/* Map rotation & compass — bottom right */}
      {hasMap && (
        <div className="absolute bottom-3 right-3 z-10 flex flex-col items-center gap-2">
          {/* North compass */}
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur border border-gray-200 shadow-sm flex items-center justify-center" title={`North: ${mapRotation === 0 ? "up" : `${Math.round(mapRotation)}° rotated`}`}>
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ transform: `rotate(${-mapRotation}deg)`, transition: "transform 0.2s" }}>
              <polygon points="16,4 20,18 16,15 12,18" fill="#EF4444" stroke="#DC2626" strokeWidth="0.5" />
              <polygon points="16,28 12,18 16,21 20,18" fill="#9CA3AF" stroke="#6B7280" strokeWidth="0.5" />
              <text x="16" y="3" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#EF4444" style={{ transform: `rotate(${mapRotation}deg)`, transformOrigin: "16px 16px" }}>N</text>
            </svg>
          </div>

          {/* Rotation control */}
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
              style={{ writingMode: "horizontal-tb" }}
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
                  onSelect={() => onSelect(b.instanceId)}
                  onDragEnd={(x, y) => onMove(b.instanceId, x, y)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
