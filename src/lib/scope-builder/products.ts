export type ScopeProductCategory = "office" | "crib" | "ablution" | "complex" | "container" | "ancillary" | "solar";

export type ScopeProduct = {
  id: string;
  name: string;
  category: ScopeProductCategory;
  recommendable: boolean;
  note?: string;
};

export const MBH_PRODUCTS: ScopeProduct[] = [
  { id: "office-3x3", name: "3x3m Office", category: "office", recommendable: true },
  { id: "office-6x3", name: "6x3m Office", category: "office", recommendable: true },
  { id: "office-12x3", name: "12x3m Office", category: "office", recommendable: true },
  { id: "office-6x3-supervisor", name: "6x3m Supervisor Office", category: "office", recommendable: true },
  { id: "office-self-contained-supervisor", name: "Self-Contained Supervisor Office", category: "office", recommendable: true },
  { id: "office-gatehouse", name: "Gatehouse", category: "office", recommendable: true },
  { id: "container-office-20", name: "20ft Container Office", category: "office", recommendable: true },

  { id: "crib-3x3", name: "3x3m Crib Room", category: "crib", recommendable: true },
  { id: "crib-6x3", name: "6x3m Crib Room", category: "crib", recommendable: true },
  { id: "crib-12x3", name: "12x3m Crib Room", category: "crib", recommendable: true },
  { id: "crib-12x3-mobile", name: "12x3m Mobile Crib Room", category: "crib", recommendable: true },
  { id: "crib-self-contained-66x3", name: "6.6x3m Self-Contained Crib", category: "crib", recommendable: true },
  { id: "crib-self-contained-72x3", name: "7.2x3m Self-Contained Crib", category: "crib", recommendable: true },
  {
    id: "crib-living-quarters-96x3",
    name: "9.6x3m Living Quarters",
    category: "crib",
    recommendable: false,
    note: "Excluded from Scope Builder MVP recommendations.",
  },

  { id: "toilet-6x3", name: "6x3m Toilet", category: "ablution", recommendable: true },
  { id: "toilet-36x24", name: "3.6x2.4m Toilet", category: "ablution", recommendable: true },
  { id: "toilet-solar", name: "Solar Toilet", category: "ablution", recommendable: true },
  { id: "ablution-42x3-shower", name: "4.2x3m Shower Block", category: "ablution", recommendable: true },
  { id: "toilet-chemical", name: "Chemical Toilet", category: "ablution", recommendable: true },
  { id: "toilet-pwd-chemical", name: "PWD Chemical Toilet", category: "ablution", recommendable: true },
  { id: "bathhouse", name: "Bathhouse", category: "ablution", recommendable: true },

  { id: "complex-12x6", name: "12x6m Complex", category: "complex", recommendable: true },
  { id: "complex-12x9", name: "12x9m Complex", category: "complex", recommendable: true },
  { id: "complex-12x12", name: "12x12m Complex", category: "complex", recommendable: true },
  { id: "complex-custom", name: "Custom Complexes", category: "complex", recommendable: true },

  { id: "container-10", name: "10ft Container", category: "container", recommendable: true },
  { id: "container-20", name: "20ft Container", category: "container", recommendable: true },
  { id: "container-20-high-cube", name: "20ft High Cube Container", category: "container", recommendable: true },
  { id: "container-10-dg", name: "10ft Dangerous Goods Container", category: "container", recommendable: true },
  { id: "container-20-dg", name: "20ft Dangerous Goods Container", category: "container", recommendable: true },
  { id: "container-20-shelved", name: "20ft Shelved Container", category: "container", recommendable: true },
  { id: "container-20-riggers", name: "20ft Riggers Container", category: "container", recommendable: true },

  { id: "solar-facility", name: "Solar Facility", category: "solar", recommendable: true },

  { id: "water-tank-5000-pump", name: "5000L Portable Water Tank on skid with pump combo", category: "ancillary", recommendable: true },
  { id: "waste-tank-4000", name: "4000L Waste Tank", category: "ancillary", recommendable: true },
  { id: "waste-tank-6000", name: "6000L Waste Tank", category: "ancillary", recommendable: true },
  { id: "deck-covered-12x3", name: "12x3m Covered Deck", category: "ancillary", recommendable: true },
  { id: "flat-rack-40", name: "40ft Flat Rack", category: "ancillary", recommendable: true },
  { id: "stair-landing", name: "Stair & Landing", category: "ancillary", recommendable: true },
  { id: "dual-hand-wash", name: "Dual Hand Wash Station", category: "ancillary", recommendable: true },
  { id: "wash-trough", name: "Wash Trough", category: "ancillary", recommendable: true },
];

export const PRODUCT_NAME_BY_ID = new Map(MBH_PRODUCTS.map((product) => [product.id, product.name]));
