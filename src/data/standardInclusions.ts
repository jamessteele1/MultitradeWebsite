/* ─── Standard Inclusions by Product ID ─────────────────────── */
// Central lookup used by the quote review page to show what's included
// with each product. Sourced from each product detail page's data.

const STANDARD_INCLUSIONS: Record<string, string[]> = {
  // ─── Ablutions ───
  "6x3m-toilet-block": [
    "Multiple Toilet Cubicles", "Urinals (male side)", "Hand Basins with Mixer Taps",
    "Mirror & Paper Towel Dispensers", "Toilet Roll Holders", "LED Lighting Throughout",
    "Exhaust Ventilation", "Non-Slip Vinyl Flooring", "Smoke Detectors",
    "Fire Extinguisher", "First Aid Kit", "Sanitary Bins (female side)",
  ],
  "3-6x2-4m-toilet": [
    "2 × Toilet Cubicles", "Hand Basin with Mixer Tap", "Mirror",
    "Paper Towel Dispenser", "Toilet Roll Holders", "LED Lighting",
    "Exhaust Ventilation", "Non-Slip Vinyl Flooring",
    "Smoke Detector", "Fire Extinguisher",
  ],
  "solar-toilet": [
    "2 × Toilet Pans", "2 × Hand Basins", "Solar Panel Array",
    "Battery Storage System", "Fresh Water Tank", "Waste Water Tank",
    "LED Lighting", "Exhaust Ventilation", "Mirror",
    "Paper Towel Dispenser", "Toilet Roll Holders", "Non-Slip Flooring",
  ],
  "4-2x3m-shower-block": [
    "Multiple Shower Cubicles", "Hot Water System", "Shower Mixer Taps",
    "Bench Seating", "Towel Hooks", "Mirror",
    "LED Lighting", "Exhaust Ventilation", "Non-Slip Flooring",
    "Smoke Detector", "Fire Extinguisher",
  ],
  "chemical-toilet": [
    "Toilet Seat & Pan", "Chemical Waste Tank", "Toilet Roll Holder",
    "Hand Sanitiser Dispenser", "Lockable Door", "Occupancy Indicator",
    "Internal Mirror", "Ventilation",
  ],
  "pwd-chemical-toilet": [
    "Accessible Toilet Pan", "Chemical Waste Tank", "Stainless Steel Grab Rails",
    "Wheelchair Ramp", "Toilet Roll Holder", "Hand Sanitiser Dispenser",
    "Wide Lockable Door", "Occupancy Indicator", "Internal Mirror",
  ],
  "bathhouse": [
    "Multiple Shower Cubicles", "Hot Water System", "Double-Stacked Lockers",
    "Bench Seating", "Towel Hooks", "Mirrors",
    "LED Lighting", "Exhaust Ventilation", "Non-Slip Flooring",
    "Smoke Detectors", "Fire Extinguisher", "First Aid Kit",
  ],

  // ─── Crib Rooms ───
  "12x3m-crib-room": [
    "2 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
    "5 × Crib Tables", "24 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
    "1 × Stainless Steel Sink with Mixer Tap", "1 × Cutlery Drainer", "1 × First Aid Kit",
    "1 × Fire Blanket", "1 × Fire Extinguisher", "2 × Smoke Detectors",
  ],
  "6x3m-crib-room": [
    "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
    "3 × Crib Tables", "12 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
    "1 × Stainless Steel Sink with Mixer Tap", "1 × Cutlery Drainer", "1 × First Aid Kit",
    "1 × Fire Blanket", "1 × Fire Extinguisher", "1 × Smoke Detector",
  ],
  "12x3m-mobile-crib": [
    "2 × 240L Fridge", "1 × 17L Microwave", "1 × Pie Warmer",
    "5 × Crib Tables", "20 × Crib Chairs", "1 × Instant Boiling Water Unit",
    "2 × Stainless Steel Sinks", "1 × First Aid Kit",
    "Fire Blanket & Extinguisher", "Smoke Detectors", "Pressure Pump System",
  ],
  "6-6x3m-self-contained": [
    "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
    "2 × Crib Tables", "8 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
    "1 × Stainless Steel Sink with Mixer Tap", "Pressure Pump System",
    "1 × First Aid Kit", "1 × Fire Blanket", "1 × Fire Extinguisher", "Smoke Detectors",
  ],
  "7-2x3m-self-contained": [
    "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
    "2 × Crib Tables", "8 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
    "1 × Stainless Steel Sink with Mixer Tap", "Shower, Toilet & Basin",
    "Pressure Pump System", "1 × First Aid Kit", "Fire Blanket & Extinguisher", "Smoke Detectors",
  ],
  "9-6x3m-living-quarters": [
    "Single Bed Frame & Mattress", "Built-in Wardrobe", "1 × 240L Fridge",
    "1 × Microwave", "Kitchen Table & Chairs", "Shower & Toilet",
    "Vanity Basin with Mirror", "Split System AC", "LED Lighting Throughout",
    "Smoke Detectors", "Fire Extinguisher", "First Aid Kit",
  ],

  // ─── Site Offices ───
  "12x3m-office": [
    "5–6 × Office Desks", "5–6 × Office Chairs", "2 × Filing Cabinets",
    "LED Lighting Throughout", "2 × Reverse Cycle Air Conditioners",
    "Lockable Switchboard with RCD", "GPOs at Each Workstation",
    "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
    "2 × Smoke Detectors", "Noticeboard & Whiteboard",
  ],
  "6x3m-office": [
    "2–4 × Office Desks", "2–4 × Office Chairs", "1 × Filing Cabinet",
    "LED Lighting Throughout", "1 × Reverse Cycle Air Conditioner",
    "Lockable Switchboard with RCD", "GPOs at Each Workstation",
    "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
    "1 × Smoke Detector", "Noticeboard",
  ],
  "6x3m-supervisor-office": [
    "1 × Executive Office Desk", "1 × Ergonomic Office Chair", "1 × Filing Cabinet",
    "1 × Bookshelf / Storage Unit", "LED Lighting Throughout",
    "1 × Reverse Cycle Air Conditioner", "Lockable Switchboard with RCD",
    "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
    "1 × Smoke Detector", "Noticeboard & Whiteboard",
  ],
  "3x3m-office": [
    "1 × Office Desk", "1 × Office Chair", "LED Lighting Throughout",
    "1 × Reverse Cycle Air Conditioner", "Lockable Switchboard with RCD",
    "GPOs", "1 × First Aid Kit", "1 × Fire Extinguisher",
    "1 × Smoke Detector",
  ],
  "20ft-container-office": [
    "2–3 × Office Desks", "2–3 × Office Chairs", "LED Lighting Throughout",
    "1 × Reverse Cycle Air Conditioner", "Switchboard with RCD",
    "GPOs", "1 × First Aid Kit", "1 × Fire Extinguisher",
    "1 × Smoke Detector",
  ],
  "gatehouse": [
    "1 × Security Workstation", "1 × Office Chair", "Service Counter & Window",
    "Kitchenette with Sink", "LED Lighting Throughout",
    "Reverse Cycle Air Conditioner", "Switchboard with RCD",
    "Data & Comms Provisions", "1 × First Aid Kit", "1 × Fire Extinguisher",
    "1 × Smoke Detector",
  ],
  "self-contained-supervisor-office": [
    "1 × Office Desk", "1 × Office Chair", "1 × Filing Cabinet",
    "Shower, Toilet & Hand Basin", "LED Lighting Throughout",
    "1 × Reverse Cycle Air Conditioner", "Onboard Generator",
    "Pressure Pump System", "1 × First Aid Kit", "1 × Fire Extinguisher",
    "1 × Smoke Detector",
  ],

  // ─── Containers ───
  "20ft-container": [
    "Lockbox fitted to cargo doors", "Wind & water tight certification",
    "Marine-grade plywood flooring", "Forklift pockets",
    "Corner castings for crane lift", "CSC plating",
  ],
  "20ft-high-cube-container": [
    "Lockbox fitted to cargo doors", "Wind & water tight certification",
    "Marine-grade plywood flooring", "Forklift pockets",
    "Corner castings for crane lift", "CSC plating",
  ],
  "10ft-container": [
    "Lockbox fitted to cargo doors", "Wind & water tight certification",
    "Marine-grade plywood flooring", "Forklift pockets",
    "Corner castings for crane lift",
  ],
  "20ft-dg-container": [
    "Integrated spill containment bund", "DG class signage & placards",
    "Natural ventilation system", "Side-opening access doors",
    "Lockable door hardware", "Steel floor (sealed)",
  ],
  "10ft-dg-container": [
    "Integrated spill containment bund", "DG class signage & placards",
    "Natural ventilation system", "Lockable door hardware",
    "Steel floor (sealed)",
  ],
  "20ft-shelved-container": [
    "Adjustable steel shelving system", "Lockbox fitted to cargo doors",
    "Wind & water tight certification", "Marine-grade plywood flooring",
    "Forklift pockets", "Corner castings for crane lift",
  ],
  "20ft-riggers-container": [
    "Heavy-duty steel workbench", "Adjustable shelving system",
    "Switchboard with RCD", "LED lighting throughout",
    "Power outlets (GPOs)", "Lockbox fitted to cargo doors",
    "Ventilation system",
  ],

  // ─── Ancillary ───
  "5000l-tank-pump": [
    "5000L poly water tank", "Pressure pump system",
    "Steel skid mount frame", "Inlet and outlet fittings",
    "Isolation valves", "Connection hoses",
  ],
  "6000l-waste-tank": [
    "6000L poly waste tank", "Inlet fittings and connections",
    "Pump-out access point", "Vent pipe",
  ],
  "4000l-waste-tank": [
    "4000L poly waste tank", "Inlet fittings and connections",
    "Pump-out access point", "Vent pipe",
  ],
  "12x3m-covered-deck": [
    "Colorbond steel roof", "Steel frame structure",
    "Decking / floor surface", "Connection hardware for adjacent buildings",
    "Stormwater guttering",
  ],
  "40ft-flat-rack": [
    "Fold-down end walls", "ISO corner castings",
    "Forklift pockets", "D-ring lashing points",
    "Heavy-duty floor surface",
  ],
  "stair-landing": [
    "Stair flight(s)", "Platform landing",
    "Handrails both sides", "Anti-slip treads",
    "Kick plates", "Bolt-on connection hardware",
  ],
  "dual-hand-wash-station": [
    "Dual stainless steel wash basins", "Hot & cold mixer taps",
    "Freestanding frame", "Waste outlet connection",
    "Water inlet connections", "Soap dispenser mounts",
  ],
  "wash-trough": [
    "Stainless steel wash trough", "Water inlet connection",
    "Waste drainage outlet", "Mounting hardware",
    "Taps / water outlets",
  ],
};

export default STANDARD_INCLUSIONS;
