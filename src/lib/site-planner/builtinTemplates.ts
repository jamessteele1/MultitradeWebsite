/**
 * Site planner templates that ship with the app.
 *
 * These are visible to every user in the Templates tab (BuildingSelectionPopup)
 * — unlike the user's own templates which live in localStorage only on
 * their browser.
 *
 * Workflow for adding a new built-in template:
 *   1. Design the layout in your local planner.
 *   2. Layouts → Export — copies a TS object to your clipboard.
 *   3. Paste the object into the BUILTIN_TEMPLATES array below.
 *   4. Commit + deploy. Everyone using the site sees the new template.
 *
 * The export step strips runtime IDs (instanceId, parentId, drawing.id,
 * text.id) so the source stays clean. The planner re-IDs everything when
 * a template is applied.
 */

import type { Drawing, PlacedBuilding, TextItem } from "./usePlannerState";

export type BuiltinTemplate = {
  /** Stable id, prefix "builtin-" by convention. Used for React keys. */
  id: string;
  name: string;
  /** Optional one-line description shown beneath the name in the picker. */
  description?: string;
  /** Optional preview thumbnail (PNG / JPEG dataURL, ideally under ~50KB).
      If omitted, the popup falls back to a generic icon. */
  thumbnail?: string;
  /** Saveable layout content. Items don't need IDs — the planner re-IDs
      them on apply. PlacedBuilding's `instanceId` and `parentId` are
      generated fresh; Drawing.id and TextItem.id likewise. */
  buildings: Array<Omit<PlacedBuilding, "instanceId" | "parentId">>;
  drawings: Array<Omit<Drawing, "id">>;
  texts: Array<Omit<TextItem, "id">>;
};

export const BUILTIN_TEMPLATES: BuiltinTemplate[] = [
  // ─── Basic Site Layout ────────────────────────────────────────────
  // Small-camp starter: stacked 12×3 office / crib / deck row, a 6×3
  // toilet, stair landing, fuel pod + generator + water tank ancillary
  // strip, and power / water connection points. A yellow work-area
  // boundary surrounds the cluster, plus two dimension lines for
  // reference. Designed by James in the local planner — exported via
  // Layouts → Export.
  // (Off-canvas accidental scribbles + a stray "sdf" text + duplicate
  // "Basic Site Layout" label were stripped on import.)
  {
    id: "builtin-basic-site-layout",
    name: "Basic Site Layout",
    description: "Office / crib / deck row with toilet, stairs, fuel + generator + water tank, and power/water connections. Includes a work-area boundary and two dimension lines.",
    buildings: [
      { typeId: "12x3-office",   x: 19, y: 39, rotation: 0,  label: "12×3 Office" },
      { typeId: "12x3-crib",     x: 19, y: 33, rotation: 0,  label: "12×3 Crib" },
      { typeId: "12x3-deck",     x: 19, y: 36, rotation: 0,  label: "12×3 Deck" },
      { typeId: "water-point",   x: 43, y: 40, rotation: 0,  label: "💧 Water" },
      { typeId: "power-point",   x: 43, y: 35, rotation: 0,  label: "⚡ Power" },
      { typeId: "6x3-toilet",    x: 34, y: 36, rotation: 90, label: "6×3 Toilet" },
      { typeId: "stair-landing", x: 34, y: 37, rotation: 90, label: "Stairs" },
      { typeId: "fuel-pod",      x: 40, y: 35, rotation: 0,  label: "Fuel Pod" },
      { typeId: "generator",     x: 40, y: 37, rotation: 0,  label: "Generator" },
      { typeId: "water-tank",    x: 40, y: 39, rotation: 0,  label: "Water Tank" },
    ],
    drawings: [
      // Horizontal dimension across the row
      {
        points: [765, 1276, 1238, 1279],
        color: "#EF4444",
        thickness: 3,
        dashed: true,
        closed: false,
        opacity: 1,
        dimension: true,
      },
      // Vertical dimension down the side
      {
        points: [722, 1319, 722, 1679],
        color: "#EF4444",
        thickness: 3,
        dashed: true,
        closed: false,
        opacity: 1,
        dimension: true,
      },
      // Yellow work-area boundary surrounding the cluster
      {
        points: [653, 1204, 651, 1706, 1185, 1704, 1801, 1708, 1799, 1216],
        color: "#FBBF24",
        thickness: 3,
        dashed: false,
        closed: true,
        opacity: 0.3,
      },
    ],
    texts: [],
  },
];
