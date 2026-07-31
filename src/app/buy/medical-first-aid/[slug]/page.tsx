import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import SuggestedAddOns from "@/components/SuggestedAddOns";
import FloorplanViewer from "@/components/FloorplanViewer";
import PowerSiteRequirements from "@/components/PowerSiteRequirements";
import { ServiceUpgradesProvider } from "@/context/ServiceUpgradesContext";
import { HeroImage, GalleryGrid } from "@/components/ProductGallery";

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "15x3-4m-first-aid-room": {
    name: "15x3.4m First Aid Room",
    slug: "15x3-4m-first-aid-room",
    tagline: "Mine-Spec First Aid Room for Site Medical Teams",
    size: "1500cm × 340cm",
    capacity: "2 Treatment Bays",
    badge: "NEW",
    selfContained: false,
    mobile: false,
    images: [
      "/images/products/15x3-4m-first-aid-room/2.jpg",
      "/images/products/15x3-4m-first-aid-room/3.jpg",
      "/images/products/15x3-4m-first-aid-room/1.jpg",
      "/images/products/15x3-4m-first-aid-room/4.jpg",
      "/images/products/15x3-4m-first-aid-room/5.jpg",
    ],
    floorPlan: null,
    description:
      "A 15.0m × 3.4m purpose-built medical building, C2 wind rated and delivered fully fitted out. Treatment bay, separate consult room, secure drug safe, PWD-accessible ensuite and a dedicated admin area — everything a site health and safety team needs in one building. Manufactured off site and delivered ready to connect, so the majority of the build happens in a controlled factory environment rather than on your operating site. Custom sizes and layouts available.",
    features: [
      { title: "Clinical Treatment Area", desc: "Dedicated treatment bay with patient beds, privacy curtain and clinical storage, separate from the consult room." },
      { title: "PWD-Accessible Ensuite", desc: "Shower with graded floor to waste, folding bench seat, grab rails and lever mixer, plus PWD pan and hand basin." },
      { title: "Secure Medication Storage", desc: "DSK6 drug safe and lockable metal storage cabinet for controlled drugs and consumables." },
      { title: "Triple Climate Control", desc: "2 × 2.6kW and 1 × 5.0kW MHI reverse cycle split systems, external units on a chassis extension to keep the walkway clear." },
    ],
    specifications: {
      "Dimensions": "15.0m × 3.4m (3.2m internal width)",
      "Frame": "75mm steel frame, 310UB32 chassis bearers, C10015 floor joists at 600mm centres",
      "Wind Rating": "C2 wind rated",
      "External Cladding": "Colorbond — Surfmist cladding, capping, gutters and downpipes",
      "Roof": "Zincalume, 2° roof pitch",
      "Internal Lining": "Grey walls, white ceiling, white cabinetry, grey doors",
      "Flooring": "Commercial grade grey vinyl",
      "Doors": "1 × 2.2m metal clad double entry door with closer, plus single external doors — Surfmist",
      "Windows": "Sliding aluminium windows, Surfmist frames, with roller blinds",
      "Electrical": "Lockable distribution board, 10kA rated double pole main switch, RCD protection, LED lighting, GPOs throughout, external weatherproof GPO, 3 × 600mm external lights",
      "Air Conditioning": "2 × 2.6kW and 1 × 5.0kW MHI reverse cycle split systems, external units on chassis extension",
      "Hot Water": "125L electric hot water system on chassis extension, plus 2 × 3L wall-mounted boiling water units",
      "Plumbing": "Single water inlet and waste water outlet, PWD-compliant wet area",
    },
    standardInclusions: [
      "2 × Patient Beds", "Privacy Curtain & Track", "Drug Safe — DSK6 (500W × 300D × 800H)",
      "Metal Storage Cabinet (910W × 450D × 1830H)", "3750mm × 750mm Workbench with Pedestal",
      "2 × Desks (1500 × 750) with Pedestals", "2 × Office Chairs",
      "1500mm Kitchenette Benchtop & Splashback", "Single Bowl & Drainer Sink", "2 × Bar Fridges",
      "2 × 3L Instant Boiling Water Units", "PWD Toilet Pan, Back Rest & Grab Rails",
      "PWD Hand Basin, Mirror & Shelf", "PWD Shower — Folding Bench Seat & Grab Rails",
      "Smoke Detectors", "Emergency Exit Signage",
    ],
    medicalAddOns: [
      { title: "Respiratory Fit Testing System", desc: "Tablet-based quantitative fit testing with unlimited test credits." },
      { title: "Electric Transfer Stretcher", desc: "Electric hi/lo and backrest, knee break, USB charging port." },
      { title: "Drug & Alcohol Testing Room", desc: "Separate testing room fitout with bench, basin and privacy." },
      { title: "Covered Deck, Stairs & Landings", desc: "Compliant access and shaded entry to suit the 15m length." },
    ],
  },
};

interface Product {
  name: string; slug: string; tagline: string; size: string; capacity: string;
  badge: string | null; selfContained: boolean; mobile: boolean;
  images: string[]; floorPlan: string | null; description: string;
  features: { title: string; desc: string }[];
  specifications: Record<string, string>;
  standardInclusions: string[];
  medicalAddOns: { title: string; desc: string }[];
}

const ALL_SLUGS = Object.keys(PRODUCTS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PRODUCTS[params.slug];
  if (!p) return {};
  return {
    title: "15x3.4m First Aid Room for Sale | Mine-Spec Medical Facility — Multitrade Building Hire",
    description:
      "Purpose-built 15x3.4m first aid and medical building for sale. C2 wind rated, PWD ensuite, secure drug safe and full clinical fitout. Built for Queensland mine sites. Request a purchase price.",
    alternates: { canonical: "https://www.multitrade.com.au/buy/medical-first-aid/15x3-4m-first-aid-room" },
    openGraph: { images: ["/images/products/15x3-4m-first-aid-room/2.jpg"] },
  };
}

export default function FirstAidRoomDetailPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug];
  if (!product) notFound();

  const buildingSize = "other" as const;

  return (
    <ServiceUpgradesProvider>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/buy" className="hover:text-white/60">Buy</Link><span>/</span>
            <Link href="/buy/medical-first-aid" className="hover:text-white/60">Medical &amp; First Aid</Link><span>/</span>
            <span className="text-white/80 font-medium">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.badge && <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{product.badge}</span>}
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.size}</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">{product.capacity}</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">Mine Spec</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium text-white/60 border border-white/15">C2 Wind Rated</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">{product.name}</h1>
              <p className="text-white/50 mt-1 text-sm font-medium">{product.tagline}</p>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-lg">{product.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <AddToQuoteButton showServiceUpgrades buildingSize={buildingSize} product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "medical-first-aid" }} />
                <a href="tel:0749792333" className="px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all">(07) 4979 2333</a>
              </div>
            </div>
            {/* Right: Image */}
            <HeroImage images={product.images} alt={product.name} badge={null} />
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
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <FloorplanViewer productId={product.slug} />
          </div>
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
            </div>
          </div>

          {/* Medical equipment & add-ons */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Equipment &amp; Add-Ons</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {product.medicalAddOns.map((f, i) => (
                <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white">
                  <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <GalleryGrid images={product.images} alt={product.name} />

      {/* Service Upgrades */}
      <PowerSiteRequirements buildingSize={buildingSize} />

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="medical-first-aid" currentProductId={product.slug} />

      {/* CTA */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Need a First Aid Room for Your Site?
          </h2>
          <p className="text-white/50 mt-2">
            Built to your scope, delivered fully fitted out and installed by our own crews. Custom sizes and layouts available.
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
