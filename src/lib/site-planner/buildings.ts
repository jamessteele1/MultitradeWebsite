export type BuildingType = {
  id: string;
  name: string;
  shortLabel: string;
  widthM: number;
  depthM: number;
  color: string;
  stroke: string;
  category: "offices" | "crib-rooms" | "ablutions" | "containers" | "ancillary" | "decks" | "complexes" | "utilities";
  cartId?: string;
  icon?: string; // emoji/symbol for utility markers
};

export const BUILDING_TYPES: BuildingType[] = [
  // Offices
  { id: "3x3-office",   name: "3x3m Office",          shortLabel: "3×3 Office",     widthM: 3,    depthM: 3,   color: "#DBEAFE", stroke: "#3B82F6", category: "offices",    cartId: "3x3m-office" },
  { id: "6x3-office",   name: "6x3m Office",          shortLabel: "6×3 Office",     widthM: 6,    depthM: 3,   color: "#BFDBFE", stroke: "#2563EB", category: "offices",    cartId: "6x3m-office" },
  { id: "12x3-office",  name: "12x3m Office",         shortLabel: "12×3 Office",    widthM: 12,   depthM: 3,   color: "#93C5FD", stroke: "#1D4ED8", category: "offices",    cartId: "12x3m-office" },

  // Crib Rooms
  { id: "6x3-crib",     name: "6x3m Crib Room",       shortLabel: "6×3 Crib",       widthM: 6,    depthM: 3,   color: "#D1FAE5", stroke: "#22C55E", category: "crib-rooms", cartId: "6x3m-crib-room" },
  { id: "12x3-crib",    name: "12x3m Crib Room",      shortLabel: "12×3 Crib",      widthM: 12,   depthM: 3,   color: "#A7F3D0", stroke: "#16A34A", category: "crib-rooms", cartId: "12x3m-crib-room" },

  // Ablutions
  { id: "3.6x2.4-toilet", name: "3.6x2.4m Toilet",    shortLabel: "3.6×2.4 Toilet", widthM: 3.6,  depthM: 2.4, color: "#EDE9FE", stroke: "#8B5CF6", category: "ablutions",  cartId: "3-6x2-4m-toilet" },
  { id: "6x3-toilet",     name: "6x3m Toilet Block",   shortLabel: "6×3 Toilet",     widthM: 6,    depthM: 3,   color: "#DDD6FE", stroke: "#7C3AED", category: "ablutions",  cartId: "6x3m-toilet-block" },
  { id: "solar-toilet",   name: "Solar Toilet",         shortLabel: "Solar Toilet",   widthM: 5.45, depthM: 2.4, color: "#C4B5FD", stroke: "#6D28D9", category: "ablutions",  cartId: "solar-toilet" },

  // Covered Decks
  { id: "12x3-deck",    name: "12x3m Covered Deck",   shortLabel: "12×3 Deck",      widthM: 12,   depthM: 3,   color: "#D2B48C", stroke: "#8B4513", category: "decks" },
  { id: "6x3-deck",     name: "6x3m Covered Deck",    shortLabel: "6×3 Deck",       widthM: 6,    depthM: 3,   color: "#DEB887", stroke: "#A0522D", category: "decks" },

  // Complexes
  { id: "12x6-complex",  name: "12x6m Complex",        shortLabel: "12×6 Complex",   widthM: 12,   depthM: 6,   color: "#FDE68A", stroke: "#B45309", category: "complexes" },
  { id: "12x9-complex",  name: "12x9m Complex",        shortLabel: "12×9 Complex",   widthM: 12,   depthM: 9,   color: "#FCD34D", stroke: "#A16207", category: "complexes" },
  { id: "12x12-complex", name: "12x12m Complex",       shortLabel: "12×12 Complex",  widthM: 12,   depthM: 12,  color: "#FBBF24", stroke: "#92400E", category: "complexes" },

  // Containers
  { id: "20ft-container", name: "20ft Container",       shortLabel: "20ft Container", widthM: 6,    depthM: 2.4, color: "#E5E7EB", stroke: "#6B7280", category: "containers", cartId: "20ft-container" },

  // Ancillary
  { id: "water-tank",    name: "5000L Water Tank & Pump", shortLabel: "Water Tank",  widthM: 2,    depthM: 2,   color: "#FEF3C7", stroke: "#F59E0B", category: "ancillary",  cartId: "5000l-tank-pump" },
  { id: "stair-landing", name: "Stair & Landing",       shortLabel: "Stairs",         widthM: 2,    depthM: 1.5, color: "#FED7AA", stroke: "#EA580C", category: "ancillary",  cartId: "stair-landing" },

  // Utilities (icon markers)
  { id: "power-point",   name: "Power Connection",      shortLabel: "⚡ Power",       widthM: 1,    depthM: 1,   color: "#FEE2E2", stroke: "#EF4444", category: "utilities",  icon: "⚡" },
  { id: "water-point",   name: "Water Connection",      shortLabel: "💧 Water",       widthM: 1,    depthM: 1,   color: "#DBEAFE", stroke: "#3B82F6", category: "utilities",  icon: "💧" },
  { id: "sewer-point",   name: "Sewage Connection",     shortLabel: "🔵 Sewage",      widthM: 1,    depthM: 1,   color: "#D1FAE5", stroke: "#059669", category: "utilities",  icon: "🔵" },
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
};

export function getBuildingType(id: string): BuildingType | undefined {
  // Check for custom building IDs (format: custom-WxD)
  const customMatch = id.match(/^custom-(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/);
  if (customMatch) {
    const w = parseFloat(customMatch[1]);
    const d = parseFloat(customMatch[2]);
    return {
      id,
      name: `${w}×${d}m Custom`,
      shortLabel: `${w}×${d}m`,
      widthM: w,
      depthM: d,
      color: "#E5E7EB",
      stroke: "#6B7280",
      category: "containers",
    };
  }
  return BUILDING_TYPES.find((b) => b.id === id);
}
