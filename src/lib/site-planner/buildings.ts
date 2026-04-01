export type BuildingType = {
  id: string;
  name: string;
  shortLabel: string;
  widthM: number;
  depthM: number;
  color: string;
  stroke: string;
  category: "offices" | "crib-rooms" | "ablutions" | "containers" | "ancillary";
  cartId?: string;
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

  // Containers
  { id: "20ft-container", name: "20ft Container",       shortLabel: "20ft Container", widthM: 6,    depthM: 2.4, color: "#E5E7EB", stroke: "#6B7280", category: "containers", cartId: "20ft-container" },

  // Ancillary
  { id: "water-tank",    name: "5000L Water Tank",      shortLabel: "Water Tank",     widthM: 2,    depthM: 2,   color: "#FEF3C7", stroke: "#F59E0B", category: "ancillary",  cartId: "5000l-tank-pump" },
  { id: "waste-tank-6k", name: "6000L Waste Tank",      shortLabel: "Waste 6000L",    widthM: 2,    depthM: 2,   color: "#FDE68A", stroke: "#D97706", category: "ancillary",  cartId: "6000l-waste-tank" },
  { id: "waste-tank-4k", name: "4000L Waste Tank",      shortLabel: "Waste 4000L",    widthM: 1.8,  depthM: 1.8, color: "#FDE68A", stroke: "#D97706", category: "ancillary",  cartId: "4000l-waste-tank" },
  { id: "stair-landing", name: "Stair & Landing",       shortLabel: "Stairs",         widthM: 2,    depthM: 1.5, color: "#FED7AA", stroke: "#EA580C", category: "ancillary",  cartId: "stair-landing" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  offices: "Site Offices",
  "crib-rooms": "Crib Rooms",
  ablutions: "Ablutions & Toilets",
  containers: "Containers",
  ancillary: "Ancillary Equipment",
};

export function getBuildingType(id: string): BuildingType | undefined {
  return BUILDING_TYPES.find((b) => b.id === id);
}
