"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BuildingPalette from "./BuildingPalette";
import BuildingSelectionPopup from "./BuildingSelectionPopup";
import PlannerToolbar from "./PlannerToolbar";
import DrawingTools from "./DrawingTools";
import MobileMapBar from "./MobileMapBar";
import PlannerOnboarding from "./PlannerOnboarding";
import MobilePdfDeliveryModal from "./MobilePdfDeliveryModal";
import { usePlannerState } from "@/lib/site-planner/usePlannerState";
import { getBuildingType } from "@/lib/site-planner/buildings";
import { downloadPNG, downloadPDF, generatePDFBase64 } from "@/lib/site-planner/exportUtils";
import { fetchSatelliteImage, type GeoResult } from "@/lib/site-planner/mapUtils";
import { findDeckSnap } from "@/lib/site-planner/snapUtils";
import { useQuoteCart } from "@/context/QuoteCartContext";
import { PIXELS_PER_METRE, CANVAS_WIDTH_M, CANVAS_HEIGHT_M } from "@/lib/site-planner/constants";
import {
  DEFAULT_DRAW_STYLE,
  DEFAULT_TEXT_STYLE,
  type DrawStyle,
  type TextStyle,
  type ToolMode,
} from "@/lib/site-planner/toolState";
import type { MapData } from "./PlannerCanvas";
import type Konva from "konva";

