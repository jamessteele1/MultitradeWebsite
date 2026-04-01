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
import { HeroImage, GalleryGrid } from "@/components/ProductGallery";

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "12x3m-crib-room": {
    name: "12x3m Crib Room",
    slug: "12x3m-crib-room",
    tagline: "Spacious Break Facility for Large Crews",
    size: "1200cm × 300cm",
    capacity: "Up to 30 persons",
    badge: "POPULAR",
    selfContained: false,
    mobile: false,
    images: ["/images/products/12x3-crib-room/1.jpg", "/images/products/12x3-crib-room/2.jpg", "/images/products/12x3-crib-room/3.jpg", "/images/products/12x3-crib-room/4.jpg"],
    floorPlan: "/images/floorplans/MBH-12030-CRB-01-A-12x3m-Crib-Room.pdf",
    description: "The 12.0m × 3.0m Crib Room is a spacious, fully equipped portable break facility designed to comfortably accommodate up to 30 workers. Built on a 75mm steel frame with Colorbond steel cladding and fully insulated walls and ceiling, this unit delivers a cool, comfortable environment even in Central Queensland's toughest conditions.",
    features: [
      { title: "Dual Climate Control", desc: "2 × 3.9kW TECO reverse cycle mounted air conditioners ensure the entire space stays comfortable year-round." },
      { title: "Full Electrical Fit-Out", desc: "Lockable internal switchboard, double pole main switch, safety switch (RCD), LED fluorescent lighting throughout, and GPOs." },
      { title: "Complete Kitchenette", desc: "1200mm laminate bench with stainless steel sink, instant boiling water unit, and space for appliances." },
      { title: "Durable Construction", desc: "75mm steel frame, Colorbond steel external cladding, commercial-grade vinyl flooring, and aluminium windows with screens." },
    ],    specifications: {
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "2 × 2040×920mm external metal clad doors",
      "Windows": "4 × 1210×610mm aluminium sliding with flyscreens",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "2 × 3.9kW TECO reverse cycle",
      "Kitchenette": "1200mm bench with stainless steel sink",
    },
    standardInclusions: [
      "2 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
      "5 × Crib Tables", "24 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
      "1 × Stainless Steel Sink with Mixer Tap", "1 × Cutlery Drainer", "1 × First Aid Kit",
      "1 × Fire Blanket", "1 × Fire Extinguisher", "2 × Smoke Detectors",
    ],
  },
  "6x3m-crib-room": {
    name: "6x3m Crib Room",
    slug: "6x3m-crib-room",
    tagline: "Compact & Versatile Crew Break Space",
    size: "600cm × 300cm",
    capacity: "Up to 15 persons",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/6x3-crib/1.jpg", "/images/products/6x3-crib/2.jpg", "/images/products/6x3-crib/3.jpg"],
    floorPlan: "/images/floorplans/MBH-6030-CRB-01-A-6x3m-Crib-Room.pdf",    description: "The 6.0m × 3.0m Crib Room is a versatile and durable portable break facility designed to provide a comfortable space for up to 15 workers. Equipped with climate control, a convenient kitchenette, and robust steel frame construction, this unit is ideal for smaller crews on mining, construction, and industrial sites.",
    features: [
      { title: "Climate Controlled", desc: "1 × 3.9kW TECO reverse cycle air conditioner for year-round comfort in any conditions." },
      { title: "Convenient Kitchenette", desc: "1200mm laminate bench with stainless steel sink, instant boiling water unit, and benchtop space for appliances." },
      { title: "Secure & Safe", desc: "Lockable internal switchboard with double pole main switch, safety switch (RCD), and LED lighting throughout." },
      { title: "Durable Build", desc: "75mm steel frame, Colorbond cladding, insulated walls and ceiling, commercial vinyl flooring." },
    ],
    specifications: {
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "1 × 2040×920mm external metal clad door",
      "Windows": "2 × 1210×610mm aluminium sliding with flyscreens",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "1 × 3.9kW TECO reverse cycle",
      "Kitchenette": "1200mm bench with stainless steel sink",
    },
    standardInclusions: [
      "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
      "3 × Crib Tables", "12 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
      "1 × Stainless Steel Sink with Mixer Tap", "1 × Cutlery Drainer", "1 × First Aid Kit",
      "1 × Fire Blanket", "1 × Fire Extinguisher", "1 × Smoke Detector",
    ],
  },  "12x3m-mobile-crib": {
    name: "12x3m Mobile Crib Room",
    slug: "12x3m-mobile-crib",
    tagline: "Fully Transportable, Self-Sufficient Break Facility",
    size: "1250cm × 300cm",
    capacity: "Up to 20 persons",
    badge: "SELF-CONTAINED",
    selfContained: true,
    mobile: true,
    images: ["/images/products/12x3-mobile-crib-room/1.jpg", "/images/products/12x3-mobile-crib-room/2.jpg", "/images/products/12x3-mobile-crib-room/3.jpg", "/images/products/12x3-mobile-crib-room/4.jpg", "/images/products/12x3-mobile-crib-room/5.jpg", "/images/products/12x3-mobile-crib-room/6.jpg", "/images/products/12x3-mobile-crib-room/7.jpg", "/images/products/12x3-mobile-crib-room/8.jpg", "/images/products/12x3-mobile-crib-room/9.jpg", "/images/products/12x3-mobile-crib-room/10.jpg", "/images/products/12x3-mobile-crib-room/11.jpg", "/images/products/12x3-mobile-crib-room/12.jpg", "/images/products/12x3-mobile-crib-room/13.jpg", "/images/products/12x3-mobile-crib-room/14.jpg", "/images/products/12x3-mobile-crib-room/15.jpg", "/images/products/12x3-mobile-crib-room/16.jpg", "/images/products/12x3-mobile-crib-room/17.jpg", "/images/products/12x3-mobile-crib-room/18.jpg", "/images/products/12x3-mobile-crib-room/19.jpg", "/images/products/12x3-mobile-crib-room/20.jpg", "/images/products/12x3-mobile-crib-room/21.jpg", "/images/products/12x3-mobile-crib-room/22.jpg"],
    video: "/images/products/12x3-mobile-crib-room/video.mp4",
    floorPlan: "/images/floorplans/SQF-4491-01-A-12.5x3m-Mobile-Crib-Room.pdf",
    description: "The 12.5m × 3.0m Mobile Crib Room is a self-sufficient, fully transportable lunch and break facility built on a heavy-duty trailer with air brakes, suspension, and dual axles. Powered by an 11.2kVA Kubota diesel generator with dual 1000L water tanks, this unit requires zero external connections — just park and go.",
    features: [
      { title: "Fully Mobile & Self-Contained", desc: "Built on a heavy-duty trailer with air brakes, suspension, and dual axles. Tow directly to site with no crane required." },
      { title: "Self-Sufficient Power", desc: "11.2kVA Kubota Lowboy Series diesel generator provides reliable mine-spec power for all onboard systems." },
      { title: "Onboard Water System", desc: "2 × 1000L fresh water tanks with pressure pump system, plus grey water tank for complete independence." },
      { title: "Mine Spec Compliant", desc: "Full mine-spec electrical, LED lighting, emergency exits, fire suppression, and safety equipment throughout." },
    ],
    specifications: {
      "Dimensions": "1250cm (L) × 300cm (W)",
      "Trailer": "Single front axle, dual rear axle, air brakes, suspension",
      "Generator": "11.2kVA Kubota Lowboy Series 2 mine spec diesel",
      "Water": "2 × 1000L fresh water tanks + grey water tank",
      "Air Conditioning": "2 × 3.5kW reverse cycle units",
      "Kitchenette": "Full-size kitchenette with dual sinks",
      "Electrical": "Mine-spec switchboard, RCD, LED lighting",
      "Safety": "Emergency exits, fire extinguisher, first aid, smoke detectors",
    },
    standardInclusions: [
      "2 × 240L Fridge", "1 × 17L Microwave", "1 × Pie Warmer",
      "5 × Crib Tables", "20 × Crib Chairs", "1 × Instant Boiling Water Unit",
      "2 × Stainless Steel Sinks", "1 × First Aid Kit",
      "Fire Blanket & Extinguisher", "Smoke Detectors", "Pressure Pump System",
    ],
  },  "6-6x3m-self-contained": {
    name: "6.6x3m Self-Contained Crib",
    slug: "6-6x3m-self-contained",
    tagline: "Compact Self-Contained Break Facility",
    size: "660cm × 300cm",
    capacity: "Up to 8 persons",
    badge: "SELF-CONTAINED",
    selfContained: true,
    mobile: false,
    images: ["/images/products/66x3m-self-contained-crib/1.jpg", "/images/products/66x3m-self-contained-crib/2.jpg"],
    floorPlan: null,
    description: "The 6.6m × 3.0m Self-Contained Crib Room is a compact and versatile break facility designed for remote worksites, mining camps, and construction projects. With an onboard generator, 230L fresh water tank, pressure pump, and grey water system, this unit eliminates the need for sub-trades — it's ready to work straight off the truck.",
    features: [
      { title: "Self-Contained Design", desc: "Includes generator, 230L water tank, and pressure pump for completely independent operation with no external connections." },
      { title: "Compact & Efficient", desc: "At 6.6m × 3.0m, this unit fits easily on tight sites while still providing comfortable seating for up to 8 workers." },
      { title: "Kitchen Facilities", desc: "1200mm kitchenette with stainless steel sink, instant boiling water, and benchtop space for microwave and pie warmer." },
      { title: "Ready to Deploy", desc: "Delivered complete with furniture, appliances, and all safety equipment. Operating within minutes of delivery." },
    ],
    specifications: {
      "Dimensions": "660cm (L) × 300cm (W)",
      "Doors": "1 × 2040×880mm external metal clad door",
      "Windows": "2 × 1210×610mm aluminium sliding with flyscreens",
      "Water": "230L fresh water tank + 230L grey water tank",
      "Power": "Onboard generator",
      "Air Conditioning": "1 × reverse cycle split system",
      "Flooring": "Commercial-grade vinyl",
      "Construction": "Steel frame, Colorbond cladding, insulated",
    },
    standardInclusions: [
      "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
      "2 × Crib Tables", "8 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
      "1 × Stainless Steel Sink with Mixer Tap", "Pressure Pump System",
      "1 × First Aid Kit", "1 × Fire Blanket", "1 × Fire Extinguisher", "Smoke Detectors",
    ],
  },  "7-2x3m-self-contained": {
    name: "7.2x3m Self-Contained Crib",
    slug: "7-2x3m-self-contained",
    tagline: "Standalone Crib Room with Integrated Bathroom",
    size: "720cm × 300cm",
    capacity: "Up to 15 persons",
    badge: "SELF-CONTAINED",
    selfContained: true,
    mobile: false,
    images: ["/images/products/72x3m-self-contained-crib/1.jpg", "/images/products/72x3m-self-contained-crib/2.jpg"],
    floorPlan: "/images/floorplans/SQF-3321-01-1-7.2x3m-Site-Crib-Room.pdf",
    description: "The 7.2m × 3.0m Self-Contained Site Crib Room is a highly versatile standalone unit providing a fully functional break space for remote worksites. Powered by a 6kVA Kubota Lowboy Series 2 mine-spec diesel generator with 230L water storage, this unit requires no external connections. The integrated bathroom makes it ideal for isolated locations.",
    features: [
      { title: "Self-Sufficient Power", desc: "6kVA Kubota Lowboy Series 2 mine-spec diesel generator provides reliable power in remote locations without mains connection." },
      { title: "Integrated Bathroom", desc: "Built-in bathroom facilities with shower, toilet, and hand basin — no separate ablution block required." },
      { title: "Full Kitchen Facilities", desc: "Complete kitchenette with stainless steel sink, instant boiling water unit, and space for all standard appliances." },
      { title: "Mine Spec Compliant", desc: "Full mine-spec electrical fit-out with safety switch, LED lighting, and emergency equipment throughout." },
    ],
    specifications: {
      "Dimensions": "720cm (L) × 300cm (W)",
      "Generator": "6kVA Kubota Lowboy Series 2 mine spec diesel",
      "Water": "230L fresh water tank + grey water system",
      "Bathroom": "Integrated shower, toilet & hand basin",
      "Air Conditioning": "1 × reverse cycle split system",
      "Electrical": "Mine-spec switchboard, RCD, LED lighting",
      "Construction": "Steel frame, Colorbond cladding, fully insulated",
      "Flooring": "Commercial-grade vinyl",
    },
    standardInclusions: [
      "1 × 240L Fridge (all fridge)", "1 × 17L Microwave", "1 × Pie Warmer (50 Pie)",
      "2 × Crib Tables", "8 × Crib Chairs", "1 × Instant Boiling Water Unit (Zip)",
      "1 × Stainless Steel Sink with Mixer Tap", "Shower, Toilet & Basin",
      "Pressure Pump System", "1 × First Aid Kit", "Fire Blanket & Extinguisher", "Smoke Detectors",
    ],
  },  "9-6x3m-living-quarters": {
    name: "9.6x3m Living Quarters",
    slug: "9-6x3m-living-quarters",
    tagline: "Self-Contained Remote Accommodation Unit",
    size: "960cm × 300cm",
    capacity: "1–2 persons",
    badge: "ACCOMMODATION",
    selfContained: true,
    mobile: false,
    images: ["/images/products/96x3m-living-quarters/1.jpg", "/images/products/96x3m-living-quarters/2.jpg", "/images/products/96x3m-living-quarters/3.jpg", "/images/products/96x3m-living-quarters/4.jpg", "/images/products/96x3m-living-quarters/5.jpg"],
    floorPlan: "/images/floorplans/MBH-9630-CRB-01-9.6x3m-Crib-Room.pdf",
    description: "The 9.6m × 3.0m Living Quarters is a fully self-contained, transportable accommodation unit designed for remote site managers, supervisors, and key personnel. Featuring a private bedroom, ensuite bathroom with shower and toilet, and a full kitchen/living area, this unit delivers genuine comfort and privacy in even the most isolated locations.",
    features: [
      { title: "Private Living Space", desc: "Separate bedroom, ensuite bathroom, and living area provide genuine comfort and privacy for extended remote deployments." },
      { title: "Fully Equipped Kitchen", desc: "Complete kitchen with sink, benchtop, and space for fridge, microwave, and cooking appliances." },
      { title: "Ensuite Bathroom", desc: "Private bathroom with shower, toilet, and vanity basin — no shared facilities required." },
      { title: "Climate Controlled", desc: "Split system reverse cycle air conditioning ensures comfortable temperatures year-round." },
    ],
    specifications: {
      "Dimensions": "960cm (L) × 300cm (W)",
      "Doors": "1 × 2100×1800mm aluminium sliding entry + internal doors",
      "Bedroom": "Private room with built-in wardrobe",
      "Bathroom": "Ensuite with shower, toilet & vanity",
      "Kitchen": "Full kitchenette with sink and benchtop",
      "Air Conditioning": "Split system reverse cycle",
      "Construction": "Steel frame, Colorbond cladding, fully insulated",
      "Flooring": "Commercial-grade vinyl throughout",
    },
    standardInclusions: [
      "Single Bed Frame & Mattress", "Built-in Wardrobe", "1 × 240L Fridge",
      "1 × Microwave", "Kitchen Table & Chairs", "Shower & Toilet",
      "Vanity Basin with Mirror", "Split System AC", "LED Lighting Throughout",
      "Smoke Detectors", "Fire Extinguisher", "First Aid Kit",
    ],
  },
};
interface Product {
  name: string; slug: string; tagline: string; size: string; capacity: string;
  badge: string | null; selfContained: boolean; mobile: boolean;
  images: string[]; floorPlan: string | null; video?: string; description: string;
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
    title: `${p.name} Hire | Portable Crib Rooms QLD — Multitrade`,
    description: `Hire the ${p.name} for your worksite. ${p.tagline}. ${p.capacity}. Delivered across Central Queensland. 45+ years experience.`,
  };
}
export default function CribRoomDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug];
  if (!product) notFound();

  const buildingSize: "12x3" | "6x3" | "3x3" | "other" = product.size.startsWith("12") ? "12x3" : product.size.startsWith("6") ? "6x3" : product.size.startsWith("3") ? "3x3" : "other";

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
            <Link href="/hire/crib-rooms" className="hover:text-white/60">Crib Rooms</Link><span>/</span>
            <span className="text-white/80 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.badge && <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{product.badge}</span>}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.size}</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.capacity}</span>
              </div>              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{product.name}</h1>
              <p className="text-white/50 mt-1 text-sm font-medium">{product.tagline}</p>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-lg">{product.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <AddToQuoteButton showServiceUpgrades buildingSize={buildingSize} product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "crib-rooms" }} />
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
            <HeroImage images={product.images} alt={product.name} badge={product.selfContained ? (product.mobile ? "MOBILE • SELF-CONTAINED" : "SELF-CONTAINED") : null} />
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
          <FloorplanViewer productId={product.slug} />
        </div>
      </section>
      {/* See It in Action — video section, placed right after features */}
      {product.video && (
        <section className="py-10 md:py-14 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">See It in Action</h2>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full"
              >
                <source src={product.video} type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      )}

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
              </div>              {product.floorPlan && (
                <a href={product.floorPlan!} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Download Floor Plan (PDF)
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <GalleryGrid images={product.images} alt={product.name} />
      {/* Service Upgrades */}
      <PowerSiteRequirements buildingSize={buildingSize} />

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="crib-rooms" currentProductId={product.slug} />

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
            category: "crib-rooms" as const,
            href: `/hire/crib-rooms/${p.slug}`,
            badge: p.badge,
            highlights: [
              p.selfContained ? "Self-contained" : "Requires site connections",
              p.mobile ? "Mobile / towable" : "Crane delivery",
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