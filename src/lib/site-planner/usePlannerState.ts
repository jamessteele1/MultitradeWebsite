"use client";

import { useState, useCallback, useEffect } from "react";
import { GRID_SIZE_M } from "./constants";
import { getBuildingType } from "./buildings";
import { rotateChildAroundParent } from "./snapUtils";

export type PlacedBuilding = {
  instanceId: string;
  typeId: string;
  x: number; // metres
  y: number; // metres
  rotation: number;
  label: string;
  parentId?: string; // attached to this building (deck snapping)
};

/**
 * Freehand stroke or polygon drawn on the canvas.
 * Coordinates are in canvas pixels (same space as building rectangles after
 * multiplying by PIXELS_PER_METRE).
 */
export type Drawing = {
  id: string;
  points: number[]; // [x1,y1,x2,y2,...]
  color: string;
  thickness: number;
  dashed: boolean;
  /** True for closed polygons (e.g. work-area outlines). */
  closed: boolean;
};

/**
 * Free-positioned text annotation. The legacy `Note` data lives here too —
 * old notes get default styling so they keep rendering.
 */
export type TextItem = {
  id: string;
  /** Canvas pixel coordinates */
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
};

const STORAGE_KEY = "multitrade-site-planner";
const STORAGE_KEY_DRAWINGS = "multitrade-site-planner-drawings";
const STORAGE_KEY_TEXTS = "multitrade-site-planner-texts";