// Product catalog for mapping planner buildings to cart items
const CART_PRODUCTS: Record<string, { id: string; name: string; size: string; img: string; category: "site-offices" | "crib-rooms" | "ablutions" | "containers" | "ancillary" | "complexes" }> = {
  "3x3m-office":       { id: "3x3m-office",       name: "3x3m Office",             size: "3x3m",       img: "/images/products/3x3-office/1.jpg",        category: "site-offices" },
  "6x3m-office":       { id: "6x3m-office",       name: "6x3m Office",             size: "6x3m",       img: "/images/products/6x3-office/1.jpg",        category: "site-offices" },
  "12x3m-office":      { id: "12x3m-office",      name: "12x3m Office",            size: "12x3m",      img: "/images/products/12x3-office/1.jpg",       category: "site-offices" },
  "3x3m-crib-room":    { id: "3x3m-crib-room",    name: "3x3m Crib Room",          size: "3x3m",       img: "/images/products/6x3-crib/1.jpg",          category: "crib-rooms" },
  "6x3m-crib-room":    { id: "6x3m-crib-room",    name: "6x3m Crib Room",          size: "6x3m",       img: "/images/products/6x3-crib/1.jpg",          category: "crib-rooms" },
  "12x3m-crib-room":   { id: "12x3m-crib-room",   name: "12x3m Crib Room",         size: "12x3m",      img: "/images/products/12x3-crib-room/1.jpg",    category: "crib-rooms" },
  "solar-toilet":      { id: "solar-toilet",      name: "Solar Toilet",            size: "5.45x2.4m",  img: "/images/products/solar-toilet-6x24/1.jpg",  category: "ablutions" },
  "3-6x2-4m-toilet":   { id: "3-6x2-4m-toilet",   name: "3.6x2.4m Toilet",        size: "3.6x2.4m",   img: "/images/products/36x24-toilet/1.jpg",      category: "ablutions" },
  "6x3m-toilet-block": { id: "6x3m-toilet-block", name: "6x3m Toilet Block",      size: "6x3m",       img: "/images/products/6x3-toilet/1.jpg",        category: "ablutions" },
  "6x3m-shower-block": { id: "6x3m-shower-block", name: "6x3m Shower Block",      size: "6x3m",       img: "/images/products/6x3-toilet/1.jpg",        category: "ablutions" },
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

export default function SitePlannerClient() {
  const stageRef = useRef<Konva.Stage>(null);
  const [isMobile, setIsMobile] = useState(false);
  const state = usePlannerState();
  const { addItem, openCart, items: cartItems, updateQuantity, setSiteLayout } = useQuoteCart();

  // Drawing/text tool state
  const [tool, setTool] = useState<ToolMode>("select");
  const [drawStyle, setDrawStyle] = useState<DrawStyle>(DEFAULT_DRAW_STYLE);
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);

  // Selection state for drawings + text annotations — surfaced from the
  // canvas so the toolbar can render edit-after-creation controls.
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const handleSelectionChange = useCallback(
    (sel: { drawingId: string | null; textId: string | null }) => {
      setSelectedDrawingId(sel.drawingId);
      setSelectedTextId(sel.textId);
    },
    [],
  );

  // Map state
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [mapOpacity, setMapOpacity] = useState(0.7);
  const [mapRotation, setMapRotation] = useState(0);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapLocked, setMapLocked] = useState(false);
  const [mapScaleMultiplier, setMapScaleMultiplier] = useState(1);
  const [moveSiteAsOne, setMoveSiteAsOne] = useState(false);
  const [sunEnabled, setSunEnabled] = useState(false);
  const [siteAddress, setSiteAddress] = useState<string | undefined>();
  const [siteCoords, setSiteCoords] = useState<{ lat: number; lng: number } | undefined>();

  // Tap/click-to-place state (mobile + desktop popup)
  const [placingTypeId, setPlacingTypeId] = useState<string | null>(null);
  const [placingLabel, setPlacingLabel] = useState("");
  const [buildingPopupOpen, setBuildingPopupOpen] = useState(false);

  // Mobile PDF delivery modal — opens instead of jsPDF.save() since mobile
  // browsers handle direct PDF downloads inconsistently.
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const selectedBuilding = state.buildings.find((b) => b.instanceId === state.selectedId);
  const selectedType = selectedBuilding ? getBuildingType(selectedBuilding.typeId) : undefined;

  // Resolve selected drawing / text + handlers passed to DrawingTools so the
  // user can edit colour, thickness, opacity, etc. after the shape exists.
  const selectedDrawingObj = selectedDrawingId
    ? state.drawings.find((d) => d.id === selectedDrawingId) ?? null
    : null;
  const selectedTextObj = selectedTextId
    ? state.texts.find((t) => t.id === selectedTextId) ?? null
    : null;

  const selectedDrawingForTools = selectedDrawingObj
    ? {
        color: selectedDrawingObj.color,
        thickness: selectedDrawingObj.thickness,
        dashed: selectedDrawingObj.dashed,
        opacity: selectedDrawingObj.opacity ?? 1,
        closed: selectedDrawingObj.closed,
      }
    : null;
  const selectedTextForTools = selectedTextObj
    ? {
        color: selectedTextObj.color,
        fontSize: selectedTextObj.fontSize,
        opacity: selectedTextObj.opacity ?? 1,
        text: selectedTextObj.text,
      }
    : null;

  const handleSelectedDrawingChange = useCallback(
    (patch: Partial<{ color: string; thickness: number; dashed: boolean; opacity: number; closed: boolean }>) => {
      if (selectedDrawingId) state.updateDrawing(selectedDrawingId, patch);
    },
    [selectedDrawingId, state],
  );
  const handleSelectedDrawingDelete = useCallback(() => {
    if (selectedDrawingId) {
      state.removeDrawing(selectedDrawingId);
      setSelectedDrawingId(null);
    }
  }, [selectedDrawingId, state]);
  const handleDeselectDrawing = useCallback(() => setSelectedDrawingId(null), []);

  const handleSelectedTextChange = useCallback(
    (patch: Partial<{ color: string; fontSize: number; opacity: number; text: string }>) => {
      if (selectedTextId) state.updateText(selectedTextId, patch);
    },
    [selectedTextId, state],
  );
  const handleSelectedTextDelete = useCallback(() => {
    if (selectedTextId) {
      state.removeText(selectedTextId);
      setSelectedTextId(null);
    }
  }, [selectedTextId, state]);
  const handleDeselectText = useCallback(() => setSelectedTextId(null), []);

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
    if (confirm("Remove everything from the canvas? (buildings, drawings, text)")) {
      state.clearAll();
    }
  }, [state]);

  const handleExportPNG = useCallback(() => {
    if (stageRef.current) downloadPNG(stageRef.current);
  }, []);

  const handleExportPDF = useCallback(() => {
    if (!stageRef.current) return;
    if (isMobile) {
      // Mobile browsers (especially in-app browsers) handle direct PDF
      // downloads inconsistently — pop the email-or-open modal instead.
      setPdfModalOpen(true);
      return;
    }
    downloadPDF(stageRef.current, state.buildings, mapRotation, siteAddress, siteCoords);
  }, [isMobile, state.buildings, mapRotation, siteAddress, siteCoords]);

  // The modal expects this to throw on failure so it can show a useful
  // message — swallowing the error here would hide *why* it failed.
  const generatePdfBase64 = useCallback(async (): Promise<string> => {
    if (!stageRef.current) {
      throw new Error("Canvas isn't ready yet — please reload and try again.");
    }
    return await generatePDFBase64(stageRef.current, state.buildings, mapRotation, siteAddress, siteCoords);
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

  // Custom building drop — supports both generic custom shape and custom deck
  const handleAddCustom = useCallback(
    (widthM: number, depthM: number, x: number, y: number, label: string, mode: "generic" | "deck" = "generic") => {
      const typeId = mode === "deck"
        ? `custom-deck-${widthM}x${depthM}`
        : `custom-${widthM}x${depthM}`;
      state.addBuilding(typeId, x, y, label);
    },
    [state],
  );

  // Quick label entry triggered by double-click on a building
  const handleLabelEdit = useCallback(
    (instanceId: string) => {
      state.setSelectedId(instanceId);
      const current = state.buildings.find((b) => b.instanceId === instanceId);
      const next = window.prompt("Building label", current?.label || "");
      if (next !== null && next.trim()) {
        state.labelBuilding(instanceId, next.trim());
      }
    },
    [state],
  );

  // Legacy "Add Note" toolbar — drops a styled text annotation at the canvas centre
  const handleAddAnnotation = useCallback(
    (text: string) => {
      const ppm = PIXELS_PER_METRE;
      const cx = (CANVAS_WIDTH_M * ppm) / 2;
      const cy = (CANVAS_HEIGHT_M * ppm) / 2;
      state.addText({
        x: cx,
        y: cy,
        text,
        fontSize: textStyle.fontSize,
        color: textStyle.color,
        opacity: textStyle.opacity,
      });
    },
    [state, textStyle],
  );

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

    // Capture a snapshot of the site layout so the sales team has the design
    // alongside the quote. PNG goes to a file column on the Monday lead, the
    // structured JSON gets attached as long-text so we can re-import it later.
    if (stageRef.current) {
      try {
        const png = stageRef.current.toDataURL({ pixelRatio: 1.5, mimeType: "image/png" });
        const json = JSON.stringify({
          buildings: state.buildings,
          drawings: state.drawings,
          texts: state.texts,
          siteAddress,
          siteCoords,
          mapRotation,
          sunEnabled,
          capturedAt: new Date().toISOString(),
        });
        setSiteLayout({ png, json, address: siteAddress });
      } catch (err) {
        console.warn("Site layout snapshot failed:", err);
      }
    }

    openCart();
  }, [state.buildings, state.drawings, state.texts, addItem, openCart, cartItems, updateQuantity, setSiteLayout, siteAddress, siteCoords, mapRotation, sunEnabled]);

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
    } catch (err) {
      const msg = (err as Error)?.message || "Failed to load satellite imagery.";
      console.error("Satellite imagery failed:", err);
      alert(msg);
    } finally {
      // Always clear the spinner so we never leave the user stuck loading.
      setMapLoading(false);
    }
  }, []);

  const handleMapMove = useCallback((x: number, y: number) => {
    setMapData((prev) => (prev ? { ...prev, x, y } : null));
  }, []);

  const handleMapRemove = useCallback(() => {
    setMapData(null);
    setMapRotation(0);
    setMapLocked(false);
    setMoveSiteAsOne(false);
    setMapScaleMultiplier(1);
  }, []);

  /**
   * Recentre the map so its centre lands on the canvas centre — useful when
   * the user has dragged the map off-screen and wants a clean reset.
   */
  const handleMapRecenter = useCallback(() => {
    setMapData((prev) => {
      if (!prev) return prev;
      const effectiveScale = prev.scale * mapScaleMultiplier;
      const imgDisplayW = prev.image.width * effectiveScale;
      const imgDisplayH = prev.image.height * effectiveScale;
      const canvasCenterX = (CANVAS_WIDTH_M * PIXELS_PER_METRE) / 2;
      const canvasCenterY = (CANVAS_HEIGHT_M * PIXELS_PER_METRE) / 2;
      return { ...prev, x: canvasCenterX - imgDisplayW / 2, y: canvasCenterY - imgDisplayH / 2 };
    });
  }, [mapScaleMultiplier]);

  /**
   * "Move site as one" handler: when the user drags the map and this mode
   * is active, shift every building / drawing / text by the same delta in
   * metres so the layout stays anchored to the satellite features.
   */
  const handleMapDragShift = useCallback(
    (dxM: number, dyM: number) => {
      if (Math.abs(dxM) < 0.01 && Math.abs(dyM) < 0.01) return;
      // Shift buildings (in metres)
      for (const b of state.buildings) {
        state.moveBuilding(b.instanceId, b.x + dxM, b.y + dyM);
      }
      // Shift drawings (points are in canvas pixels)
      const dxPx = dxM * PIXELS_PER_METRE;
      const dyPx = dyM * PIXELS_PER_METRE;
      for (const d of state.drawings) {
        const shifted: number[] = [];
        for (let i = 0; i < d.points.length; i += 2) {
          shifted.push(d.points[i] + dxPx, d.points[i + 1] + dyPx);
        }
        // Replace the drawing in place
        state.removeDrawing(d.id);
        state.addDrawing({ ...d, points: shifted });
      }
      // Shift texts
      for (const t of state.texts) {
        state.moveText(t.id, t.x + dxPx, t.y + dyPx);
      }
    },
    [state],
  );

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

  // Select a building type for click/tap-to-place (mobile + desktop)
  const handleSelectPlacingType = useCallback((typeId: string, label: string) => {
    setPlacingTypeId(typeId);
    setPlacingLabel(label);
  }, []);

  const handlePlaced = useCallback(() => {
    // Auto-exit placement mode after a single drop. Vast majority of users
    // place one building at a time; previously they had to hit Cancel to
    // get back to the canvas. They can re-tap "+ Add" to place another.
    setPlacingTypeId(null);
    setPlacingLabel("");
  }, []);

  const handleCancelPlacing = useCallback(() => {
    setPlacingTypeId(null);
    setPlacingLabel("");
  }, []);

  // Escape key to cancel placement mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && placingTypeId) {
        e.preventDefault();
        handleCancelPlacing();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [placingTypeId, handleCancelPlacing]);

  if (isMobile) {
    return (
      <div className="px-2 py-2 space-y-1.5 pb-3">
        {/* First-visit explainer — dismissible, persisted */}
        <PlannerOnboarding isMobile />

        {/* Compact mobile action toolbar — fits on a single screen width */}
        <div className="flex items-center gap-0.5 bg-white rounded-xl border border-gray-200 px-1.5 py-1.5">
          {/* Add Building (primary) */}
          <button
            onClick={() => setBuildingPopupOpen(true)}
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-bold"
            aria-label="Add building"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>

          <button onClick={handleRotate} disabled={!state.selectedId} className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 disabled:text-gray-300" aria-label="Rotate" title="Rotate 90°">
            {/* Object-rotation icon: rectangle below + curved arrow above
                — reads as "rotate the selected object" rather than the
                generic "refresh / undo" arrow we had before. */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="13" width="12" height="8" rx="1" />
              <path d="M6 13a6 6 0 0 1 12 0" />
              <polyline points="15 3 18 6 15 9" />
              <path d="M18 6h-6" />
            </svg>
          </button>
          <button onClick={handleDelete} disabled={!state.selectedId} className="flex-shrink-0 p-1.5 rounded-lg text-red-500 disabled:text-gray-300" aria-label="Delete" title="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </button>
          <button onClick={state.undo} disabled={!state.canUndo} className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 disabled:text-gray-300" aria-label="Undo" title="Undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M3 13a9 9 0 0115.36-6.36L21 9" /></svg>
          </button>
          <button onClick={handleClear} disabled={state.buildings.length === 0 && state.drawings.length === 0 && state.texts.length === 0} className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 disabled:text-gray-300" aria-label="Clear" title="Clear">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
            </svg>
          </button>
          <button onClick={() => setSunEnabled(p => !p)} className={`flex-shrink-0 p-1.5 rounded-lg ${sunEnabled ? "text-amber-600 bg-amber-50" : "text-gray-600"}`} aria-label="Sun direction" title="Sun direction">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="1.5" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22.5" />
              <line x1="4.5" y1="4.5" x2="6" y2="6" /><line x1="18" y1="18" x2="19.5" y2="19.5" />
              <line x1="1.5" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22.5" y2="12" />
              <line x1="4.5" y1="19.5" x2="6" y2="18" /><line x1="18" y1="6" x2="19.5" y2="4.5" />
            </svg>
          </button>

          <div className="flex-1" />

          <button onClick={handleExportPDF} disabled={state.buildings.length === 0} className="flex-shrink-0 p-1.5 rounded-lg text-gray-600 disabled:text-gray-300 border border-gray-200" aria-label="Export PDF" title="Export PDF">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </button>

          {/* Quote — prominent gold pill with attention-grabbing pulse */}
          <button
            onClick={handleGetQuote}
            disabled={state.buildings.length === 0}
            className={`flex-shrink-0 ml-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-extrabold bg-gold text-gray-900 disabled:opacity-40 ${state.buildings.length > 0 ? "glow-gold" : "shadow-sm shadow-amber-500/20"}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            Quote
          </button>
        </div>

        {/* Address search + full map controls */}
        <MobileMapBar
          hasMap={!!mapData}
          mapLoading={mapLoading}
          mapRotation={mapRotation}
          onMapSelect={handleMapSelect}
          onMapRotation={setMapRotation}
          onMapRemove={handleMapRemove}
          mapLocked={mapLocked}
          onMapLockedChange={setMapLocked}
          mapScaleMultiplier={mapScaleMultiplier}
          onMapScaleChange={setMapScaleMultiplier}
          moveSiteAsOne={moveSiteAsOne}
          onMoveSiteAsOneChange={setMoveSiteAsOne}
          onMapRecenter={handleMapRecenter}
        />

        {/* Placement mode banner */}
        {placingTypeId && (
          <div className="flex items-center justify-between px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs font-semibold text-amber-800">
              Tap canvas to place: {placingLabel}
            </span>
            <button
              onClick={handleCancelPlacing}
              className="px-2.5 py-1 text-[10px] font-bold text-amber-700 bg-amber-100 rounded-lg border border-amber-300"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Drawing tools (mobile) — only the new-shape style row. The
            edit-after-creation controls move to the floating mobile
            selection bar over the canvas, so the toolbar stays short. */}
        <DrawingTools
          tool={tool}
          onToolChange={setTool}
          drawStyle={drawStyle}
          onDrawStyleChange={setDrawStyle}
          textStyle={textStyle}
          onTextStyleChange={setTextStyle}
          onClearDrawings={state.drawings.length > 0 ? state.clearDrawings : undefined}
          compact
        />

        {/* Canvas — toolbar above is now compact (one row regardless of
            tool) so we can give the canvas more vertical room. dvh (dynamic
            viewport height) accounts for iOS Safari's collapsing top/bottom
            chrome — using 100vh would let the chrome push the bottom of the
            canvas (and our floating selection bar) off-screen. */}
        <div
          className="rounded-xl border border-gray-200 overflow-hidden"
          style={{ height: "calc(100dvh - 240px)", minHeight: 380 }}
        >
          <PlannerCanvas
            buildings={state.buildings}
            selectedId={state.selectedId}
            onSelect={state.setSelectedId}
            onMove={handleBuildingMove}
            onLabelEdit={handleLabelEdit}
            onRemoveBuilding={state.removeBuilding}
            onAdd={state.addBuilding}
            onAddCustom={(w, d, x, y, label) => handleAddCustom(w, d, x, y, label)}
            stageRef={stageRef}
            mapData={mapData}
            mapOpacity={mapOpacity}
            mapRotation={mapRotation}
            onMapMove={handleMapMove}
            onMapRotation={setMapRotation}
            mapLocked={mapLocked}
            onMapLockedChange={setMapLocked}
            mapScaleMultiplier={mapScaleMultiplier}
            onMapScaleChange={setMapScaleMultiplier}
            moveSiteAsOne={moveSiteAsOne}
            onMoveSiteAsOneChange={setMoveSiteAsOne}
            onMapRecenter={handleMapRecenter}
            onMapDragShift={handleMapDragShift}
            sunDirection={sunEnabled ? mapRotation : null}
            drawings={state.drawings}
            texts={state.texts}
            onAddDrawing={state.addDrawing}
            onRemoveDrawing={state.removeDrawing}
            onUpdateDrawing={state.updateDrawing}
            onAddText={state.addText}
            onMoveText={state.moveText}
            onUpdateText={state.updateText}
            onRemoveText={state.removeText}
            onSelectionChange={handleSelectionChange}
            tool={tool}
            onToolChange={setTool}
            drawStyle={drawStyle}
            textStyle={textStyle}
            placingTypeId={placingTypeId}
            placingLabel={placingLabel}
            onPlaced={handlePlaced}
            onRequestAdd={() => setBuildingPopupOpen(true)}
            isMobile
          />
        </div>

        {/* Building selection popup */}
        <BuildingSelectionPopup
          open={buildingPopupOpen}
          onClose={() => setBuildingPopupOpen(false)}
          onSelect={handleSelectPlacingType}
          onAddCustom={(w, d, label) => {
            handleSelectPlacingType(`custom-${w}x${d}`, label);
          }}
        />

        {/* Mobile PDF delivery — Web Share API or open-in-tab */}
        <MobilePdfDeliveryModal
          open={pdfModalOpen}
          onClose={() => setPdfModalOpen(false)}
          generatePdf={generatePdfBase64}
          productName={siteAddress ? `Site Layout — ${siteAddress.split(",")[0]}` : "Site Layout"}
        />
      </div>
    );
  }

  // Desktop layout follows below.

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-3">
      {/* First-visit explainer — dismissible, persisted */}
      <PlannerOnboarding />

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
      />

      {/* Drawing/text tools — colour, thickness, dashed, free-text size */}
      <DrawingTools
        tool={tool}
        onToolChange={setTool}
        drawStyle={drawStyle}
        onDrawStyleChange={setDrawStyle}
        textStyle={textStyle}
        onTextStyleChange={setTextStyle}
        onClearDrawings={state.drawings.length > 0 ? state.clearDrawings : undefined}
        selectedDrawing={selectedDrawingForTools}
        onSelectedDrawingChange={handleSelectedDrawingChange}
        onSelectedDrawingDelete={handleSelectedDrawingDelete}
        onDeselectDrawing={handleDeselectDrawing}
        selectedText={selectedTextForTools}
        onSelectedTextChange={handleSelectedTextChange}
        onSelectedTextDelete={handleSelectedTextDelete}
        onDeselectText={handleDeselectText}
      />

      {/* Main content: palette + canvas */}
      <div className="flex gap-3" style={{ height: "calc(100vh - 380px)", minHeight: 500 }}>
        <BuildingPalette />
        <PlannerCanvas
          buildings={state.buildings}
          selectedId={state.selectedId}
          onSelect={state.setSelectedId}
          onMove={handleBuildingMove}
          onLabelEdit={handleLabelEdit}
          onRemoveBuilding={state.removeBuilding}
          onAdd={state.addBuilding}
          onAddCustom={(w, d, x, y, label) => handleAddCustom(w, d, x, y, label)}
          stageRef={stageRef}
          mapData={mapData}
          mapOpacity={mapOpacity}
          mapRotation={mapRotation}
          onMapMove={handleMapMove}
          onMapRotation={setMapRotation}
          sunDirection={sunEnabled ? mapRotation : null}
          drawings={state.drawings}
          texts={state.texts}
          onAddDrawing={state.addDrawing}
          onRemoveDrawing={state.removeDrawing}
          onUpdateDrawing={state.updateDrawing}
          onAddText={state.addText}
          onMoveText={state.moveText}
          onUpdateText={state.updateText}
          onRemoveText={state.removeText}
          onSelectionChange={handleSelectionChange}
          tool={tool}
          onToolChange={setTool}
          drawStyle={drawStyle}
          textStyle={textStyle}
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
