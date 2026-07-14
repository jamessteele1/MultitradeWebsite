export type BuildingType = {
  id: string;
  name: string;
  shortLabel: string;
  widthM: number;
  depthM: number;
  color: string;
  stroke: string;
  category: "offices" | "crib-rooms" | "ablutions" | "containers" | "ancillary" | "decks" | "complexes" | "utilities" | "misc";
  cartId?: string;
  icon?: string; // emoji/symbol for utility markers
  /** Optional fill colour for plain-text icons (e.g. "●" for grey water).
      Emoji icons keep their native colours and ignore this. */
  iconColor?: string;
  /** Render shape on the canvas.
       - "rect" (default) — standard rectangular building
       - "circle"         — cylindrical things (e.g. tanks)
       - "container-shelter" — composite of two end containers with a
                               fabric/dome shelter spanning between them */
  shape?: "rect" | "circle" | "container-shelter";
  /** For "container-shelter": length of EACH end container in metres
      (typically 6 for 20ft, 12 for 40ft). The total footprint depth
      becomes 2.4 + shelterDepthM + 2.4. */
  containerLengthM?: number;
  /** For "container-shelter": depth of the shelter span between the
      two end containers, in metres. */
  shelterDepthM?: number;
};

/**
 * Darken a 6-char hex colour by a multiplicative factor (no #).
 * Used to derive a sensible stroke colour from a user-picked fill.
 */
