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
  "12x6m-complex": {
    name: "12x6m Complex",
    slug: "12x6m-complex",
    tagline: "Two-Module Facility for Combined Site Functions",
    size: "1200cm × 600cm",
    capacity: "Up to 24",
    badge: "POPULAR",
    selfContained: false,
    mobile: false,
    images: ["/images/products/12x6m-complex/1.jpg", "/images/products/12x6m-complex/2.jpg", "/images/products/12x6m-complex/3.jpg"],
    floorPlan: "/images/floorplans/SQF-3219-02-A - 12.0x6.0m Office Complex - Floor Plan.pdf",
    description: "The 12.0m × 6.0m Complex combines two 12x3m modules into a single 72m² facility. With a flexible internal layout, it can be configured as open-plan office space, partitioned offices, a combined office and crib room, or mixed-use site accommodation. A go-to solution for medium-to-large projects requiring more than a single module under one roof.",
    features: [
      { title: "72m² of Flexible Space", desc: "Two combined modules give you a generous footprint that can be partitioned to suit offices, meeting rooms, crib areas, or any mix of site functions." },
      { title: "Configure to Your Needs", desc: "Open plan, partitioned offices, or a combined office and crib room — we build the internal layout to match how your team works on site." },
      { title: "Full Climate Control", desc: "Multiple reverse cycle air conditioners maintain comfortable working temperatures across the full footprint of the complex." },
      { title: "Commercial Construction", desc: "75mm steel frame, Colorbond cladding, insulated walls and ceiling, and commercial-grade vinyl flooring throughout." },
    ],
    specifications: {
      "Overall Size": "1200cm (L) × 600cm (W) — 72m²",
      "Configuration": "Two 12x3m modules combined",
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "Multiple reverse cycle split systems",
    },
    standardInclusions: [
      "Configurable Office / Crib Layout", "LED Lighting Throughout",
      "Multiple Reverse Cycle Air Conditioners", "Lockable Switchboard with RCD",
      "GPOs Throughout", "Data & Comms Provisions",
      "1 × First Aid Kit", "2 × Fire Extinguishers", "1 × Fire Blanket",
      "Smoke Detectors", "Noticeboard & Whiteboard",
    ],
  },
  "12x9m-complex": {
    name: "12x9m Complex",
    slug: "12x9m-complex",
    tagline: "Three-Module Facility for Major Projects",
    size: "1200cm × 900cm",
    capacity: "Up to 36",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/12x6m-complex/2.jpg", "/images/products/12x6m-complex/1.jpg", "/images/products/12x6m-complex/3.jpg"],
    floorPlan: "/images/floorplans/SQF-3222-01-A - 12.0x9.0m Office Complex - Floor Plan.pdf",
    description: "The 12.0m × 9.0m Complex brings three modules together into a 108m² facility built for major projects. With room for training rooms, multiple offices, meeting spaces, and break areas, this configuration delivers comprehensive site accommodation for larger teams and longer-running operations.",
    features: [
      { title: "108m² Multi-Room Facility", desc: "Three modules provide ample space for offices, a training or meeting room, and break areas — all within a single connected building." },
      { title: "Built for Bigger Teams", desc: "Comfortably supports project management, supervision, and support staff for major mining, construction, and industrial projects." },
      { title: "Full Climate Control", desc: "Multiple reverse cycle air conditioners zoned across the complex keep every room comfortable year-round." },
      { title: "Commercial Construction", desc: "75mm steel frame, Colorbond cladding, insulated walls and ceiling, and commercial-grade vinyl flooring throughout." },
    ],
    specifications: {
      "Overall Size": "1200cm (L) × 900cm (W) — 108m²",
      "Configuration": "Three 12x3m modules combined",
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "Multiple reverse cycle split systems",
    },
    standardInclusions: [
      "Multi-Room Office / Training Layout", "LED Lighting Throughout",
      "Multiple Reverse Cycle Air Conditioners", "Lockable Switchboard with RCD",
      "GPOs Throughout", "Data & Comms Provisions",
      "1 × First Aid Kit", "Multiple Fire Extinguishers", "Fire Blankets",
      "Smoke Detectors", "Noticeboards & Whiteboards",
    ],
  },
  "12x12m-complex": {
    name: "12x12m Complex",
    slug: "12x12m-complex",
    tagline: "Our Largest Standard Configuration",
    size: "1200cm × 1200cm",
    capacity: "Up to 50+",
    badge: "LARGEST",
    selfContained: false,
    mobile: false,
    images: ["/images/products/office_complex.jpg", "/images/products/12x6m-complex/1.jpg", "/images/products/12x6m-complex/2.jpg"],
    floorPlan: "/images/floorplans/SQF-3295-01-B - 12.0x12.0m Office Complex - Floor Plan.pdf",
    description: "The 12.0m × 12.0m Complex is our largest standard configuration — a 144m² facility delivering full camp amenities under one roof. Combining four modules, it can house offices, crib and dining areas, meeting and training rooms, and amenities in a single comprehensive building. Ideal for large-scale operations that need everything on one footprint.",
    features: [
      { title: "144m² Under One Roof", desc: "Four combined modules deliver our largest standard facility — enough space for full site amenities without multiple separate buildings." },
      { title: "Complete Site Facilities", desc: "Configure offices, crib and dining rooms, training and meeting spaces, and amenities together in a single connected complex." },
      { title: "Zoned Climate Control", desc: "Multiple reverse cycle air conditioners zoned throughout keep every area comfortable across the large footprint." },
      { title: "Commercial Construction", desc: "75mm steel frame, Colorbond cladding, insulated walls and ceiling, and commercial-grade vinyl flooring throughout." },
    ],
    specifications: {
      "Overall Size": "1200cm (L) × 1200cm (W) — 144m²",
      "Configuration": "Four 12x3m modules combined",
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "Multiple reverse cycle split systems",
    },
    standardInclusions: [
      "Full Camp Office / Crib / Amenities Layout", "LED Lighting Throughout",
      "Multiple Reverse Cycle Air Conditioners", "Lockable Switchboard with RCD",
      "GPOs Throughout", "Data & Comms Provisions",
      "Multiple First Aid Kits", "Multiple Fire Extinguishers", "Fire Blankets",
      "Smoke Detectors", "Noticeboards & Whiteboards",
    ],
  },
  "custom-complexes": {
    name: "Custom Complexes",
    slug: "custom-complexes",
    tagline: "Bespoke Configurations Built to Your Specifications",
    size: "Custom",
    capacity: "Unlimited",
    badge: "CUSTOM",
    selfContained: false,
    mobile: false,
    images: ["/images/products/12x6m-complex/1.jpg", "/images/products/office_complex.jpg", "/images/products/12x6m-complex/3.jpg"],
    floorPlan: null,
    description: "When the standard configurations don't fit, we design and build to your exact specifications. Our custom complexes combine as many modules as your project requires — offices, crib rooms, ablutions, training rooms, control rooms, and amenities — into a purpose-built facility engineered for your site. Tell us what you need and our team will engineer a solution to match.",
    features: [
      { title: "Designed Around You", desc: "We start with your operational requirements and engineer a complex that fits your team, your functions, and your site constraints." },
      { title: "Any Module Combination", desc: "Combine offices, crib rooms, ablutions, training rooms, control rooms and more — there's no standard limit on size or layout." },
      { title: "Full Engineering Support", desc: "Our team handles design, engineering, compliance, and installation — including challenging sites and non-standard footprints." },
      { title: "Built for Queensland", desc: "Commercial-grade steel construction engineered and wind-rated for the demands of Central Queensland mining and industrial sites." },
    ],
    specifications: {
      "Overall Size": "Custom — built to your requirements",
      "Configuration": "Any combination of modules",
      "Frame": "Steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibre cement sheet, fully insulated",
      "Flooring": "Commercial-grade vinyl",
      "Electrical": "Engineered to your power & data requirements",
      "Air Conditioning": "Zoned reverse cycle systems",
      "Compliance": "Engineered & certified to project requirements",
    },
    standardInclusions: [
      "Bespoke Layout to Your Brief", "Full Design & Engineering",
      "LED Lighting Throughout", "Zoned Reverse Cycle Air Conditioning",
      "Switchboards with RCD", "GPOs & Data Throughout",
      "Site Compliance & Certification", "Fire & Safety Equipment",
      "Delivery & Installation Coordination",
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
}

const ALL_SLUGS = Object.keys(PRODUCTS);

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PRODUCTS[params.slug];
  if (!p) return {};
  return {
    title: `${p.name} Hire | Portable Building Complexes QLD — Multitrade`,
    description: `Hire the ${p.name} for your worksite. ${p.tagline}. ${p.capacity}. Delivered across Central Queensland. 45+ years experience.`,
  };
}

export default function ComplexDetailPage({ params }: { params: { slug: string } }) {
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
            <Link href="/hire/complexes" className="hover:text-white/60">Building Complexes</Link><span>/</span>
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
                <AddToQuoteButton showServiceUpgrades buildingSize={buildingSize} product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "complexes" }} />
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
            <HeroImage images={product.images} alt={product.name} badge={product.selfContained ? "SELF-CONTAINED" : null} />
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
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <FloorplanViewer productId={product.slug} />
            {product.floorPlan && (
              <a href={product.floorPlan!} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Download Floor Plan (PDF)
              </a>
            )}
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
        </div>
      </section>

      {/* Image Gallery */}
      <GalleryGrid images={product.images} alt={product.name} />

      {/* Service Upgrades */}
      <PowerSiteRequirements buildingSize={buildingSize} />

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="complexes" currentProductId={product.slug} />

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
            category: "complexes" as const,
            href: `/hire/complexes/${p.slug}`,
            badge: p.badge,
            highlights: [
              `${p.capacity} capacity`,
              `${Object.keys(p.specifications).length}+ spec items`,
              p.floorPlan ? "Floor plan available" : "Custom design",
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
