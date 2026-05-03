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
  // Add templates here. Get started by designing a layout in the local
  // planner, then click Layouts → Export to copy a ready-to-paste snippet.
];
