import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import SuggestedAddOns from "@/components/SuggestedAddOns";
import CompareProducts from "@/components/CompareProducts";
import FloorplanViewer from "@/components/FloorplanViewer";
import PowerSiteRequirements from "@/components/PowerSiteRequirements";
import { ServiceUpgradesProvider } from "@/context/ServiceUpgradesContext";

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "6x3m-toilet-block": {
    name: "6x3m Toilet Block",
    slug: "6x3m-toilet-block",
    tagline: "High-Capacity Male/Female Toilet Facility",
    size: "600cm × 300cm",
    capacity: "High traffic",
    badge: null,
    images: ["/images/products/6x3-toilet/1.jpg", "/images/products/6x3-toilet/2.jpg", "/images/products/6x3-toilet/3.jpg", "/images/products/6x3-toilet/4.jpg", "/images/products/6x3-toilet/5.jpg", "/images/products/6x3-toilet/6.jpg", "/images/products/6x3-toilet/7.jpg", "/images/products/6x3-toilet/8.jpg"],
    floorPlan: "/images/floorplans/MBH-6030-TBL-01-A - 6.0x3.0m Toilet Block.pdf",
    description: "The 6.0m × 3.0m Toilet Block is a high-capacity portable amenity designed for busy worksites with large crews. Featuring separate male and female configurations with multiple cubicles, urinals, and hand basins, this unit handles heavy foot traffic while maintaining hygiene standards. Built on a 75mm steel frame with Colorbond cladding, it's tough enough for mining and construction environments.",
    features: [
      { title: "Male/Female Configurations", desc: "Separate male and female sections with dedicated cubicles, urinals (male side), and hand basins for privacy and compliance." },
      { title: "High Traffic Capacity", desc: "Multiple cubicles and urinals designed to handle large crews during peak break times without queuing." },
      { title: "Hygienic Finishes", desc: "Fibreglass-lined wet areas, stainless steel fixtures, and commercial-grade vinyl flooring for easy cleaning and maintenance." },
      { title: "Durable Construction", desc: "75mm steel frame, Colorbond steel cladding, fully insulated walls and ceiling for comfort in all conditions." },
    ],
    specifications: {
      "Dimensions": "600cm (L) × 300cm (W)",
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibreglass wet area lining",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl, non-slip",
      "Doors": "2 × external entry doors (male/female)",
      "Cubicles": "Multiple cubicles with partitions",
      "Electrical": "Lockable switchboard, RCD, LED lighting",
      "Plumbing": "Connected hot & cold water supply",
    },
    standardInclusions: [
      "Multiple Toilet Cubicles", "Urinals (male side)", "Hand Basins with Mixer Taps",
      "Mirror & Paper Towel Dispensers", "Toilet Roll Holders", "LED Lighting Throughout",
      "Exhaust Ventilation", "Non-Slip Vinyl Flooring", "Smoke Detectors",
      "Fire Extinguisher", "First Aid Kit", "Sanitary Bins (female side)",
    ],
  },
  "3-6x2-4m-toilet": {
    name: "3.6x2.4m Toilet",
    slug: "3-6x2-4m-toilet",
    tagline: "Compact Toilet Unit for Smaller Sites",
    size: "360cm × 240cm",
    capacity: "Medium traffic",
    badge: null,
    images: ["/images/products/36x24-toilet/1.jpg", "/images/products/36x24-toilet/2.jpg", "/images/products/36x24-toilet/3.jpg", "/images/products/36x24-toilet/4.jpg"],
    floorPlan: "/images/floorplans/MBH-3624-TBL-01-A - 3.6x2.4m Toilet Block.pdf",
    description: "The 3.6m × 2.4m Toilet is a compact, self-contained amenity unit ideal for smaller construction sites, events, and temporary worksites. Despite its compact footprint, this unit provides comfortable toilet and hand washing facilities with separate cubicles. Built to the same heavy-duty standards as our larger units.",
    features: [
      { title: "Compact Footprint", desc: "At 3.6m × 2.4m, this unit fits easily on tight sites where space is limited, without compromising on amenity." },
      { title: "Multiple Cubicles", desc: "Separate cubicles with full partitions provide privacy and accommodate multiple users simultaneously." },
      { title: "Easy Site Integration", desc: "Standard plumbing connections and compact size make this unit quick to install and connect on any site." },
      { title: "Low Maintenance", desc: "Fibreglass-lined wet areas and stainless steel fixtures are designed for easy cleaning and long service life." },
    ],
    specifications: {
      "Dimensions": "360cm (L) × 240cm (W)",
      "Frame": "Steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibreglass wet area lining",
      "Flooring": "Commercial-grade vinyl, non-slip",
      "Doors": "1 × external entry door",
      "Cubicles": "2 × cubicles with partitions",
      "Electrical": "Switchboard, RCD, LED lighting",
      "Plumbing": "Hot & cold water connections",
    },
    standardInclusions: [
      "2 × Toilet Cubicles", "Hand Basin with Mixer Tap", "Mirror",
      "Paper Towel Dispenser", "Toilet Roll Holders", "LED Lighting",
      "Exhaust Ventilation", "Non-Slip Vinyl Flooring",
      "Smoke Detector", "Fire Extinguisher",
    ],
  },
  "solar-toilet": {
    name: "Solar Toilet",
    slug: "solar-toilet",
    tagline: "Completely Off-Grid Solar-Powered Amenity",
    size: "545cm × 240cm",
    capacity: "Medium traffic",
    badge: "SOLAR",
    images: ["/images/products/solar-toilet-6x24/1.jpg", "/images/products/solar-toilet-6x24/2.jpg", "/images/products/solar-toilet-6x24/3.jpg", "/images/products/solar-toilet-6x24/4.jpg", "/images/products/solar-toilet-6x24/5.jpg", "/images/products/solar-toilet-6x24/6.jpg", "/images/products/solar-toilet-6x24/7.jpg", "/images/products/solar-toilet-6x24/8.jpg", "/images/products/solar-toilet-6x24/9.jpg", "/images/products/solar-toilet-6x24/10.jpg", "/images/products/solar-toilet-6x24/11.jpg", "/images/products/solar-toilet-6x24/12.jpg"],
    floorPlan: "/images/floorplans/SQF-4525-01-A - 5.45x2.4m Solar Toilet - Floor Plan.pdf",
    description: "The 5.45m × 2.4m Solar Toilet is a completely self-sufficient amenity unit requiring no utility connections whatsoever. Powered entirely by roof-mounted solar panels with battery storage, and equipped with onboard water tanks, this unit can be deployed anywhere — remote pipeline corridors, bushland clearing sites, or temporary access roads. Features 2 pans and 2 hand basins.",
    features: [
      { title: "100% Solar Powered", desc: "Roof-mounted solar panels with battery storage system provide all electrical power. Zero running costs, zero emissions." },
      { title: "No Water Connection Required", desc: "Onboard fresh water and waste water tanks mean this unit operates completely independently of site services." },
      { title: "Rapid Deployment", desc: "No sub-trades needed for power or plumbing connections. Delivered and operational within minutes of placement." },
      { title: "Environmentally Friendly", desc: "Solar power and efficient water usage make this the most environmentally responsible toilet option in the fleet." },
    ],
    specifications: {
      "Dimensions": "545cm (L) × 240cm (W)",
      "Power": "Roof-mounted solar panels + battery storage",
      "Water": "Onboard fresh water tank",
      "Waste": "Onboard waste water tank",
      "Pans": "2 × toilet pans",
      "Basins": "2 × hand basins",
      "Lighting": "LED (solar powered)",
      "Construction": "Steel frame, Colorbond cladding",
      "Flooring": "Non-slip vinyl",
    },
    standardInclusions: [
      "2 × Toilet Pans", "2 × Hand Basins", "Solar Panel Array",
      "Battery Storage System", "Fresh Water Tank", "Waste Water Tank",
      "LED Lighting", "Exhaust Ventilation", "Mirror",
      "Paper Towel Dispenser", "Toilet Roll Holders", "Non-Slip Flooring",
    ],
  },
  "4-2x3m-shower-block": {
    name: "4.2x3m Shower Block",
    slug: "4-2x3m-shower-block",
    tagline: "Dedicated Crew Shower Facility",
    size: "420cm × 300cm",
    capacity: "Crew showers",
    badge: null,
    images: ["/images/products/42x3m-ablution/1.jpg", "/images/products/42x3m-ablution/2.jpg", "/images/products/42x3m-ablution/3.jpg"],
    floorPlan: "/images/floorplans/PJF-654-1106-01- 4.2x3.0m Ablution - Floor Plan V2.0.pdf",
    description: "The 4.2m × 3.0m Shower Block is a dedicated shower amenity designed for end-of-shift use by construction, mining, and industrial crews. Featuring multiple shower cubicles with hot water system, this unit provides a clean and comfortable bathing facility. Fibreglass-lined wet areas and stainless steel fixtures ensure durability and easy maintenance.",
    features: [
      { title: "Multiple Shower Cubicles", desc: "Individual shower cubicles with full partitions provide privacy and allow multiple crew members to shower simultaneously." },
      { title: "Hot Water System", desc: "Electric hot water system provides reliable hot water for comfortable end-of-shift showers year-round." },
      { title: "Hygienic Design", desc: "Fibreglass-lined walls and ceiling in all wet areas with non-slip flooring and stainless steel fixtures throughout." },
      { title: "Change Area", desc: "Bench seating and hooks provided for changing, keeping personal items dry and off the floor." },
    ],
    specifications: {
      "Dimensions": "420cm (L) × 300cm (W)",
      "Frame": "Steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibreglass wet area lining",
      "Flooring": "Non-slip vinyl",
      "Showers": "Multiple cubicles with mixer taps",
      "Hot Water": "Electric hot water system",
      "Electrical": "Switchboard, RCD, LED lighting",
      "Ventilation": "Exhaust fans",
    },
    standardInclusions: [
      "Multiple Shower Cubicles", "Hot Water System", "Shower Mixer Taps",
      "Bench Seating", "Towel Hooks", "Mirror",
      "LED Lighting", "Exhaust Ventilation", "Non-Slip Flooring",
      "Smoke Detector", "Fire Extinguisher",
    ],
  },
  "chemical-toilet": {
    name: "Chemical Toilet",
    slug: "chemical-toilet",
    tagline: "Standalone Portable Toilet for Remote Locations",
    size: "Portable",
    capacity: "Single use",
    badge: null,
    images: ["/images/products/chemical-toilet/1.jpg", "/images/products/chemical-toilet/2.jpg"],
    floorPlan: null,
    description: "The Chemical Toilet is a standalone, fully portable amenity solution for remote worksites with no water or sewage connections available. Using a self-contained chemical waste system, this unit can be placed anywhere on site and relocated as work progresses. Ideal for pipeline corridors, road construction, remote clearing, and any location where permanent facilities aren't feasible.",
    features: [
      { title: "Zero Connections Required", desc: "Completely standalone with a self-contained chemical waste system — no water, power, or sewage connections needed." },
      { title: "Highly Portable", desc: "Lightweight and easy to relocate as work progresses across large or spread-out sites." },
      { title: "Quick Deployment", desc: "Delivered and operational immediately with no installation or sub-trades required." },
      { title: "Regular Servicing", desc: "Scheduled pump-out and cleaning service available to keep the unit hygienic and compliant." },
    ],
    specifications: {
      "Type": "Self-contained chemical toilet",
      "Connections": "None required",
      "Waste System": "Chemical treatment tank",
      "Ventilation": "Natural ventilation",
      "Door": "Lockable door with occupancy indicator",
      "Construction": "Moulded polyethylene",
    },
    standardInclusions: [
      "Toilet Seat & Pan", "Chemical Waste Tank", "Toilet Roll Holder",
      "Hand Sanitiser Dispenser", "Lockable Door", "Occupancy Indicator",
      "Internal Mirror", "Ventilation",
    ],
  },
  "pwd-chemical-toilet": {
    name: "PWD Chemical Toilet",
    slug: "pwd-chemical-toilet",
    tagline: "Wheelchair Accessible Portable Toilet",
    size: "Portable",
    capacity: "Accessible",
    badge: "ACCESSIBLE",
    images: ["/images/products/pwd-chemical-toilet/1.png"],
    floorPlan: null,
    description: "The PWD (People With Disability) Chemical Toilet is a wheelchair accessible, self-contained portable amenity that meets Australian accessibility compliance requirements. Featuring a wider doorway, internal grab rails, and sufficient turning circle for wheelchair users, this unit ensures all workers and visitors have access to dignified toilet facilities on any worksite.",
    features: [
      { title: "Wheelchair Accessible", desc: "Wide doorway, ramp access, and sufficient internal turning circle for wheelchair users to enter and use independently." },
      { title: "Compliance Ready", desc: "Meets Australian PWD accessibility requirements for worksites, events, and public facilities." },
      { title: "Grab Rails & Support", desc: "Internal grab rails positioned for safe transfer from wheelchair to toilet seat and back." },
      { title: "Self-Contained", desc: "Chemical waste system requires no water or sewage connections — deploy anywhere on site." },
    ],
    specifications: {
      "Type": "Accessible chemical toilet (PWD compliant)",
      "Access": "Wide doorway with ramp",
      "Internal Space": "Wheelchair turning circle compliant",
      "Grab Rails": "Stainless steel grab rails",
      "Waste System": "Chemical treatment tank",
      "Door": "Wide lockable door with occupancy indicator",
      "Construction": "Moulded polyethylene",
    },
    standardInclusions: [
      "Accessible Toilet Pan", "Chemical Waste Tank", "Stainless Steel Grab Rails",
      "Wheelchair Ramp", "Toilet Roll Holder", "Hand Sanitiser Dispenser",
      "Wide Lockable Door", "Occupancy Indicator", "Internal Mirror",
    ],
  },
  "bathhouse": {
    name: "Bathhouse",
    slug: "bathhouse",
    tagline: "Full Change Room & Shower Facility for Large Crews",
    size: "Custom",
    capacity: "Large crews",
    badge: null,
    images: ["/images/products/42x3m-ablution/bathhouse-1.jpg", "/images/products/42x3m-ablution/bathhouse-2.jpg", "/images/products/42x3m-ablution/2.jpg"],
    floorPlan: null,
    description: "The Bathhouse is a comprehensive change room and shower facility designed for large mining and construction crews. Featuring multiple showers, change rooms with double-stacked lockers, and bench seating, this unit provides a complete end-of-shift amenity. Custom-built to suit your crew size and site requirements, the Bathhouse can be configured as a standalone unit or integrated into a larger camp complex.",
    features: [
      { title: "Multiple Showers", desc: "Individual shower cubicles with hot water to accommodate large crew numbers during shift changes." },
      { title: "Change Room Facilities", desc: "Dedicated change areas with double-stacked lockers and bench seating for secure storage of personal belongings." },
      { title: "Custom Configurations", desc: "Built to order — we can configure layout, locker numbers, and shower count to match your exact crew requirements." },
      { title: "Heavy-Duty Construction", desc: "Steel frame with Colorbond cladding and fibreglass wet area lining built for high-volume, long-term use." },
    ],
    specifications: {
      "Size": "Custom — built to requirements",
      "Showers": "Multiple cubicles (quantity to spec)",
      "Lockers": "Double-stacked lockers",
      "Seating": "Bench seating throughout",
      "Hot Water": "Commercial hot water system",
      "Construction": "Steel frame, Colorbond cladding",
      "Wet Areas": "Fibreglass lined",
      "Flooring": "Non-slip vinyl",
      "Electrical": "LED lighting, exhaust ventilation",
    },
    standardInclusions: [
      "Multiple Shower Cubicles", "Hot Water System", "Double-Stacked Lockers",
      "Bench Seating", "Towel Hooks", "Mirrors",
      "LED Lighting", "Exhaust Ventilation", "Non-Slip Flooring",
      "Smoke Detectors", "Fire Extinguisher", "First Aid Kit",
    ],
  },
};

