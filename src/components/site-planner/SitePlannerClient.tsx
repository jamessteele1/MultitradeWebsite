"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BuildingPalette from "./BuildingPalette";
import PlannerToolbar from "./PlannerToolbar";
import { usePlannerState } from "@/lib/site-planner/usePlannerState";
import { getBuildingType } from "@/lib/site-planner/buildings";
import { downloadPNG, downloadPDF } from "@/lib/site-planner/exportUtils";
import { fetchSatelliteImage, type GeoResult } from "@/lib/site-planner/mapUtils";
import { findDeckSnap } from "@/lib/site-planner/snapUtils";
import { useQuoteCart } from "@/context/QuoteCartContext";
import { PIXELS_PER_METRE, CANVAS_WIDTH_M, CANVAS_HEIGHT_M } from "@/lib/site-planner/constants";
import type { MapData } from "./PlannerCanvas";
import type Konva from "konva";

// Product catalog for mapping planner buildings to cart items
const CART_PRODUCTS: Record<string, { id: string; name: string; size: string; img: string; category: "site-offices" | "crib-rooms" | "ablutions" | "containers" | "ancillary" | "complexes" }> = {
  "3x3m-office":       { id: "3x3m-office",       name: "3x3m Office",             size: "3x3m",       img: "/images/products/3x3-office/1.jpg",        category: "site-offices" },
  "6x3m-office":       { id: "6x3m-office",       name: "6x3m Office",             size: "6x3m",       img: "/images/products/6x3-office/1.jpg",        category: "site-offices" },
  "12x3m-office":      { id: "12x3m-office",      name: "12x3m Office",            size: "12x3m",      img: "/images/products/12x3-office/1.jpg",       category: "site-offices" },
  "6x3m-crib-room":    { id: "6x3m-crib-room",    name: "6x3m Crib Room",          size: "6x3m",       img: "/images/products/6x3-crib/1.jpg",          category: "crib-rooms" },
  "12x3m-crib-room":   { id: "12x3m-crib-room",   name: "12x3m Crib Room",         size: "12x3m",      img: "/images/products/12x3-crib-room/1.jpg",    category: "crib-rooms" },
  "solar-toilet":      { id: "solar-toilet",      name: "Solar Toilet",            size: "5.45x2.4m",  img: "/images/products/solar-toilet-6x24/1.jpg",  category: "ablutions" },
  "3-6x2-4m-toilet":   { id: "3-6x2-4m-toilet",   name: "3.6x2.4m Toilet",        size: "3.6x2.4m",   img: "/images/products/36x24-toilet/1.jpg",      category: "ablutions" },
  "6x3m-toilet-block": { id: "6x3m-toilet-block", name: "6x3m Toilet Block",      size: "6x3m",       img: "/images/products/6x3-toilet/1.jpg",        category: "ablutions" },
  "20ft-container":    { id: "20ft-container",    name: "20ft Container",          size: "6x2.4m",     img: "/images/products/20ft-container/1.jpg",     category: "containers" },
  "5000l-tank-pump":   { id: "5000l-tank-pump",   name: "5000L Water Tank & Pump", size: "Skid mounted", img: "/images/products/5000l-tank-pump/1.jpg",  category: "ancillary" },
  "stair-landing":     { id: "stair-landing",     name: "Stair & Landing",         size: "Various",     img: "/images/products/stair-landing/1.jpg",     category: "ancillary" },
  "12x3m-deck":        { id: "12x3m-deck",        name: "12x3m Covered Deck",      size: "12x3m",      img: "/images/products/12x3m-covered-deck/1.jpg", category: "ancillary" },
  "6x3m-deck":         { id: "6x3m-deck",         name: "6x3m Covered Deck",       size: "6x3m",       img: "/images/products/12x3m-covered-deck/1.jpg", category: "ancillary" },
  "12x6m-complex":     { id: "12x6m-complex",     name: "12x6m Complex",           size: "12x6m",      img: "/images/products/12x3-office/1.jpg",       category: "complexes" },
  "12x9m-complex":     { id: "12x9m-complex",     name: "12x9m Complex",           size: "12x9m",      img: "/images/products/12x3-office/1.jpg",       category: "complexes" },
  "12x12m-complex":    { id: "12x12m-complex",    name: "12x12m Complex",          size: "12x12m",     img: "/images/products/12x3-office/1.jpg",       category: "complexes" },
};

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
  const { addItem, openCart, items: cartItems, updateQuantity } = useQuoteCart();

  // Map state
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapOpacity, setMapOpacity] = useState(0.7);
  const [mapRotation, setMapRotation] = useState(0);
  const [mapLoading, setMapLoading] = useState(false);
  const [sunEnabled, setSunEnabled] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [siteAddress, setSiteAddress] = useState<string | undefined>();
  const [siteCoords, setSiteCoords] = useState<{ lat: number; lng: number } | undefined>();

  // Mobile tap-to-place state
  const [placingTypeId, setPlacingTypeId] = useState<string | null>(null);
  const [placingLabel, setPlacingLabel] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
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
    if (stageRef.current) downloadPDF(stageRef.current, state.buildings, mapRotation, siteAddress, siteCoords);
  }, [state.buildings, mapRotation, siteAddress, siteCoords]);

  // Building move with deck snap detection
  const handleBuildingMove = useCallback(
    (instanceId: string, x: number, y: number) => {
      const building = state.buildings.find((b) => b.instanceId === instanceId);
      if (!building) {
        state.moveBuilding(instanceId, x, y);
        return;
      }

      const type = getBuildingType(building.typeId);
      if (type?.category === "decks") {
        // Run snap detection for decks
        const movedDeck = { ...building, x, y };
        const snapResult = findDeckSnap(movedDeck, type, state.buildings, getBuildingType);
        if (snapResult) {
          state.moveBuilding(instanceId, snapResult.x, snapResult.y, snapResult.parentId);
        } else {
          state.moveBuilding(instanceId, x, y, null); // detach
        }
      } else {
        state.moveBuilding(instanceId, x, y);
      }
    },
    [state],
  );

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

  // Get a Quote — add planner items to the quote cart (skip custom shapes & utility markers)
  const handleGetQuote = useCallback(() => {
    const counts: Record<string, number> = {};
    for (const b of state.buildings) {
      const type = getBuildingType(b.typeId);
      if (type?.cartId && CART_PRODUCTS[type.cartId]) {
        counts[type.cartId] = (counts[type.cartId] || 0) + 1;
      }
    }

    if (Object.keys(counts).length === 0) {
      alert("No quotable items on the planner. Custom shapes and utility markers can't be quoted — add standard buildings first.");
      return;
    }

    for (const [cartId, qty] of Object.entries(counts)) {
      const product = CART_PRODUCTS[cartId];
      const existing = cartItems.find((i) => i.id === cartId);
      if (existing) {
        // Set exact quantity rather than adding on top
        updateQuantity(cartId, qty);
      } else {
        // Add once, then set quantity if > 1
        addItem(product);
        if (qty > 1) updateQuantity(cartId, qty);
      }
    }
    openCart();
  }, [state.buildings, addItem, openCart, cartItems, updateQuantity]);

  // Map handlers
  const handleMapSelect = useCallback(async (result: GeoResult) => {
    setSiteAddress(result.displayName);
    setSiteCoords({ lat: result.lat, lng: result.lng });
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

  // Mobile: select a building type for tap-to-place
  const handleSelectPlacingType = useCallback((typeId: string, label: string) => {
    setPlacingTypeId(typeId);
    setPlacingLabel(label);
  }, []);

  const handlePlaced = useCallback(() => {
    // Keep the type selected so user can place multiple — tap the palette item again to deselect
    // setPlacingTypeId(null);
  }, []);

  if (isMobile) {
    return (
      <div className="px-2 py-2 space-y-2 pb-16">
        {/* Compact mobile toolbar */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 px-2 py-1.5 overflow-x-auto scrollbar-hide">
          <button onClick={handleRotate} disabled={!state.selectedId} className="flex-shrink-0 p-2 rounded-lg text-gray-600 disabled:text-gray-300" title="Rotate">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6" /><path d="M21.34 13.5A10 10 0 115.5 3.36L21.5 8" /></svg>
          </button>
          <button onClick={handleDelete} disabled={!state.selectedId} className="flex-shrink-0 p-2 rounded-lg text-red-500 disabled:text-gray-300" title="Delete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </button>
          <button onClick={state.undo} disabled={!state.canUndo} className="flex-shrink-0 p-2 rounded-lg text-gray-600 disabled:text-gray-300" title="Undo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 0115.36-6.36L21 9" /></svg>
          </button>

          <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />

          <button onClick={handleClear} disabled={state.buildings.length === 0} className="flex-shrink-0 px-2 py-1.5 text-[10px] font-semibold text-gray-600 disabled:text-gray-300 rounded-lg">
            Clear
          </button>

          <button onClick={() => setSunEnabled(p => !p)} className={`flex-shrink-0 p-2 rounded-lg ${sunEnabled ? "text-amber-600 bg-amber-50" : "text-gray-600"}`} title="Sun">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </button>

          <div className="flex-1" />

          <span className="text-[10px] text-gray-400 flex-shrink-0">{state.buildings.length}</span>

          <button onClick={handleExportPDF} disabled={state.buildings.length === 0} className="flex-shrink-0 px-2 py-1.5 text-[10px] font-semibold text-gray-600 disabled:text-gray-300 rounded-lg border border-gray-200">
            PDF
          </button>
          <button onClick={handleGetQuote} disabled={state.buildings.length === 0} className="flex-shrink-0 px-2.5 py-1.5 text-[10px] font-bold bg-gold text-gray-900 rounded-lg disabled:opacity-40">
            Quote
          </button>
        </div>

        {/* Canvas */}
        <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: 350 }}>
          <PlannerCanvas
            buildings={state.buildings}
            selectedId={state.selectedId}
            onSelect={state.setSelectedId}
            onMove={handleBuildingMove}
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
            placingTypeId={placingTypeId}
            placingLabel={placingLabel}
            onPlaced={handlePlaced}
            isMobile
          />
        </div>

        {/* Mobile bottom palette (fixed) */}
        <BuildingPalette
          isMobile
          selectedTypeId={placingTypeId}
          onSelectType={handleSelectPlacingType}
        />
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
          onMove={handleBuildingMove}
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
