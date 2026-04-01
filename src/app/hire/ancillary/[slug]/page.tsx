import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import CompareProducts from "@/components/CompareProducts";
import { HeroImage, GalleryGrid } from "@/components/ProductGallery";

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "5000l-tank-pump": {
    name: "5000L Tank & Pump Combo",
    slug: "5000l-tank-pump",
    tagline: "Potable Water Supply for Remote Sites",
    size: "Skid mounted",
    capacity: "5,000 litres",
    badge: "POPULAR",
    images: ["/images/products/5000l-tank-pump/1.jpg", "/images/products/5000l-tank-pump/2.jpg", "/images/products/5000l-tank-pump/3.jpg"],
    description: "The 5000L Tank & Pump Combo is a skid-mounted potable water supply system designed for portable buildings on remote worksites. Featuring a 5000-litre poly tank with integrated pressure pump, this unit provides reliable water supply to crib rooms, ablutions, and site offices without requiring connection to mains water infrastructure.",
    features: [
      { title: "5000L Capacity", desc: "Large-capacity polyethylene tank provides extended water supply between refills — ideal for remote sites with limited water truck access." },
      { title: "Integrated Pressure Pump", desc: "Built-in pressure pump delivers consistent water pressure to connected buildings for taps, sinks, and hot water systems." },
      { title: "Skid Mounted", desc: "Heavy-duty steel skid frame allows easy transport by crane or forklift. Can be repositioned on site as needs change." },
      { title: "Potable Water Rated", desc: "Food-grade polyethylene tank approved for potable (drinking) water storage. UV-stabilised for outdoor use." },
    ],
    specifications: {
      "Tank Capacity": "5,000 litres",
      "Tank Material": "Food-grade polyethylene (UV stabilised)",
      "Pump": "Integrated pressure pump system",
      "Mounting": "Heavy-duty steel skid frame",
      "Connections": "Standard fittings for building hookup",
      "Water Rating": "Potable (drinking water) approved",
      "Transport": "Crane or forklift via skid frame",
    },
    standardInclusions: [
      "5000L poly water tank",
      "Pressure pump system",
      "Steel skid mount frame",
      "Inlet and outlet fittings",
      "Isolation valves",
      "Connection hoses",
    ],
  },
  "6000l-waste-tank": {
    name: "6000L Waste Tank",
    slug: "6000l-waste-tank",
    tagline: "Large-Capacity Waste Collection",
    size: "6,000 litres",
    capacity: "Waste collection",
    badge: null,
    images: ["/images/products/6000l-waste-tank/1.jpg"],
    description: "The 6000L Waste Tank is a large-capacity waste water collection tank designed for use with portable ablution blocks, crib rooms, and toilet facilities. Positioned beneath or adjacent to buildings, this tank collects grey water and sewage for periodic pump-out by waste services, eliminating the need for sewer connections on remote sites.",
    features: [
      { title: "6000L Capacity", desc: "Large volume extends the time between pump-outs, reducing ongoing servicing costs and logistics on remote worksites." },
      { title: "Universal Compatibility", desc: "Standard fittings connect to any Multitrade ablution block, toilet facility, or crib room waste outlet." },
      { title: "Easy Pump-Out", desc: "Accessible pump-out point allows waste services to empty the tank quickly without disrupting site operations." },
      { title: "Durable Construction", desc: "Heavy-duty polyethylene construction is UV-stabilised and resistant to chemicals found in waste water." },
    ],
    specifications: {
      "Capacity": "6,000 litres",
      "Material": "Heavy-duty polyethylene (UV stabilised)",
      "Connections": "Standard waste inlet fittings",
      "Pump-Out": "Accessible pump-out connection point",
      "Placement": "Ground level beside or beneath buildings",
    },
    standardInclusions: [
      "6000L poly waste tank",
      "Inlet fittings and connections",
      "Pump-out access point",
      "Vent pipe",
    ],
  },
  "4000l-waste-tank": {
    name: "4000L Waste Tank",
    slug: "4000l-waste-tank",
    tagline: "Mid-Size Waste Collection for Smaller Sites",
    size: "4,000 litres",
    capacity: "Waste collection",
    badge: null,
    images: ["/images/products/4000l-waste-tank/1.jpg"],
    description: "The 4000L Waste Tank is a mid-size waste water collection tank suited to smaller sites or buildings with lower usage volumes. Ideal for single toilet blocks, small crib rooms, or sites where space constraints limit the size of waste infrastructure.",
    features: [
      { title: "4000L Capacity", desc: "Right-sized for smaller crews and buildings — avoids the cost and footprint of larger waste tanks where they're not needed." },
      { title: "Compact Footprint", desc: "Smaller physical size fits into tighter site layouts and under buildings where larger tanks won't work." },
      { title: "Standard Fittings", desc: "Compatible with all Multitrade portable buildings. Standard inlet connections for quick hookup on delivery." },
      { title: "Easy Servicing", desc: "Accessible pump-out point for regular waste removal by licensed waste services." },
    ],
    specifications: {
      "Capacity": "4,000 litres",
      "Material": "Heavy-duty polyethylene (UV stabilised)",
      "Connections": "Standard waste inlet fittings",
      "Pump-Out": "Accessible pump-out connection point",
      "Placement": "Ground level beside or beneath buildings",
    },
    standardInclusions: [
      "4000L poly waste tank",
      "Inlet fittings and connections",
      "Pump-out access point",
      "Vent pipe",
    ],
  },
  "12x3m-covered-deck": {
    name: "12x3m Covered Deck",
    slug: "12x3m-covered-deck",
    tagline: "Weatherproof Walkway & Outdoor Break Area",
    size: "12m × 3m",
    capacity: "Walkway / deck",
    badge: null,
    images: ["/images/products/12x3m-covered-deck/1.jpg", "/images/products/12x3m-covered-deck/2.jpg", "/images/products/12x3m-covered-deck/3.jpg", "/images/products/12x3m-covered-deck/4.jpg", "/images/products/12x3m-covered-deck/5.jpg", "/images/products/12x3m-covered-deck/6.jpg", "/images/products/12x3m-covered-deck/7.jpg"],
    description: "The 12x3m Covered Deck is a weatherproof covered walkway and outdoor break area designed to connect portable building modules. Providing shelter from rain, sun, and heat, this deck creates a comfortable transition space between buildings and an outdoor area for crews to take breaks in fresh air while staying protected from the elements.",
    features: [
      { title: "Weather Protection", desc: "Colorbond roofing and steel frame provide shelter from rain, sun, and heat between connected building modules." },
      { title: "Building Connector", desc: "Designed to sit between portable buildings, creating covered walkways for safe, dry access in all weather conditions." },
      { title: "Outdoor Break Space", desc: "Open-sided design provides fresh air while the roof protects from sun and rain — ideal for smoko breaks." },
      { title: "Modular Integration", desc: "Matches standard 12x3m building dimensions for seamless connection to crib rooms, offices, and ablution blocks." },
    ],
    specifications: {
      "Dimensions": "12,000mm (L) × 3,000mm (W)",
      "Roof": "Colorbond steel roofing",
      "Frame": "Steel frame construction",
      "Floor": "Steel chequer plate or timber decking",
      "Sides": "Open (optional mesh or balustrade)",
      "Mounting": "Bolts to adjacent building modules",
    },
    standardInclusions: [
      "Colorbond steel roof",
      "Steel frame structure",
      "Decking / floor surface",
      "Connection hardware for adjacent buildings",
      "Stormwater guttering",
    ],
  },
  "40ft-flat-rack": {
    name: "40ft Flat Rack",
    slug: "40ft-flat-rack",
    tagline: "Open Transport Platform for Oversized Cargo",
    size: "40ft (12.19m × 2.44m)",
    capacity: "Heavy loads",
    badge: null,
    images: ["/images/products/40ft-flat-rack/1.jpg"],
    description: "The 40ft Flat Rack is an open-sided transport and storage platform designed for oversized cargo, heavy equipment, and irregular loads that won't fit inside a standard container. With fold-down end walls and standard corner castings, flat racks are used for transporting machinery, pipe, structural steel, and large fabricated items.",
    features: [
      { title: "Open-Sided Loading", desc: "No side walls means loading from any direction with cranes, forklifts, or overhead gantries — no size restrictions on width." },
      { title: "Fold-Down End Walls", desc: "Collapsible end walls allow flat racks to be stacked when empty, saving space in storage yards and during return transport." },
      { title: "Heavy-Duty Construction", desc: "Reinforced steel frame and heavy-duty floor designed for extreme payloads including machinery, pipe, and structural steel." },
      { title: "Standard Container Fittings", desc: "ISO corner castings, forklift pockets, and twist-lock points allow handling with standard container equipment." },
    ],
    specifications: {
      "External Dimensions": "12,192mm (L) × 2,438mm (W)",
      "Construction": "Heavy-gauge steel frame",
      "End Walls": "Fold-down / collapsible",
      "Floor": "Steel / heavy-duty timber",
      "Corner Castings": "ISO standard twist-lock points",
      "Forklift Pockets": "Standard positions",
      "Lashing Points": "Multiple D-rings for cargo securing",
    },
    standardInclusions: [
      "Fold-down end walls",
      "ISO corner castings",
      "Forklift pockets",
      "D-ring lashing points",
      "Heavy-duty floor surface",
    ],
  },
  "stair-landing": {
    name: "Stair & Landing",
    slug: "stair-landing",
    tagline: "Portable Access & Egress for Elevated Buildings",
    size: "Various configurations",
    capacity: "Access / egress",
    badge: null,
    images: ["/images/products/stair-landing/1.jpg"],
    description: "Portable stair and landing systems provide safe, compliant access and egress for elevated portable buildings. Available in various configurations to suit different building heights and site requirements, these units are essential for any raised portable building installation. Designed to meet Australian building codes and workplace safety standards.",
    features: [
      { title: "Code Compliant", desc: "Designed to meet Australian Building Code and workplace safety requirements for stairs, handrails, and landings." },
      { title: "Various Configurations", desc: "Available in single-flight, double-flight, and platform landing configurations to suit different building heights." },
      { title: "Portable & Relocatable", desc: "Bolt-on connection to buildings allows easy removal and reinstallation when buildings are relocated." },
      { title: "Safety Features", desc: "Anti-slip treads, handrails on both sides, and kick plates provide safe access in all weather conditions including rain and dust." },
    ],
    specifications: {
      "Material": "Galvanised or painted steel",
      "Treads": "Anti-slip steel or aluminium",
      "Handrails": "Both sides, compliant height",
      "Landing": "Platform landing at building entry",
      "Connection": "Bolt-on to building frame",
      "Compliance": "Australian Building Code standards",
    },
    standardInclusions: [
      "Stair flight(s)",
      "Platform landing",
      "Handrails both sides",
      "Anti-slip treads",
      "Kick plates",
      "Bolt-on connection hardware",
    ],
  },
  "dual-hand-wash-station": {
    name: "Dual Hand Wash Station",
    slug: "dual-hand-wash-station",
    tagline: "Standalone Hygiene Station with Hot & Cold Water",
    size: "Compact freestanding",
    capacity: "2 users simultaneously",
    badge: null,
    images: ["/images/products/dual-hand-wash-station/1.jpg"],
    description: "The Dual Hand Wash Station is a standalone, freestanding hand washing unit with hot and cold water taps for two simultaneous users. Ideal for placement at crib room entrances, toilet facilities, and site entry points, this unit supports workplace hygiene requirements without requiring plumbing to a building.",
    features: [
      { title: "Dual Basin Design", desc: "Two wash stations allow simultaneous hand washing, reducing queues at shift changes and meal breaks." },
      { title: "Hot & Cold Water", desc: "Mixer taps with hot water supply ensure comfortable hand washing and effective hygiene in all weather conditions." },
      { title: "Freestanding Unit", desc: "Self-supporting design can be placed anywhere on site without mounting to a building — ideal for entry/exit points." },
      { title: "Hygiene Compliance", desc: "Meets workplace health and hygiene requirements for hand washing facilities near food preparation and toilet areas." },
    ],
    specifications: {
      "Configuration": "Dual basin (2 users)",
      "Water Supply": "Hot and cold mixer taps",
      "Material": "Stainless steel basins",
      "Mounting": "Freestanding / self-supporting",
      "Waste": "Connection to waste system or tank",
      "Water Connection": "Standard plumbing fittings",
    },
    standardInclusions: [
      "Dual stainless steel wash basins",
      "Hot & cold mixer taps",
      "Freestanding frame",
      "Waste outlet connection",
      "Water inlet connections",
      "Soap dispenser mounts",
    ],
  },
  "wash-trough": {
    name: "Wash Trough",
    slug: "wash-trough",
    tagline: "Heavy-Duty Boot Wash & Equipment Cleaning",
    size: "Various lengths",
    capacity: "Multiple users",
    badge: null,
    images: ["/images/products/wash-trough/1.jpg"],
    description: "The Wash Trough is a heavy-duty stainless steel trough designed for boot washing, equipment cleaning, and general wash-down at site entry points. Essential for maintaining hygiene standards on mining and construction sites, these troughs are built to withstand heavy daily use and harsh site conditions.",
    features: [
      { title: "Heavy-Duty Construction", desc: "Industrial-grade stainless steel withstands the rigours of daily boot washing, tool cleaning, and heavy site use." },
      { title: "Multiple User Capacity", desc: "Extended trough length accommodates several workers washing boots simultaneously at shift changes." },
      { title: "Hygiene Compliance", desc: "Supports site hygiene protocols for boot wash and decontamination at designated entry and exit points." },
      { title: "Simple Installation", desc: "Connect to water supply and waste drainage. Robust design requires minimal ongoing maintenance." },
    ],
    specifications: {
      "Material": "Industrial-grade stainless steel",
      "Configuration": "Multi-user wash trough",
      "Water Supply": "Cold water connection",
      "Waste": "Drainage outlet for waste connection",
      "Mounting": "Floor mounted or freestanding",
    },
    standardInclusions: [
      "Stainless steel wash trough",
      "Water inlet connection",
      "Waste drainage outlet",
      "Mounting hardware",
      "Taps / water outlets",
    ],
  },
};