let idCounter = 0;
function nextId(prefix = "bld") {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

function snap(v: number): number {
  return Math.round(v / GRID_SIZE_M) * GRID_SIZE_M;
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function usePlannerState() {
  const [buildings, setBuildings] = useState<PlacedBuilding[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [undoStack, setUndoStack] = useState<{
    buildings: PlacedBuilding[];
    drawings: Drawing[];
    texts: TextItem[];
  }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load all persisted state on mount
  useEffect(() => {
    setBuildings(loadJSON<PlacedBuilding[]>(STORAGE_KEY, []));
    setDrawings(loadJSON<Drawing[]>(STORAGE_KEY_DRAWINGS, []));
    setTexts(loadJSON<TextItem[]>(STORAGE_KEY_TEXTS, []));
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEY, buildings);
  }, [buildings, loaded]);
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEY_DRAWINGS, drawings);
  }, [drawings, loaded]);
  useEffect(() => {
    if (loaded) saveJSON(STORAGE_KEY_TEXTS, texts);
  }, [texts, loaded]);

  const pushUndo = useCallback(
    (prevB: PlacedBuilding[], prevD: Drawing[], prevT: TextItem[]) => {
      setUndoStack((s) => [...s.slice(-19), { buildings: prevB, drawings: prevD, texts: prevT }]);
    },
    [],
  );

  /* ─── Buildings ─── */

  const addBuilding = useCallback(
    (typeId: string, x: number, y: number, label: string) => {
      setBuildings((prev) => {
        pushUndo(prev, drawings, texts);
        return [
          ...prev,
          { instanceId: nextId("bld"), typeId, x: snap(x), y: snap(y), rotation: 0, label },
        ];
      });
    },
    [pushUndo, drawings, texts],
  );

  const moveBuilding = useCallback(
    (instanceId: string, x: number, y: number, newParentId?: string | null) => {
      setBuildings((prev) => {
        const building = prev.find((b) => b.instanceId === instanceId);
        if (!building) return prev;

        const newX = snap(x);
        const newY = snap(y);
        const dx = newX - building.x;
        const dy = newY - building.y;

        return prev.map((b) => {
          if (b.instanceId === instanceId) {
            const updated: PlacedBuilding = { ...b, x: newX, y: newY };
            if (newParentId !== undefined) {
              updated.parentId = newParentId === null ? undefined : newParentId;
            }
            return updated;
          }
          // Move attached children along with parent
          if (b.parentId === instanceId && (dx !== 0 || dy !== 0)) {
            return { ...b, x: snap(b.x + dx), y: snap(b.y + dy) };
          }
          return b;
        });
      });
    },
    [],
  );

  const rotateBuilding = useCallback(
    (instanceId: string) => {
      setBuildings((prev) => {
        pushUndo(prev, drawings, texts);
        const parent = prev.find((b) => b.instanceId === instanceId);
        if (!parent) return prev;
        const parentType = getBuildingType(parent.typeId);
        const pcx = parent.x + (parentType?.widthM ?? 0) / 2;
        const pcy = parent.y + (parentType?.depthM ?? 0) / 2;

        return prev.map((b) => {
          if (b.instanceId === instanceId) {
            return { ...b, rotation: (Math.round(b.rotation / 90) * 90 + 90) % 360 };
          }
          if (b.parentId === instanceId) {
            const childType = getBuildingType(b.typeId);
            if (!childType) return b;
            const result = rotateChildAroundParent(b, childType, { cx: pcx, cy: pcy }, 90);
            return { ...b, x: result.x, y: result.y, rotation: result.rotation };
          }
          return b;
        });
      });
    },
    [pushUndo, drawings, texts],
  );

  const rotateBuildingTo = useCallback(
    (instanceId: string, degrees: number) => {
      setBuildings((prev) => {
        pushUndo(prev, drawings, texts);
        const parent = prev.find((b) => b.instanceId === instanceId);
        if (!parent) return prev;
        const parentType = getBuildingType(parent.typeId);
        const pcx = parent.x + (parentType?.widthM ?? 0) / 2;
        const pcy = parent.y + (parentType?.depthM ?? 0) / 2;
        const newRot = ((degrees % 360) + 360) % 360;
        const delta = newRot - parent.rotation;

        return prev.map((b) => {
          if (b.instanceId === instanceId) {
            return { ...b, rotation: newRot };
          }
          if (b.parentId === instanceId && delta !== 0) {
            const childType = getBuildingType(b.typeId);
            if (!childType) return b;
            const result = rotateChildAroundParent(b, childType, { cx: pcx, cy: pcy }, delta);
            return { ...b, x: result.x, y: result.y, rotation: result.rotation };
          }
          return b;
        });
      });
    },
    [pushUndo, drawings, texts],
  );

  const labelBuilding = useCallback((instanceId: string, label: string) => {
    setBuildings((prev) => prev.map((b) => (b.instanceId === instanceId ? { ...b, label } : b)));
  }, []);

  const removeBuilding = useCallback(
    (instanceId: string) => {
      setBuildings((prev) => {
        pushUndo(prev, drawings, texts);
        return prev
          .filter((b) => b.instanceId !== instanceId)
          .map((b) => (b.parentId === instanceId ? { ...b, parentId: undefined } : b));
      });
      setSelectedId((s) => (s === instanceId ? null : s));
    },
    [pushUndo, drawings, texts],
  );

  /* ─── Drawings ─── */

  const addDrawing = useCallback(
    (drawing: Omit<Drawing, "id">) => {
      setDrawings((prev) => {
        pushUndo(buildings, prev, texts);
        return [...prev, { id: nextId("drw"), ...drawing }];
      });
    },
    [pushUndo, buildings, texts],
  );

  const removeDrawing = useCallback(
    (id: string) => {
      setDrawings((prev) => {
        pushUndo(buildings, prev, texts);
        return prev.filter((d) => d.id !== id);
      });
    },
    [pushUndo, buildings, texts],
  );

  const clearDrawings = useCallback(() => {
    setDrawings((prev) => {
      pushUndo(buildings, prev, texts);
      return [];
    });
  }, [pushUndo, buildings, texts]);

  /* ─── Text annotations ─── */

  const addText = useCallback(
    (item: Omit<TextItem, "id">) => {
      setTexts((prev) => {
        pushUndo(buildings, drawings, prev);
        return [...prev, { id: nextId("txt"), ...item }];
      });
    },
    [pushUndo, buildings, drawings],
  );

  const updateText = useCallback((id: string, patch: Partial<Omit<TextItem, "id">>) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const moveText = useCallback((id: string, x: number, y: number) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  }, []);

  const removeText = useCallback(
    (id: string) => {
      setTexts((prev) => {
        pushUndo(buildings, drawings, prev);
        return prev.filter((t) => t.id !== id);
      });
    },
    [pushUndo, buildings, drawings],
  );

  /* ─── Bulk ─── */

  const clearAll = useCallback(() => {
    pushUndo(buildings, drawings, texts);
    setBuildings([]);
    setDrawings([]);
    setTexts([]);
    setSelectedId(null);
  }, [pushUndo, buildings, drawings, texts]);

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      const prev = stack[stack.length - 1];
      setBuildings(prev.buildings);
      setDrawings(prev.drawings);
      setTexts(prev.texts);
      return stack.slice(0, -1);
    });
  }, []);

  return {
    buildings,
    drawings,
    texts,
    selectedId,
    setSelectedId,
    addBuilding,
    moveBuilding,
    rotateBuilding,
    rotateBuildingTo,
    labelBuilding,
    removeBuilding,
    addDrawing,
    removeDrawing,
    clearDrawings,
    addText,
    updateText,
    moveText,
    removeText,
    clearAll,
    undo,
    canUndo: undoStack.length > 0,
  };
}
