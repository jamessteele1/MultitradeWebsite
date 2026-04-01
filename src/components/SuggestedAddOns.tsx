"use client";

import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";

/* ─── Add-On Catalogue ──────────────────────────────────────── */

type AddOn = {
  id: string;
  name: string;
  size: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "complexes" | "ancillary";
  desc: string;
  href: string;
};

const CATALOGUE: Record<string, AddOn> = {
  // Ancillary
  "5000l-tank-pump": {
    id: "5000l-tank-pump", name: "5000L Tank & Pump Combo", size: "Skid mounted",
    img: "/images/products/5000l-tank-pump/1.jpg", category: "ancillary",
    desc: "Fresh water supply for buildings that need a mains connection.",
    href: "/hire/ancillary/5000l-tank-pump",
  },
  "6000l-waste-tank": {
    id: "6000l-waste-tank", name: "6000L Waste Tank", size: "6000L",
    img: "/images/products/6000l-waste-tank/1.jpg", category: "ancillary",
    desc: "Grey/black water collection for 6x3m toilet blocks.",
    href: "/hire/ancillary/6000l-waste-tank",
  },
  "4000l-waste-tank": {
    id: "4000l-waste-tank", name: "4000L Waste Tank", size: "4000L",
    img: "/images/products/4000l-waste-tank/1.jpg", category: "ancillary",
    desc: "Mid-size waste tank for 3.6x2.4m toilet blocks.",
    href: "/hire/ancillary/4000l-waste-tank",
  },
  "12x3m-covered-deck": {
    id: "12x3m-covered-deck", name: "12x3m Covered Deck", size: "12x3m",
    img: "/images/products/12x3m-covered-deck/1.jpg", category: "ancillary",
    desc: "Covered walkway between buildings for weather protection.",
    href: "/hire/ancillary/12x3m-covered-deck",
  },
  "stair-landing": {
    id: "stair-landing", name: "Stair & Landing", size: "Various",
    img: "/images/products/stair-landing/1.jpg", category: "ancillary",
    desc: "Compliant access stairs for elevated buildings.",
    href: "/hire/ancillary/stair-landing",
  },
  "dual-hand-wash-station": {
    id: "dual-hand-wash-station", name: "Dual Hand Wash Station", size: "Compact",
    img: "/images/products/dual-hand-wash-station/1.jpg", category: "ancillary",
    desc: "Freestanding hygiene station for site entry points.",
    href: "/hire/ancillary/dual-hand-wash-station",
  },
  // Ablutions
  "6x3m-toilet-block": {
    id: "6x3m-toilet-block", name: "6x3m Toilet Block", size: "6x3m",
    img: "/images/products/6x3-toilet/1.jpg", category: "ablutions",
    desc: "High-capacity male/female toilet facility with hand basins.",
    href: "/hire/ablutions/6x3m-toilet-block",
  },
  "3-6x2-4m-toilet": {
    id: "3-6x2-4m-toilet", name: "3.6x2.4m Toilet", size: "3.6x2.4m",
    img: "/images/products/36x24-toilet/1.jpg", category: "ablutions",
    desc: "Compact toilet unit ideal for smaller construction sites.",
    href: "/hire/ablutions/3-6x2-4m-toilet",
  },
  "solar-toilet": {
    id: "solar-toilet", name: "Solar Toilet", size: "5.45x2.4m",
    img: "/images/products/solar-toilet-6x24/1.jpg", category: "ablutions",
    desc: "Completely off-grid solar-powered toilet — no connections needed.",
    href: "/hire/ablutions/solar-toilet",
  },
  "4-2x3m-shower-block": {
    id: "4-2x3m-shower-block", name: "4.2x3m Shower Block", size: "4.2x3m",
    img: "/images/products/42x3m-ablution/1.jpg", category: "ablutions",
    desc: "Dedicated shower facility with hot water for crew amenity.",
    href: "/hire/ablutions/4-2x3m-shower-block",
  },
  "chemical-toilet": {
    id: "chemical-toilet", name: "Chemical Toilet", size: "Portable",
    img: "/images/products/chemical-toilet/1.jpg", category: "ablutions",
    desc: "Standalone portable toilet for remote locations.",
    href: "/hire/ablutions/chemical-toilet",
  },
  "pwd-chemical-toilet": {
    id: "pwd-chemical-toilet", name: "PWD Chemical Toilet", size: "Portable",
    img: "/images/products/pwd-chemical-toilet/1.png", category: "ablutions",
    desc: "Wheelchair accessible chemical toilet for PWD compliance.",
    href: "/hire/ablutions/pwd-chemical-toilet",
  },
  // Crib Rooms
  "12x3m-crib-room": {
    id: "12x3m-crib-room", name: "12x3m Crib Room", size: "12x3m",
    img: "/images/products/12x3-crib/1.jpg", category: "crib-rooms",
    desc: "Large crib room for up to 30 workers with full kitchen facilities.",
    href: "/hire/crib-rooms/12x3m-crib-room",
  },
  "6x3m-crib-room": {
    id: "6x3m-crib-room", name: "6x3m Crib Room", size: "6x3m",
    img: "/images/products/6x3-crib/1.jpg", category: "crib-rooms",
    desc: "Compact crib room for up to 15 workers.",
    href: "/hire/crib-rooms/6x3m-crib-room",
  },
  "12x3m-mobile-crib": {
    id: "12x3m-mobile-crib", name: "12x3m Mobile Crib Room", size: "12.5x3m",
    img: "/images/products/12x3-mobile-crib-room/1.jpg", category: "crib-rooms",
    desc: "Trailer-mounted self-contained crib — relocate as work moves.",
    href: "/hire/crib-rooms/12x3m-mobile-crib",
  },
  // Site Offices
  "12x3m-office": {
    id: "12x3m-office", name: "12x3m Office", size: "12x3m",
    img: "/images/products/12x3-office/1.jpg", category: "site-offices",
    desc: "Spacious site office for 5–6 desks with full fit-out.",
    href: "/hire/site-offices/12x3m-office",
  },
  "6x3m-office": {
    id: "6x3m-office", name: "6x3m Office", size: "6x3m",
    img: "/images/products/6x3-office/1.jpg", category: "site-offices",
    desc: "Compact site office for 2–3 desks.",
    href: "/hire/site-offices/6x3m-office",
  },
};

