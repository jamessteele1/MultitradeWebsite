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

const STORAGE_KEY = "multitrade-site-planner";

let idCounter = 0;
function nextId() {
  return `bld-${Date.now()}-${++idCounter}`;
}

function snap(v: number): number {
  return Math.round(v / GRID_SIZE_M) * GRID_SIZE_M;
}

function loadFromStorage(): PlacedBuilding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(buildings: PlacedBuilding[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildings));
  } catch {
    // ignore quota errors
  }
}

export function usePlannerState() {
  const [buildings, setBuildings] = useState<PlacedBuilding[]>([]);
  const [undoStack, setUndoStack] = useState<PlacedBuilding[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved.length > 0) setBuildings(saved);
    setLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (loaded) saveToStorage(buildings);
  }, [buildings, loaded]);

  const pushUndo = useCallback((prev: PlacedBuilding[]) => {
    setUndoStack((s) => [...s.slice(-19), prev]); // keep last 20
  }, []);

  const addBuilding = useCallback(
    (typeId: string, x: number, y: number, label: string) => {
      setBuildings((prev) => {
        pushUndo(prev);
        return [
          ...prev,
          { instanceId: nextId(), typeId, x: snap(x), y: snap(y), rotation: 0, label },
        ];
      });
    },
    [pushUndo],
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
        pushUndo(prev);
        const parent = prev.find((b) => b.instanceId === instanceId);
        if (!parent) return prev;
        const parentType = getBuildingType(parent.typeId);
        const pcx = parent.x + (parentType?.widthM ?? 0) / 2;
        const pcy = parent.y + (parentType?.depthM ?? 0) / 2;

        return prev.map((b) => {
          if (b.instanceId === instanceId) {
            return { ...b, rotation: (Math.round(b.rotation / 90) * 90 + 90) % 360 };
          }
          // Rotate attached children around parent center
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
    [pushUndo],
  );

  const rotateBuildingTo = useCallback(
    (instanceId: string, degrees: number) => {
      setBuildings((prev) => {
        pushUndo(prev);
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
    [pushUndo],
  );

  const labelBuilding = useCallback(
    (instanceId: string, label: string) => {
      setBuildings((prev) =>
        prev.map((b) => (b.instanceId === instanceId ? { ...b, label } : b)),
      );
    },
    [],
  );

  const removeBuilding = useCallback(
    (instanceId: string) => {
      setBuildings((prev) => {
        pushUndo(prev);
        return prev
          .filter((b) => b.instanceId !== instanceId)
          .map((b) => (b.parentId === instanceId ? { ...b, parentId: undefined } : b));
      });
      setSelectedId((s) => (s === instanceId ? null : s));
    },
    [pushUndo],
  );

  const clearAll = useCallback(() => {
    setBuildings((prev) => {
      pushUndo(prev);
      return [];
    });
    setSelectedId(null);
  }, [pushUndo]);

  const undo = useCallback(() => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      const prev = stack[stack.length - 1];
      setBuildings(prev);
      return stack.slice(0, -1);
    });
  }, []);

  return {
    buildings,
    selectedId,
    setSelectedId,
    addBuilding,
    moveBuilding,
    rotateBuilding,
    rotateBuildingTo,
    labelBuilding,
    removeBuilding,
    clearAll,
    undo,
    canUndo: undoStack.length > 0,
  };
}
