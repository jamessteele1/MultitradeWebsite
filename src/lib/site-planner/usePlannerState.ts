"use client";

import { useState, useCallback, useEffect } from "react";
import { GRID_SIZE_M } from "./constants";

export type PlacedBuilding = {
  instanceId: string;
  typeId: string;
  x: number; // metres
  y: number; // metres
  rotation: 0 | 90;
  label: string;
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
    (instanceId: string, x: number, y: number) => {
      setBuildings((prev) =>
        prev.map((b) =>
          b.instanceId === instanceId ? { ...b, x: snap(x), y: snap(y) } : b,
        ),
      );
    },
    [],
  );

  const rotateBuilding = useCallback(
    (instanceId: string) => {
      setBuildings((prev) => {
        pushUndo(prev);
        return prev.map((b) =>
          b.instanceId === instanceId
            ? { ...b, rotation: b.rotation === 0 ? 90 : 0 }
            : b,
        );
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
        return prev.filter((b) => b.instanceId !== instanceId);
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
    labelBuilding,
    removeBuilding,
    clearAll,
    undo,
    canUndo: undoStack.length > 0,
  };
}