/* ─── Smart Recommendation Rules ────────────────────────────── */

// Products that are self-contained (have their own water/waste/power)
const SELF_CONTAINED = new Set([
  "solar-toilet",
  "chemical-toilet",
  "pwd-chemical-toilet",
  "12x3m-mobile-crib",
  "6-6x3m-self-contained",
  "7-2x3m-self-contained",
  "9-6x3m-living-quarters",
  "self-contained-supervisor-office",
]);

// Per-product recommendation lists (in priority order)
// Rule: recommend what complements this product on a real worksite
const RECOMMENDATIONS: Record<string, string[]> = {
  // ─── Ablutions ───
  "6x3m-toilet-block": [
    "6000l-waste-tank",       // needs waste collection
    "5000l-tank-pump",        // needs water supply
    "12x3m-crib-room",       // workers need somewhere to eat
    "12x3m-covered-deck",    // connect buildings
  ],
  "3-6x2-4m-toilet": [
    "4000l-waste-tank",       // smaller waste tank for smaller toilet
    "5000l-tank-pump",        // needs water supply
    "6x3m-crib-room",        // workers need somewhere to eat
    "12x3m-covered-deck",
  ],
  "solar-toilet": [
    "6x3m-crib-room",        // self-contained, so suggest complementary buildings
    "12x3m-crib-room",
    "6x3m-office",
    "12x3m-covered-deck",
  ],
  "4-2x3m-shower-block": [
    "6000l-waste-tank",       // needs waste collection
    "5000l-tank-pump",        // needs water supply
    "6x3m-toilet-block",     // pair showers with toilets
    "12x3m-crib-room",       // complete the amenity set
  ],
  "chemical-toilet": [
    "pwd-chemical-toilet",    // add accessible option
    "dual-hand-wash-station", // no built-in wash
    "6x3m-crib-room",        // workers need somewhere to eat
    "6x3m-office",           // complement with office
  ],
  "pwd-chemical-toilet": [
    "chemical-toilet",        // pair standard with accessible
    "dual-hand-wash-station", // no built-in wash
    "6x3m-crib-room",
    "6x3m-office",
  ],
  "bathhouse": [
    "6000l-waste-tank",
    "5000l-tank-pump",
    "6x3m-toilet-block",     // bathhouse is showers/change — add toilets
    "12x3m-covered-deck",
  ],

  // ─── Crib Rooms ───
  "12x3m-crib-room": [
    "5000l-tank-pump",        // needs potable water supply
    "6x3m-toilet-block",     // workers need toilets
    "12x3m-covered-deck",    // connect crib to toilet
    "12x3m-office",          // complement with office space
  ],
  "6x3m-crib-room": [
    "5000l-tank-pump",        // needs potable water supply
    "3-6x2-4m-toilet",       // smaller toilet for smaller crib
    "12x3m-covered-deck",
    "6x3m-office",
  ],
  "12x3m-mobile-crib": [
    // Self-contained — suggest complementary non-ancillary products
    "6x3m-office",
    "chemical-toilet",        // extra toilet capacity
    "12x3m-crib-room",       // scale up with fixed crib
    "12x3m-covered-deck",
  ],
  "6-6x3m-self-contained": [
    "6x3m-office",
    "chemical-toilet",
    "12x3m-covered-deck",
    "6x3m-crib-room",        // scale up crew capacity
  ],
  "7-2x3m-self-contained": [
    "6x3m-office",
    "chemical-toilet",
    "12x3m-covered-deck",
    "12x3m-crib-room",
  ],
  "9-6x3m-living-quarters": [
    "6x3m-office",            // living quarters needs an office nearby
    "12x3m-crib-room",       // communal eating area
    "12x3m-covered-deck",
    "chemical-toilet",        // extra facility
  ],

  // ─── Site Offices ───
  "12x3m-office": [
    "5000l-tank-pump",        // needs potable water supply
    "6x3m-toilet-block",     // office workers need toilets
    "12x3m-crib-room",       // and somewhere to eat
    "12x3m-covered-deck",    // connect buildings
  ],
  "6x3m-office": [
    "5000l-tank-pump",        // needs potable water supply
    "3-6x2-4m-toilet",       // smaller toilet for smaller office setup
    "6x3m-crib-room",
    "12x3m-covered-deck",
  ],
  "6x3m-supervisor-office": [
    "5000l-tank-pump",        // needs potable water supply
    "3-6x2-4m-toilet",
    "6x3m-crib-room",
    "12x3m-covered-deck",
  ],
  "3x3m-office": [
    "chemical-toilet",        // small site = portable toilet
    "6x3m-crib-room",
    "5000l-tank-pump",
    "dual-hand-wash-station",
  ],
  "20ft-container-office": [
    "chemical-toilet",
    "6x3m-crib-room",
    "5000l-tank-pump",
    "dual-hand-wash-station",
  ],
  "gatehouse": [
    "chemical-toilet",
    "dual-hand-wash-station",
    "3-6x2-4m-toilet",
    "6x3m-office",
  ],
  "self-contained-supervisor-office": [
    "12x3m-crib-room",       // self-contained, so complement with other buildings
    "6x3m-crib-room",
    "12x3m-covered-deck",
    "12x3m-office",           // scale up office space
  ],

  // ─── Containers ───
  "20ft-container": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],
  "20ft-high-cube-container": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],
  "10ft-container": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],
  "20ft-dg-container": [
    "dual-hand-wash-station", // DG sites need hygiene
    "chemical-toilet",
    "6x3m-office",
    "6x3m-crib-room",
  ],
  "10ft-dg-container": [
    "dual-hand-wash-station",
    "chemical-toilet",
    "6x3m-office",
    "6x3m-crib-room",
  ],
  "20ft-shelved-container": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],
  "20ft-riggers-container": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],

  // ─── Ancillary ───
  "5000l-tank-pump": [
    "6x3m-toilet-block",
    "4-2x3m-shower-block",
    "6000l-waste-tank",
    "12x3m-crib-room",
  ],
  "6000l-waste-tank": [
    "6x3m-toilet-block",
    "5000l-tank-pump",
    "4-2x3m-shower-block",
    "12x3m-crib-room",
  ],
  "4000l-waste-tank": [
    "3-6x2-4m-toilet",
    "5000l-tank-pump",
    "6x3m-crib-room",
    "12x3m-covered-deck",
  ],
  "12x3m-covered-deck": [
    "12x3m-crib-room",
    "6x3m-toilet-block",
    "12x3m-office",
    "5000l-tank-pump",
  ],
  "40ft-flat-rack": [
    "6x3m-office",
    "chemical-toilet",
    "6x3m-crib-room",
    "dual-hand-wash-station",
  ],
  "stair-landing": [
    "12x3m-crib-room",
    "6x3m-toilet-block",
    "12x3m-office",
    "12x3m-covered-deck",
  ],
  "dual-hand-wash-station": [
    "chemical-toilet",
    "6x3m-crib-room",
    "6x3m-office",
    "5000l-tank-pump",
  ],
  "wash-trough": [
    "6x3m-toilet-block",
    "6x3m-crib-room",
    "dual-hand-wash-station",
    "5000l-tank-pump",
  ],
};

