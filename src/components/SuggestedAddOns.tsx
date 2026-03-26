"use client";

import AddToQuoteButton from "@/components/AddToQuoteButton";

type AddOn = {
  id: string;
  name: string;
  size: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "complexes" | "ancillary";
  desc: string;
};

const COMMON_ADD_ONS: AddOn[] = [
  {
    id: "5000l-tank-pump",
    name: "5000L Tank & Pump Combo",
    size: "Skid mounted",
    img: "/images/products/5000l-tank-pump/1.jpg",
    category: "ancillary",
    desc: "Fresh water supply for self-sufficient sites",
  },
  {
    id: "12x3m-covered-deck",
    name: "12x3m Covered Deck",
    size: "12x3m",
    img: "/images/products/12x3m-covered-deck/1.jpg",
    category: "ancillary",
    desc: "Covered walkway between buildings",
  },
  {
    id: "stair-landing",
    name: "Stair & Landing",
    size: "Various",
    img: "/images/products/stair-landing/1.jpg",
    category: "ancillary",
    desc: "Compliant access for elevated buildings",
  },
  {
    id: "dual-hand-wash-station",
    name: "Dual Hand Wash Station",
    size: "Compact",
    img: "/images/products/dual-hand-wash-station/1.jpg",
    category: "ancillary",
    desc: "Hygiene station for site entry points",
  },
  {
    id: "6000l-waste-tank",
    name: "6000L Waste Tank",
    size: "6000L",
    img: "/images/products/6000l-waste-tank/1.jpg",
    category: "ancillary",
    desc: "Grey/black water collection for ablutions",
  },
  {
    id: "6x3m-toilet-block",
    name: "6x3m Toilet Block",
    size: "6x3m",
    img: "/images/products/6x3-toilet/1.jpg",
    category: "ablutions",
    desc: "High-capacity site ablution facility",
  },
];

// Choose relevant add-ons based on product category
function getAddOns(category: string, currentProductId: string): AddOn[] {
  const ids = new Set<string>();
  const result: AddOn[] = [];

  // Always relevant: stairs, deck, hand wash
  const priorities =
    category === "ablutions"
      ? ["5000l-tank-pump", "6000l-waste-tank", "stair-landing", "12x3m-covered-deck"]
      : ["stair-landing", "12x3m-covered-deck", "dual-hand-wash-station", "6x3m-toilet-block", "5000l-tank-pump"];

  for (const id of priorities) {
    if (id === currentProductId) continue;
    const addon = COMMON_ADD_ONS.find((a) => a.id === id);
    if (addon && !ids.has(id)) {
      ids.add(id);
      result.push(addon);
    }
  }

  return result.slice(0, 4);
}

type Props = {
  category: string;
  currentProductId: string;
};

export default function SuggestedAddOns({ category, currentProductId }: Props) {
  const addons = getAddOns(category, currentProductId);

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={addon.img}
                alt={addon.name}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900">{addon.name}</h3>
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
