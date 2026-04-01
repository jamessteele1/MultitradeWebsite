import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import CompareProducts from "@/components/CompareProducts";
import SuggestedAddOns from "@/components/SuggestedAddOns";
import { HeroImage, GalleryGrid } from "@/components/ProductGallery";

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "20ft-container": {
    name: "20ft Shipping Container",
    slug: "20ft-container",
    tagline: "Standard Secure On-Site Storage",
    size: "20ft (6.06m × 2.44m × 2.59m)",
    capacity: "33 cubic metres",
    badge: "POPULAR",
    images: ["/images/products/20ft-container/1.jpg"],
    description: "The 20ft Shipping Container is the industry-standard secure storage solution for worksites across Australia. Built from heavy-gauge Corten steel and designed to withstand ocean freight conditions, these containers offer exceptional weather resistance and security for tools, equipment, materials, and supplies on mining, construction, and industrial sites.",
    features: [
      { title: "Maximum Security", desc: "Heavy-gauge Corten steel construction with lockable cargo doors provides excellent protection against theft and weather." },
      { title: "Weather Resistant", desc: "Engineered for ocean freight — completely wind and water tight. Handles extreme heat, rain, dust, and cyclonic conditions." },
      { title: "33m³ Storage", desc: "Generous internal volume accommodates palletised goods, bulky equipment, scaffolding, and large material quantities." },
      { title: "Easy Transport", desc: "Standard 20ft dimensions allow delivery by tilt tray, side loader, or crane truck. No special permits required." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Internal Dimensions": "5,898mm (L) × 2,352mm (W) × 2,393mm (H)",
      "Door Opening": "2,340mm (W) × 2,280mm (H)",
      "Construction": "Corten steel (weathering steel)",
      "Floor": "28mm marine-grade plywood",
      "Capacity": "33.2 cubic metres",
      "Max Payload": "28,200 kg",
      "Condition": "Wind and water tight (WWT)",
    },
    standardInclusions: [
      "Lockbox fitted to cargo doors",
      "Wind & water tight certification",
      "Marine-grade plywood flooring",
      "Forklift pockets",
      "Corner castings for crane lift",
      "CSC plating",
    ],
  },
  "20ft-high-cube-container": {
    name: "20ft High Cube Container",
    slug: "20ft-high-cube-container",
    tagline: "Extra Height for Taller Items & Equipment",
    size: "20ft HC (6.06m × 2.44m × 2.90m)",
    capacity: "37 cubic metres",
    badge: "HIGH CUBE",
    images: ["/images/products/20ft-container/1.jpg"],
    description: "The 20ft High Cube Container offers an additional 30cm of internal height compared to standard containers, providing 37 cubic metres of secure storage. This extra clearance is ideal for storing taller items such as machinery, racking systems, or stacked pallets that won't fit in a standard-height unit.",
    features: [
      { title: "Extra Internal Height", desc: "2.70m internal height — 30cm taller than standard containers — accommodates taller items and double-stacked pallets." },
      { title: "37m³ Storage", desc: "Increased volume provides approximately 12% more storage capacity than a standard 20ft container." },
      { title: "Secure & Weatherproof", desc: "Same heavy-gauge Corten steel construction and wind/water tight rating as standard shipping containers." },
      { title: "Versatile Application", desc: "Perfect for racking systems, tall equipment, electrical switchboards, and items that need overhead clearance." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,896mm (H)",
      "Internal Dimensions": "5,898mm (L) × 2,352mm (W) × 2,698mm (H)",
      "Door Opening": "2,340mm (W) × 2,585mm (H)",
      "Construction": "Corten steel (weathering steel)",
      "Floor": "28mm marine-grade plywood",
      "Capacity": "37.4 cubic metres",
      "Max Payload": "28,060 kg",
      "Condition": "Wind and water tight (WWT)",
    },
    standardInclusions: [
      "Lockbox fitted to cargo doors",
      "Wind & water tight certification",
      "Marine-grade plywood flooring",
      "Forklift pockets",
      "Corner castings for crane lift",
      "CSC plating",
    ],
  },
  "10ft-container": {
    name: "10ft Shipping Container",
    slug: "10ft-container",
    tagline: "Compact Secure Storage for Tight Sites",
    size: "10ft (2.99m × 2.44m × 2.59m)",
    capacity: "16 cubic metres",
    badge: null,
    images: ["/images/products/10ft-container/1.jpg", "/images/products/10ft-container/2.jpg", "/images/products/10ft-container/3.jpg"],
    description: "The 10ft Shipping Container is a compact storage solution ideal for sites with limited space or smaller storage requirements. At half the length of a standard 20ft unit, it fits into tight site layouts while still providing secure, weatherproof storage for tools, equipment, and materials.",
    features: [
      { title: "Compact Footprint", desc: "At just 3m long, this container fits into tight site layouts, narrow access points, and areas where a 20ft unit won't work." },
      { title: "Same Build Quality", desc: "Heavy-gauge Corten steel construction with the same security and weather resistance as full-size shipping containers." },
      { title: "16m³ Storage", desc: "Sufficient internal volume for tool storage, small equipment, PPE supplies, and consumables." },
      { title: "Easy Placement", desc: "Lighter than standard containers — can be positioned by smaller cranes and in locations inaccessible to larger units." },
    ],
    specifications: {
      "External Dimensions": "2,991mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Internal Dimensions": "2,831mm (L) × 2,352mm (W) × 2,393mm (H)",
      "Door Opening": "2,340mm (W) × 2,280mm (H)",
      "Construction": "Corten steel (weathering steel)",
      "Floor": "28mm marine-grade plywood",
      "Capacity": "15.9 cubic metres",
      "Condition": "Wind and water tight (WWT)",
    },
    standardInclusions: [
      "Lockbox fitted to cargo doors",
      "Wind & water tight certification",
      "Marine-grade plywood flooring",
      "Forklift pockets",
      "Corner castings for crane lift",
    ],
  },
  "20ft-dg-container": {
    name: "20ft Dangerous Goods Container",
    slug: "20ft-dg-container",
    tagline: "Compliant Hazmat Storage with Side Opening",
    size: "20ft DG (6.06m × 2.44m × 2.59m)",
    capacity: "DG compliant",
    badge: "DG RATED",
    images: ["/images/products/10ft-dg-container/1.jpg"],
    description: "The 20ft Dangerous Goods Container is purpose-built for the compliant storage of hazardous materials on mining, industrial, and construction sites. Featuring side-opening doors for easy access, integrated bunding to contain spills, and ventilation for safe storage of flammable and corrosive substances, this unit meets Australian dangerous goods storage requirements.",
    features: [
      { title: "DG Compliant", desc: "Designed and built to meet Australian Standards for dangerous goods storage including bunding, ventilation, and signage requirements." },
      { title: "Side-Opening Access", desc: "Full side-opening doors provide wide access for loading and unloading drums, IBCs, and palletised hazardous materials." },
      { title: "Integrated Bunding", desc: "Built-in spill containment bund captures leaks and spills, preventing environmental contamination." },
      { title: "Natural Ventilation", desc: "Ventilation openings ensure safe airflow for storage of flammable, corrosive, and volatile substances." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Construction": "Heavy-gauge steel with DG modifications",
      "Doors": "Full side-opening access doors",
      "Bunding": "Integrated spill containment bund",
      "Ventilation": "Natural ventilation openings",
      "Signage": "DG class placards and labels",
      "Floor": "Steel chequer plate or sealed",
      "Compliance": "Australian Standards for DG storage",
    },
    standardInclusions: [
      "Integrated spill containment bund",
      "DG class signage & placards",
      "Natural ventilation system",
      "Side-opening access doors",
      "Lockable door hardware",
      "Steel floor (sealed)",
    ],
  },
  "10ft-dg-container": {
    name: "10ft Dangerous Goods Container",
    slug: "10ft-dg-container",
    tagline: "Compact DG Storage for Smaller Quantities",
    size: "10ft DG (2.99m × 2.44m × 2.59m)",
    capacity: "DG compliant",
    badge: "DG RATED",
    images: ["/images/products/10ft-dg-container/1.jpg"],
    description: "The 10ft Dangerous Goods Container provides compliant hazardous materials storage in a compact footprint. Ideal for sites that need to store smaller quantities of dangerous goods without dedicating space for a full-size DG unit. Features the same bunding, ventilation, and compliance standards as the 20ft version.",
    features: [
      { title: "Compact DG Storage", desc: "Half the footprint of a 20ft DG container while maintaining full compliance with Australian dangerous goods storage requirements." },
      { title: "DG Compliant", desc: "Built to Australian Standards with integrated bunding, ventilation, and DG class signage for safe hazmat storage." },
      { title: "Spill Containment", desc: "Integrated bunding captures leaks and spills from drums, IBCs, and other hazardous material containers." },
      { title: "Versatile Placement", desc: "Compact size allows placement in areas where larger DG units won't fit — near work zones for easier access to chemicals." },
    ],
    specifications: {
      "External Dimensions": "2,991mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Construction": "Heavy-gauge steel with DG modifications",
      "Doors": "End-opening cargo doors",
      "Bunding": "Integrated spill containment bund",
      "Ventilation": "Natural ventilation openings",
      "Signage": "DG class placards and labels",
      "Floor": "Steel chequer plate or sealed",
      "Compliance": "Australian Standards for DG storage",
    },
    standardInclusions: [
      "Integrated spill containment bund",
      "DG class signage & placards",
      "Natural ventilation system",
      "Lockable door hardware",
      "Steel floor (sealed)",
    ],
  },
  "20ft-shelved-container": {
    name: "20ft Shelved Container",
    slug: "20ft-shelved-container",
    tagline: "Organised Storage with Heavy-Duty Shelving",
    size: "20ft (6.06m × 2.44m × 2.59m)",
    capacity: "Organised storage",
    badge: null,
    images: ["/images/products/20ft-shelved-container/1.jpg"],
    description: "The 20ft Shelved Container is a standard shipping container fitted with adjustable heavy-duty shelving systems for organised storage of tools, parts, consumables, and equipment. Instead of stacking items on the floor, the shelving maximises vertical space and makes inventory management significantly easier on busy worksites.",
    features: [
      { title: "Heavy-Duty Shelving", desc: "Adjustable steel shelving systems rated for heavy loads — ideal for tools, parts bins, fasteners, and consumables." },
      { title: "Maximised Space", desc: "Vertical storage utilises the full height of the container, dramatically increasing usable storage compared to floor stacking." },
      { title: "Easy Organisation", desc: "Labelled shelving bays and clear sightlines make it easy to find what you need quickly — reducing downtime on site." },
      { title: "Secure & Weatherproof", desc: "Full Corten steel construction with lockable cargo doors. All items stay dry, secure, and protected from the elements." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Construction": "Corten steel shipping container",
      "Shelving": "Adjustable heavy-duty steel shelving",
      "Shelf Capacity": "Rated for heavy tool & parts storage",
      "Floor": "28mm marine-grade plywood",
      "Doors": "Standard cargo doors with lockbox",
      "Condition": "Wind and water tight (WWT)",
    },
    standardInclusions: [
      "Adjustable steel shelving system",
      "Lockbox fitted to cargo doors",
      "Wind & water tight certification",
      "Marine-grade plywood flooring",
      "Forklift pockets",
      "Corner castings for crane lift",
    ],
  },
  "20ft-riggers-container": {
    name: "20ft Riggers Container",
    slug: "20ft-riggers-container",
    tagline: "Purpose-Built Workshop for Rigging Teams",
    size: "20ft (6.06m × 2.44m × 2.59m)",
    capacity: "Workshop",
    badge: "WORKSHOP",
    images: ["/images/products/20ft-container-office/1.jpg"],
    description: "The 20ft Riggers Container is a purpose-built workshop container designed for rigging, maintenance, and trades teams. Fitted with a heavy-duty workbench, tool storage shelving, electrical fit-out with power and lighting, and ventilation, this unit provides a functional workspace directly on site — no need for a separate workshop building.",
    features: [
      { title: "Built-In Workbench", desc: "Heavy-duty steel workbench with vice mounting points provides a solid surface for rigging work, fabrication, and repairs." },
      { title: "Tool Storage", desc: "Integrated shelving and storage systems keep tools, slings, shackles, and rigging equipment organised and accessible." },
      { title: "Electrical Fit-Out", desc: "Power outlets, LED lighting, and switchboard allow use of power tools, grinders, and inspection equipment inside the container." },
      { title: "Secure Workshop", desc: "Lockable Corten steel container keeps all tools and equipment secure when the team is off site or between shifts." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Construction": "Corten steel shipping container",
      "Workbench": "Heavy-duty steel with vice points",
      "Shelving": "Adjustable tool & equipment storage",
      "Electrical": "Switchboard, LED lighting, GPOs",
      "Ventilation": "Natural and/or forced ventilation",
      "Floor": "Steel chequer plate or marine ply",
      "Doors": "Standard cargo doors + personnel door",
    },
    standardInclusions: [
      "Heavy-duty steel workbench",
      "Adjustable shelving system",
      "Switchboard with RCD",
      "LED lighting throughout",
      "Power outlets (GPOs)",
      "Lockbox fitted to cargo doors",
      "Ventilation system",
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
    title: `${p.name} Hire & Sale | Shipping Containers QLD — Multitrade`,
    description: `Hire or buy the ${p.name}. ${p.tagline}. ${p.capacity}. Delivered across Queensland. Multitrade Building Hire.`,
  };
}

export default function ContainerDetailPage({ params }: { params: { slug: string } }) {
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
            <Link href="/hire/containers" className="hover:text-white/60">Containers</Link><span>/</span>
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
                <AddToQuoteButton product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "containers" }} />
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

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="containers" currentProductId={product.slug} />

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
            category: "containers" as const,
            href: `/hire/containers/${p.slug}`,
            badge: p.badge,
            highlights: [
              p.capacity,
              p.badge === "DG RATED" ? "Dangerous goods compliant" : "Wind & water tight",
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
            Available for hire or sale. Delivered across Queensland on tilt tray or side loader.
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