function darkenHex(hex: string, factor: number): string {
  const r = Math.round(parseInt(hex.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(hex.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(hex.slice(4, 6), 16) * factor);
  const clamp = (n: number) => Math.max(0, Math.min(255, n));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`.toUpperCase();
}

export const BUILDING_TYPES: BuildingType[] = [
  // Offices
  { id: "3x3-office",   name: "3x3m Office",          shortLabel: "3×3 Office",     widthM: 3,    depthM: 3,   color: "#DBEAFE", stroke: "#3B82F6", category: "offices",    cartId: "3x3m-office" },
  { id: "6x3-office",   name: "6x3m Office",          shortLabel: "6×3 Office",     widthM: 6,    depthM: 3,   color: "#BFDBFE", stroke: "#2563EB", category: "offices",    cartId: "6x3m-office" },
  { id: "12x3-office",  name: "12x3m Office",         shortLabel: "12×3 Office",    widthM: 12,   depthM: 3,   color: "#93C5FD", stroke: "#1D4ED8", category: "offices",    cartId: "12x3m-office" },
  // Solar Facility — combined office/crib unit, lives in both tabs.
  { id: "solar-facility-office", name: "12×3.4m Solar Facility", shortLabel: "Solar Facility", widthM: 12, depthM: 3.4, color: "#FEF3C7", stroke: "#B45309", category: "offices",    cartId: "solar-facility" },

  // Crib Rooms
  { id: "3x3-crib",     name: "3x3m Crib Room",       shortLabel: "3×3 Crib",       widthM: 3,    depthM: 3,   color: "#D1FAE5", stroke: "#22C55E", category: "crib-rooms", cartId: "3x3m-crib-room" },
  { id: "6x3-crib",     name: "6x3m Crib Room",       shortLabel: "6×3 Crib",       widthM: 6,    depthM: 3,   color: "#D1FAE5", stroke: "#22C55E", category: "crib-rooms", cartId: "6x3m-crib-room" },
  { id: "12x3-crib",    name: "12x3m Crib Room",      shortLabel: "12×3 Crib",      widthM: 12,   depthM: 3,   color: "#A7F3D0", stroke: "#16A34A", category: "crib-rooms", cartId: "12x3m-crib-room" },
  { id: "7.2x3-self-contained-crib", name: "7.2×3m Self-Contained Crib", shortLabel: "7.2×3 SC Crib", widthM: 7.2, depthM: 3, color: "#86EFAC", stroke: "#15803D", category: "crib-rooms", cartId: "7-2x3-self-contained-crib" },
  // Same Solar Facility, exposed under crib-rooms too.
  { id: "solar-facility-crib", name: "12×3.4m Solar Facility",         shortLabel: "Solar Facility", widthM: 12, depthM: 3.4, color: "#FEF3C7", stroke: "#B45309", category: "crib-rooms", cartId: "solar-facility" },

  // Ablutions
  { id: "1x1-chem-toilet", name: "1×1m Chemical Toilet", shortLabel: "Chem Toilet",  widthM: 1,    depthM: 1,   color: "#EDE9FE", stroke: "#7C3AED", category: "ablutions",  cartId: "1x1m-chem-toilet" },
  { id: "3x3-pwd-toilet",  name: "3×3m PWD Toilet",      shortLabel: "3×3 PWD",        widthM: 3,    depthM: 3,   color: "#DDD6FE", stroke: "#6D28D9", category: "ablutions",  cartId: "3x3m-pwd-toilet" },
  { id: "3.6x2.4-toilet", name: "3.6x2.4m Toilet",    shortLabel: "3.6×2.4 Toilet", widthM: 3.6,  depthM: 2.4, color: "#EDE9FE", stroke: "#8B5CF6", category: "ablutions",  cartId: "3-6x2-4m-toilet" },
  { id: "6x3-toilet",     name: "6x3m Toilet Block",   shortLabel: "6×3 Toilet",     widthM: 6,    depthM: 3,   color: "#DDD6FE", stroke: "#7C3AED", category: "ablutions",  cartId: "6x3m-toilet-block" },
  { id: "6x3-shower",     name: "6x3m Shower Block",   shortLabel: "6×3 Shower",     widthM: 6,    depthM: 3,   color: "#E0E7FF", stroke: "#4F46E5", category: "ablutions",  cartId: "6x3m-shower-block" },
  // 12×3 male+female combo with a 3×3 PWD section integrated. Treated
  // as a single 12×3 building; the PWD partition is implicit.
  { id: "12x3-mf-pwd-toilet", name: "12×3m M/F + PWD Toilet", shortLabel: "12×3 M/F+PWD", widthM: 12, depthM: 3, color: "#C4B5FD", stroke: "#6D28D9", category: "ablutions",  cartId: "12x3m-mf-pwd-toilet" },
  { id: "solar-toilet",   name: "Solar Toilet",         shortLabel: "Solar Toilet",   widthM: 5.45, depthM: 2.4, color: "#C4B5FD", stroke: "#6D28D9", category: "ablutions",  cartId: "solar-toilet" },

  // Covered Decks
  { id: "12x3-deck",    name: "12x3m Covered Deck",   shortLabel: "12×3 Deck",      widthM: 12,   depthM: 3,   color: "#D2B48C", stroke: "#8B4513", category: "decks",     cartId: "12x3m-deck" },
  { id: "13.2x3-deck",  name: "13.2×3m Covered Deck", shortLabel: "13.2×3 Deck",    widthM: 13.2, depthM: 3,   color: "#D2B48C", stroke: "#8B4513", category: "decks",     cartId: "13-2x3m-deck" },
  { id: "6x3-deck",     name: "6x3m Covered Deck",    shortLabel: "6×3 Deck",       widthM: 6,    depthM: 3,   color: "#DEB887", stroke: "#A0522D", category: "decks",     cartId: "6x3m-deck" },

  // Complexes
  { id: "12x6-complex",  name: "12x6m Complex",        shortLabel: "12×6 Complex",   widthM: 12,   depthM: 6,   color: "#FDE68A", stroke: "#B45309", category: "complexes", cartId: "12x6m-complex" },
  { id: "12x9-complex",  name: "12x9m Complex",        shortLabel: "12×9 Complex",   widthM: 12,   depthM: 9,   color: "#FCD34D", stroke: "#A16207", category: "complexes", cartId: "12x9m-complex" },
  { id: "12x12-complex", name: "12x12m Complex",       shortLabel: "12×12 Complex",  widthM: 12,   depthM: 12,  color: "#FBBF24", stroke: "#92400E", category: "complexes", cartId: "12x12m-complex" },

  // Containers
  { id: "10ft-container", name: "10ft Container",       shortLabel: "10ft Container", widthM: 3,    depthM: 2.4, color: "#F3F4F6", stroke: "#6B7280", category: "containers", cartId: "10ft-container" },
  { id: "20ft-container", name: "20ft Container",       shortLabel: "20ft Container", widthM: 6,    depthM: 2.4, color: "#E5E7EB", stroke: "#6B7280", category: "containers", cartId: "20ft-container" },
  { id: "40ft-container", name: "40ft Container",       shortLabel: "40ft Container", widthM: 12,   depthM: 2.4, color: "#D1D5DB", stroke: "#4B5563", category: "containers", cartId: "40ft-container" },

  // Container-Dome Shelters — two end containers with a fabric dome
  // spanning between them. Total depth = 2.4 + shelter + 2.4.
  // 20ft pair (6m long containers):
  { id: "20-dome-6x6",  name: "20ft + 6×6m Dome Shelter",  shortLabel: "20ft + 6×6 Shelter",  widthM: 6,  depthM: 10.8, color: "#FAFAF9", stroke: "#57534E", category: "containers", cartId: "20-dome-6x6",  shape: "container-shelter", containerLengthM: 6,  shelterDepthM: 6 },
  { id: "20-dome-6x9",  name: "20ft + 6×9m Dome Shelter",  shortLabel: "20ft + 6×9 Shelter",  widthM: 6,  depthM: 13.8, color: "#FAFAF9", stroke: "#57534E", category: "containers", cartId: "20-dome-6x9",  shape: "container-shelter", containerLengthM: 6,  shelterDepthM: 9 },
  // 40ft pair (12m long containers):
  { id: "40-dome-12x12", name: "40ft + 12×12m Dome Shelter", shortLabel: "40ft + 12×12 Shelter", widthM: 12, depthM: 16.8, color: "#FAFAF9", stroke: "#57534E", category: "containers", cartId: "40-dome-12x12", shape: "container-shelter", containerLengthM: 12, shelterDepthM: 12 },
  { id: "40-dome-12x18", name: "40ft + 12×18m Dome Shelter", shortLabel: "40ft + 12×18 Shelter", widthM: 12, depthM: 22.8, color: "#FAFAF9", stroke: "#57534E", category: "containers", cartId: "40-dome-12x18", shape: "container-shelter", containerLengthM: 12, shelterDepthM: 18 },

  // Ancillary
  { id: "water-tank",      name: "5000L Water Tank & Pump", shortLabel: "Water Tank",   widthM: 2,    depthM: 2,   color: "#FEF3C7", stroke: "#F59E0B", category: "ancillary",  cartId: "5000l-tank-pump", shape: "circle" },
  { id: "grey-water-tank", name: "5000L Grey Water Tank",   shortLabel: "Grey Water Tank", widthM: 2, depthM: 2,   color: "#CBD5E1", stroke: "#475569", category: "ancillary",  cartId: "5000l-grey-water-tank", shape: "circle" },
  { id: "wash-trough",     name: "Free-Standing Wash Trough", shortLabel: "Wash Trough", widthM: 2, depthM: 0.5, color: "#CFFAFE", stroke: "#0891B2", category: "ancillary",  cartId: "wash-trough" },
  { id: "dual-hand-wash",  name: "Dual Hand Wash Station",  shortLabel: "Hand Wash",    widthM: 0.5,  depthM: 0.5, color: "#A5F3FC", stroke: "#0E7490", category: "ancillary",  cartId: "dual-hand-wash" },
  { id: "stair-landing",   name: "Stair & Landing",         shortLabel: "Stairs",       widthM: 2,    depthM: 1.5, color: "#FED7AA", stroke: "#EA580C", category: "ancillary",  cartId: "stair-landing" },
  { id: "generator",       name: "Generator",                shortLabel: "Generator",    widthM: 3,    depthM: 1.2, color: "#FEF3C7", stroke: "#92400E", category: "ancillary",  cartId: "generator" },
  { id: "fuel-pod",        name: "Fuel Pod",                 shortLabel: "Fuel Pod",     widthM: 1.5,  depthM: 1.5, color: "#FECACA", stroke: "#B91C1C", category: "ancillary",  cartId: "fuel-pod" },

  // Miscellaneous — purpose-built rooms that don't fit the other
  // categories (cold storage, first aid, etc.)
  { id: "6x3-ice-room",    name: "6×3m Ice Room",           shortLabel: "6×3 Ice Room", widthM: 6,    depthM: 3,   color: "#CFFAFE", stroke: "#0E7490", category: "misc",       cartId: "6x3m-ice-room" },
  { id: "6x3-first-aid",   name: "6×3m First Aid Room",     shortLabel: "6×3 First Aid", widthM: 6,   depthM: 3,   color: "#FEE2E2", stroke: "#B91C1C", category: "misc",       cartId: "6x3m-first-aid-room" },

  // Utilities (icon markers) — render as a saturated coloured ring
  // around a white inner plate so the emoji icon always has high
  // contrast regardless of the satellite background.
  { id: "power-point",   name: "Power Connection",      shortLabel: "⚡ Power",       widthM: 1,    depthM: 1,   color: "#FEE2E2", stroke: "#EF4444", category: "utilities",  icon: "⚡" },
  { id: "water-point",   name: "Water Connection",      shortLabel: "💧 Water",       widthM: 1,    depthM: 1,   color: "#DBEAFE", stroke: "#3B82F6", category: "utilities",  icon: "💧" },
  // Sewage — toilet emoji on a brown ring
  { id: "sewer-point",   name: "Sewage Connection",     shortLabel: "🚽 Sewage",      widthM: 1,    depthM: 1,   color: "#FEF3C7", stroke: "#92400E", category: "utilities",  icon: "🚽" },
  // Grey water — plain "●" glyph rendered in grey on the white plate
  { id: "grey-water",    name: "Grey Water Connection", shortLabel: "● Grey Water",   widthM: 1,    depthM: 1,   color: "#F3F4F6", stroke: "#6B7280", category: "utilities",  icon: "●", iconColor: "#6B7280" },
  // Data / networking — globe emoji on a teal ring
  { id: "data-point",    name: "Data Connection",       shortLabel: "🌐 Data",        widthM: 1,    depthM: 1,   color: "#CFFAFE", stroke: "#0891B2", category: "utilities",  icon: "🌐" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  offices: "Site Offices",
  "crib-rooms": "Crib Rooms",
  ablutions: "Ablutions & Toilets",
  decks: "Covered Decks",
  complexes: "Complexes",
  containers: "Containers",
  ancillary: "Ancillary Equipment",
  utilities: "Utility Points",
  misc: "Miscellaneous",
};

export function getBuildingType(id: string): BuildingType | undefined {
  // Custom covered deck — clamped to 15m long × 3.4m wide
  const customDeckMatch = id.match(/^custom-deck-(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
  if (customDeckMatch) {
    const w = Math.min(15, Math.max(0.5, parseFloat(customDeckMatch[1])));
    const d = Math.min(3.4, Math.max(0.5, parseFloat(customDeckMatch[2])));
    return {
      id,
      name: `${w}×${d}m Covered Deck`,
      shortLabel: `${w}×${d}m Deck`,
      widthM: w,
      depthM: d,
      color: "#D2B48C",
      stroke: "#8B4513",
      category: "decks",
    };
  }
  // Custom complex — clamped to 24m × 18m (multi-module joined complexes)
  const customComplexMatch = id.match(/^custom-complex-(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
  if (customComplexMatch) {
    const w = Math.min(24, Math.max(3, parseFloat(customComplexMatch[1])));
    const d = Math.min(18, Math.max(3, parseFloat(customComplexMatch[2])));
    return {
      id,
      name: `${w}×${d}m Complex`,
      shortLabel: `${w}×${d}m Complex`,
      widthM: w,
      depthM: d,
      color: "#FCD34D",
      stroke: "#A16207",
      category: "complexes",
    };
  }
  // Generic custom building IDs.
  //   custom-WxD              → default grey
  //   custom-WxD-c{HEX}       → user-picked fill (stroke darkened from fill)
  const customMatch = id.match(/^custom-(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(?:-c([\da-fA-F]{6}))?$/);
  if (customMatch) {
    const w = parseFloat(customMatch[1]);
    const d = parseFloat(customMatch[2]);
    const hex = customMatch[3]?.toUpperCase();
    return {
      id,
      name: `${w}×${d}m Custom`,
      shortLabel: `${w}×${d}m`,
      widthM: w,
      depthM: d,
      color: hex ? `#${hex}` : "#E5E7EB",
      stroke: hex ? darkenHex(hex, 0.5) : "#6B7280",
      category: "containers",
    };
  }
  return BUILDING_TYPES.find((b) => b.id === id);
}
