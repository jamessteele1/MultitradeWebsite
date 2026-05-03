/**
 * Named-layout storage for the site planner.
 *
 * The planner already auto-persists "the current scratch layout" to
 * localStorage on every change (under multitrade-site-planner /
 * -drawings / -texts). This module adds NAMED layouts on top — the
 * user can save the current canvas under a name, browse saved
 * layouts, load any back into the planner, or flag one as a Template
 * so it appears in the Add Building popup as a starter pack.
 *
 * Storage shape: a single localStorage key holds a JSON array of
 * SavedLayout records. Reads / writes are isolated to this module so
 * UI components don't have to know about JSON or quota errors.
 */

import type { Drawing, PlacedBuilding, TextItem } from "./usePlannerState";
import { BUILTIN_TEMPLATES } from "./builtinTemplates";

const STORAGE_KEY = "multitrade-planner-saved-layouts";

export type SavedLayout = {
  id: string;
  name: string;
  /** ISO timestamp set on save / re-save */
  savedAt: string;
  /** When true, surfaces in the Templates tab of the Add-building popup. */
  isTemplate?: boolean;
  /** Optional small PNG dataURL preview (~ 200 × 120, low quality) so the
      load list shows a visual instead of just a name. */
  thumbnail?: string;
  buildings: PlacedBuilding[];
  drawings: Drawing[];
  texts: TextItem[];
  /** Map rotation at the time of save — restored on load. The satellite
      image itself is not saved (too big and tied to specific coords). */
  mapRotation?: number;
  /** Optional address copied from the planner state at save time, just
      so the load list can show a location hint. Not used to refetch. */
  siteAddress?: string;
};

function readAll(): SavedLayout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(layouts: SavedLayout[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  } catch {
    // Quota exceeded or storage disabled — bail silently. The user will
    // see the layout disappear on next reload but the in-memory state
    // they were working on is unaffected.
  }
}

let idCounter = 0;
function nextId(): string {
  return `layout-${Date.now().toString(36)}-${(++idCounter).toString(36)}`;
}

/** All saved layouts, most-recently-saved first. */
export function getSavedLayouts(): SavedLayout[] {
  return [...readAll()].sort((a, b) => (b.savedAt > a.savedAt ? 1 : -1));
}

/** Just the ones flagged as templates (user-saved only). */
export function getTemplates(): SavedLayout[] {
  return getSavedLayouts().filter((l) => l.isTemplate);
}

/**
 * All templates available to the user — built-in (shipped with the app,
 * visible to everyone) followed by their own saved templates. Built-in
 * entries get isBuiltin: true so the UI can badge them and prevent
 * deletion.
 */
export function getAllTemplates(): Array<SavedLayout & { isBuiltin?: boolean }> {
  const builtins: Array<SavedLayout & { isBuiltin?: boolean }> = BUILTIN_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    savedAt: "0000-00-00T00:00:00Z",
    isTemplate: true,
    isBuiltin: true,
    thumbnail: t.thumbnail,
    // Templates ship without runtime IDs — fill in placeholders. The
    // replaceState action re-IDs everything anyway when applying.
    buildings: t.buildings.map((b) => ({ ...b, instanceId: "" })),
    drawings: t.drawings.map((d) => ({ ...d, id: "" })),
    texts: t.texts.map((tx) => ({ ...tx, id: "" })),
  }));
  return [...builtins, ...getTemplates()];
}

/**
 * Save the given layout. If `id` is provided AND already exists, update
 * the record in place (so the user can re-save under the same name).
 * Otherwise inserts a new record with a fresh id.
 */
export function saveLayout(input: {
  id?: string;
  name: string;
  isTemplate?: boolean;
  thumbnail?: string;
  buildings: PlacedBuilding[];
  drawings: Drawing[];
  texts: TextItem[];
  mapRotation?: number;
  siteAddress?: string;
}): SavedLayout {
  const all = readAll();
  const now = new Date().toISOString();
  const idx = input.id ? all.findIndex((l) => l.id === input.id) : -1;
  const next: SavedLayout = {
    id: idx >= 0 ? all[idx].id : input.id ?? nextId(),
    name: input.name.trim() || "Untitled layout",
    savedAt: now,
    isTemplate: input.isTemplate || false,
    thumbnail: input.thumbnail,
    buildings: input.buildings,
    drawings: input.drawings,
    texts: input.texts,
    mapRotation: input.mapRotation,
    siteAddress: input.siteAddress,
  };
  if (idx >= 0) {
    all[idx] = next;
  } else {
    all.push(next);
  }
  writeAll(all);
  return next;
}

export function deleteLayout(id: string): void {
  const all = readAll();
  const filtered = all.filter((l) => l.id !== id);
  if (filtered.length !== all.length) writeAll(filtered);
}

export function getLayout(id: string): SavedLayout | null {
  return readAll().find((l) => l.id === id) ?? null;
}