/* ─── Get Add-Ons ───────────────────────────────────────────── */

function getAddOns(currentProductId: string): AddOn[] {
  const ids = RECOMMENDATIONS[currentProductId];
  if (!ids) return [];

  const result: AddOn[] = [];
  for (const id of ids) {
    const addon = CATALOGUE[id];
    if (addon && id !== currentProductId) {
      result.push(addon);
    }
    if (result.length >= 4) break;
  }
  return result;
}

/* ─── Component ─────────────────────────────────────────────── */

type Props = {
  category: string;
  currentProductId: string;
};

export default function SuggestedAddOns({ currentProductId }: Props) {
  const addons = getAddOns(currentProductId);

  if (addons.length === 0) return null;

  return (
    <section className="py-10 md:py-14 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Suggested Add-Ons</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all"
            >
              <Link href={addon.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={addon.img}
                  alt={addon.name}
                  className="w-full h-36 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link href={addon.href}>
                  <h3 className="text-sm font-bold text-gray-900 hover:text-gold transition-colors">{addon.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1">{addon.desc}</p>
                <div className="mt-3">
                  <AddToQuoteButton
                    compact
                    product={{
                      id: addon.id,
                      name: addon.name,
                      size: addon.size,
                      img: addon.img,
                      category: addon.category,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