interface Product {
  name: string; slug: string; tagline: string; size: string; capacity: string;
  badge: string | null;
  images: string[]; floorPlan: string | null; description: string;
  features: { title: string; desc: string }[];
  specifications: Record<string, string>;
  standardInclusions: string[];
}

const ALL_SLUGS = Object.keys(PRODUCTS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PRODUCTS[params.slug];
  if (!p) return {};
  return {
    title: `${p.name} Hire | Portable Ablutions & Toilets QLD — Multitrade`,
    description: `Hire the ${p.name} for your worksite. ${p.tagline}. ${p.capacity}. Delivered across Central Queensland. 45+ years experience.`,
  };
}

export default function AblutionDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug];
  if (!product) notFound();

  const buildingSize: "12x3" | "6x3" | "3x3" | "other" = product.size.startsWith("12") ? "12x3" : product.size.startsWith("6") ? "6x3" : product.size.startsWith("3") ? "3x3" : "other";

  // Toilet-specific: sewer connection question + waste tank sizing
  const isToiletBlock = product.slug === "6x3m-toilet-block" || product.slug === "3-6x2-4m-toilet";
  const toiletSize: "6x3" | "3.6x2.4" | undefined = product.slug === "6x3m-toilet-block" ? "6x3" : product.slug === "3-6x2-4m-toilet" ? "3.6x2.4" : undefined;

  return (
    <ServiceUpgradesProvider>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <Link href="/hire/ablutions" className="hover:text-white/60">Ablutions & Toilets</Link><span>/</span>
            <span className="text-white/80 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.badge && <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{product.badge}</span>}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.size}</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.capacity}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{product.name}</h1>
              <p className="text-white/50 mt-1 text-sm font-medium">{product.tagline}</p>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-lg">{product.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <AddToQuoteButton showServiceUpgrades buildingSize={buildingSize} showSewerQuestion={isToiletBlock} toiletSize={toiletSize} product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "ablutions" }} />
                <a href="tel:0749792333" className="px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all">(07) 4979 2333</a>
                {product.floorPlan && (
                  <a href={product.floorPlan!} target="_blank" rel="noopener" className="px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Floor Plan PDF
                  </a>
                )}
              </div>
            </div>
            {/* Right: Image */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.name} className="w-full h-64 md:h-[28rem] object-cover" />
              {product.badge && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/90 text-white backdrop-blur-sm">
                  {product.badge}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {product.features.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5 hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <FloorplanViewer productId={product.slug} />
        </div>
      </section>

      {/* Specifications & Inclusions */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Specs */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden">
                {Object.entries(product.specifications).map(([key, val], i) => (
                  <div key={i} className={`flex items-start gap-3 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <span className="text-sm font-semibold text-gray-700 w-36 flex-shrink-0">{key}</span>
                    <span className="text-sm text-gray-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Inclusions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Standard Inclusions</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.standardInclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {product.floorPlan && (
                <a href={product.floorPlan!} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Download Floor Plan (PDF)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery (if multiple images) */}
      {product.images.length > 1 && (
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Gallery</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 shadow-lg shadow-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} - View ${i + 1}`} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Upgrades */}
      <PowerSiteRequirements buildingSize={buildingSize} />

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="ablutions" currentProductId={product.slug} />

      {/* Compare Products */}
      <CompareProducts
        currentSlug={product.slug}
        products={ALL_SLUGS.map((s) => {
          const p = PRODUCTS[s];
          return {
            id: p.slug,
            slug: p.slug,
            name: p.name,
            size: p.size,
            capacity: p.capacity,
            img: p.images[0],
            category: "ablutions" as const,
            href: `/hire/ablutions/${p.slug}`,
            badge: p.badge,
            highlights: [
              p.floorPlan ? "Floor plan available" : "Custom configuration",
              p.size === "Portable" ? "No connections required" : "Site connections needed",
              `${Object.keys(p.specifications).length}+ spec items`,
            ],
          };
        })}
      />

      {/* CTA */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Need the {product.name} on Your Site?
          </h2>
          <p className="text-white/50 mt-2">
            Tell us your location, crew size, and project timeline. We&apos;ll have a quote back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all flex items-center gap-2">
              Get a Free Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              (07) 4979 2333
            </a>
          </div>
        </div>
      </section>

      <MobileCTA />
    </ServiceUpgradesProvider>
  );
}
