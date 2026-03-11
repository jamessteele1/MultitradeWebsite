export type ScopeProduct = {
  id: string;
  name: string;
  category: "office" | "crib" | "ablution" | "complex" | "container" | "ancillary" | "solar";
  bestFor: string;
};

export const MBH_PRODUCTS: ScopeProduct[] = [
  { id: "office-3x3", name: "3.0m x 3.0m Site Office", category: "office", bestFor: "Small single-user project administration." },
  { id: "office-6x3", name: "6.0m x 3.0m Site Office", category: "office", bestFor: "General site administration and supervisor use." },
  { id: "office-12x3", name: "12.0m x 3.0m Site Office", category: "office", bestFor: "Larger site management teams and meeting space." },
  { id: "crib-6x3", name: "6.0m x 3.0m Crib Room", category: "crib", bestFor: "Up to ~10 workers per break cycle." },
  { id: "crib-12x3", name: "12.0m x 3.0m Crib Room", category: "crib", bestFor: "~10-25 workers per break cycle." },
  { id: "complex-12x6", name: "12.0m x 6.0m Office/Crib Complex", category: "complex", bestFor: "Integrated amenities for mid-large projects." },
  { id: "ablution-36x24", name: "3.6m x 2.4m Toilet Block", category: "ablution", bestFor: "Basic toilet requirement for small crews." },
  { id: "ablution-42x3", name: "4.2m x 3.0m Ablution Block", category: "ablution", bestFor: "Toilet/shower requirements for higher headcount." },
  { id: "container-20", name: "20ft Container", category: "container", bestFor: "General storage and secure materials." },
  { id: "container-office", name: "20ft Container Office", category: "container", bestFor: "Secure office footprint in constrained sites." },
  { id: "solar-facility", name: "Solar Facility Unit", category: "solar", bestFor: "Limited-grid/off-grid site support." },
  { id: "waste-tank", name: "Waste Tank (4000L-6000L)", category: "ancillary", bestFor: "Waste capture where sewer is unavailable." },
  { id: "pump-combo", name: "Tank & Pump Combo", category: "ancillary", bestFor: "Water transfer and utility support." },
  { id: "stairs-landing", name: "Stair & Landing Set", category: "ancillary", bestFor: "Safe elevated building access." },
  { id: "covered-deck", name: "Covered Deck Module", category: "ancillary", bestFor: "Weather-protected transition space." },
];