interface Product {
  name: string; slug: string; tagline: string; size: string; capacity: string;
  badge: string | null;
  images: string[]; description: string;
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
    title: `${p.name} Hire | Ancillary Equipment QLD — Multitrade`,
    description: `Hire the ${p.name}. ${p.tagline}. ${p.capacity}. Delivered across Queensland. Multitrade Building Hire.`,
  };
}

export default function AncillaryDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug];
  if (!product) notFound();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <Link href="/hire/ancillary" className="hover:text-white/60">Ancillary</Link><span>/</span>
            <span className="text-white/80 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
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
                <AddToQuoteButton product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "ancillary" }} />
                <a href="tel:0749792333" className="px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all">(07) 4979 2333</a>
              </div>
            </div>
            <HeroImage images={product.images} alt={product.name} badge={product.badge} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {product.features.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all">
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
        </div>
      </section>

      {/* Specifications & Inclusions */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
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
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <GalleryGrid images={product.images} alt={product.name} />

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
            category: "ancillary" as const,
            href: `/hire/ancillary/${p.slug}`,
            badge: p.badge,
            highlights: [
              p.capacity,
              p.size,
              `${Object.keys(p.specifications).length} spec items`,
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
            Tell us your requirements and we&apos;ll have a quote back to you within 24 hours.
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
    </>
  );
}
