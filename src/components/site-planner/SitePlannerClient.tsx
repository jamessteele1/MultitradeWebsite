"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BuildingPalette from "./BuildingPalette";
import PlannerToolbar from "./PlannerToolbar";
import { usePlannerState } from "@/lib/site-planner/usePlannerState";
import { getBuildingType } from "@/lib/site-planner/buildings";
import { downloadPNG, downloadPDF } from "@/lib/site-planner/exportUtils";
import { fetchSatelliteImage, type GeoResult } from "@/lib/site-planner/mapUtils";
import { PIXELS_PER_METRE, CANVAS_WIDTH_M, CANVAS_HEIGHT_M } from "@/lib/site-planner/constants";
import type { MapData } from "./PlannerCanvas";
import type Konva from "konva";

const PlannerCanvas = dynamic(() => import("./PlannerCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center justify-center min-h-[500px]">
      <div className="w-8 h-8 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  ),
});

type Annotation = { id: string; x: number; y: number; text: string };

let annotationCounter = 0;

export default function SitePlannerClient() {
  const stageRef = useRef<Konva.Stage>(null);
  const [isMobile, setIsMobile] = useState(false);
  const state = usePlannerState();

  // Map state
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapOpacity, setMapOpacity] = useState(0.7);
  const [mapRotation, setMapRotation] = useState(0);
  const [mapLoading, setMapLoading] = useState(false);
  const [sunEnabled, setSunEnabled] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const selectedBuilding = state.buildings.find((b) => b.instanceId === state.selectedId);
  const selectedType = selectedBuilding ? getBuildingType(selectedBuilding.typeId) : undefined;

  const handleRotate = useCallback(() => {
    if (state.selectedId) state.rotateBuilding(state.selectedId);
  }, [state]);

  const handleRotateTo = useCallback(
    (degrees: number) => {
      if (state.selectedId) state.rotateBuildingTo(state.selectedId, degrees);
    },
    [state],
  );

  const handleDelete = useCallback(() => {
    if (state.selectedId) state.removeBuilding(state.selectedId);
  }, [state]);

  const handleLabel = useCallback(
    (label: string) => {
      if (state.selectedId) state.labelBuilding(state.selectedId, label);
    },
    [state],
  );

  const handleClear = useCallback(() => {
    if (confirm("Remove all buildings from the canvas?")) {
      state.clearAll();
      setAnnotations([]);
    }
  }, [state]);

  const handleExportPNG = useCallback(() => {
    if (stageRef.current) downloadPNG(stageRef.current);
  }, []);

  const handleExportPDF = useCallback(() => {
    if (stageRef.current) downloadPDF(stageRef.current, state.buildings);
  }, [state.buildings]);

  // Custom building drop
  const handleAddCustom = useCallback(
    (widthM: number, depthM: number, x: number, y: number, label: string) => {
      const typeId = `custom-${widthM}x${depthM}`;
      state.addBuilding(typeId, x, y, label);
    },
    [state],
  );

  // Annotations
  const handleAddAnnotation = useCallback((text: string) => {
    const ppm = PIXELS_PER_METRE;
    const cx = (CANVAS_WIDTH_M * ppm) / 2;
    const cy = (CANVAS_HEIGHT_M * ppm) / 2;
    setAnnotations((prev) => [
      ...prev,
      { id: `note-${Date.now()}-${++annotationCounter}`, x: cx, y: cy, text },
    ]);
  }, []);

  const handleAnnotationMove = useCallback((id: string, x: number, y: number) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, x, y } : a)),
    );
  }, []);

  const handleDeleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Get a Quote — open quote page with items from planner
  const handleGetQuote = useCallback(() => {
    // Count items by type
    const counts: Record<string, number> = {};
    for (const b of state.buildings) {
      const type = getBuildingType(b.typeId);
      if (type?.cartId) {
        counts[type.cartId] = (counts[type.cartId] || 0) + 1;
      }
    }
    // Build query string
    const params = new URLSearchParams();
    for (const [cartId, qty] of Object.entries(counts)) {
      params.append("item", `${cartId}:${qty}`);
    }
    params.append("from", "planner");
    window.open(`/quote?${params.toString()}`, "_blank");
  }, [state.buildings]);

  // Map handlers
  const handleMapSelect = useCallback(async (result: GeoResult) => {
    setMapLoading(true);
    try {
      const { image, scale } = await fetchSatelliteImage(
        result.lat,
        result.lng,
        PIXELS_PER_METRE,
      );

      const canvasCenterX = (CANVAS_WIDTH_M * PIXELS_PER_METRE) / 2;
      const canvasCenterY = (CANVAS_HEIGHT_M * PIXELS_PER_METRE) / 2;
      const imgDisplayW = image.width * scale;
      const imgDisplayH = image.height * scale;

      setMapData({
        image,
        scale,
        x: canvasCenterX - imgDisplayW / 2,
        y: canvasCenterY - imgDisplayH / 2,
      });
    } catch {
      alert("Failed to load satellite imagery. Please try again.");
    }
    setMapLoading(false);
  }, []);

  const handleMapMove = useCallback((x: number, y: number) => {
    setMapData((prev) => (prev ? { ...prev, x, y } : null));
  }, []);

  const handleMapRemove = useCallback(() => {
    setMapData(null);
    setMapRotation(0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (state.selectedId) {
          e.preventDefault();
          state.removeBuilding(state.selectedId);
        }
      } else if (e.key === "r" || e.key === "R") {
        if (state.selectedId) state.rotateBuilding(state.selectedId);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        state.undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state]);

  if (isMobile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <div className="p-8 rounded-2xl border border-gray-200 bg-white">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
            <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Desktop Recommended</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            The site layout planner uses drag-and-drop and works best on a larger screen. Please visit this page on a desktop or laptop.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-3">
      {/* Toolbar */}
      <PlannerToolbar
        selectedId={state.selectedId}
        canUndo={state.canUndo}
        buildingCount={state.buildings.length}
        onRotate={handleRotate}
        onDelete={handleDelete}
        onLabel={handleLabel}
        onUndo={state.undo}
        onClear={handleClear}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        currentLabel={selectedType?.shortLabel}
        currentRotation={selectedBuilding?.rotation}
        onRotateTo={handleRotateTo}
        hasMap={!!mapData}
        mapOpacity={mapOpacity}
        mapLoading={mapLoading}
        onMapSelect={handleMapSelect}
        onMapOpacityChange={setMapOpacity}
        onMapRemove={handleMapRemove}
        sunEnabled={sunEnabled}
        onSunToggle={() => setSunEnabled((prev) => !prev)}
        onGetQuote={handleGetQuote}
        onAddAnnotation={handleAddAnnotation}
        annotations={annotations}
        onDeleteAnnotation={handleDeleteAnnotation}
      />

      {/* Main content: palette + canvas */}
      <div className="flex gap-3" style={{ height: "calc(100vh - 320px)", minHeight: 500 }}>
        <BuildingPalette />
        <PlannerCanvas
          buildings={state.buildings}
          selectedId={state.selectedId}
          onSelect={state.setSelectedId}
          onMove={state.moveBuilding}
          onAdd={state.addBuilding}
          onAddCustom={handleAddCustom}
          stageRef={stageRef}
          mapData={mapData}
          mapOpacity={mapOpacity}
          mapRotation={mapRotation}
          onMapMove={handleMapMove}
          onMapRotation={setMapRotation}
          sunDirection={sunEnabled ? mapRotation : null}
          annotations={annotations}
          onAnnotationMove={handleAnnotationMove}
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="flex items-center gap-4 text-[11px] text-gray-400 px-1">
        <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 font-mono text-[10px]">R</kbd> Rotate 90°</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 font-mono text-[10px]">Del</kbd> Delete</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 font-mono text-[10px]">⌘Z</kbd> Undo</span>
        <span>Scroll to zoom · Drag canvas to pan</span>
      </div>
    </div>
  );
}
