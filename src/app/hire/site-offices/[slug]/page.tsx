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

/* ─── Product Data ───────────────────────────────────────────── */
const PRODUCTS: Record<string, Product> = {
  "12x3m-office": {
    name: "12x3m Office",
    slug: "12x3m-office",
    tagline: "Large Open-Plan Workspace for Site Teams",
    size: "1200cm × 300cm",
    capacity: "5–6 desks",
    badge: "POPULAR",
    selfContained: false,
    mobile: false,
    images: ["/images/products/12x3-office/1.jpg", "/images/products/12x3-office/2.jpg", "/images/products/12x3-office/3.jpg", "/images/products/12x3-office/4.jpg"],
    floorPlan: "/images/floorplans/SQF-4453-01-A - 12.0x3.0m Office - Floor Plan.pdf",
    description: "The 12.0m × 3.0m Office is a spacious portable workspace designed to accommodate up to 6 workstations. With a full electrical and data fit-out, dual air conditioning units, and commercial-grade construction, this unit is the go-to solution for project management teams on mining, construction, and industrial sites across Central Queensland.",
    features: [
      { title: "Generous Workspace", desc: "36m² of open-plan or partitioned office space accommodating 5–6 desks with room for filing and storage." },
      { title: "Dual Climate Control", desc: "2 × reverse cycle air conditioners ensure comfortable working temperatures throughout the full length of the building." },
      { title: "Full Electrical & Data", desc: "Lockable switchboard with RCD, LED lighting, GPOs at each workstation, and data/phone cabling ready for connection." },
      { title: "Durable Construction", desc: "75mm steel frame, Colorbond steel cladding, insulated walls and ceiling, and commercial-grade vinyl flooring." },
    ],
    specifications: {
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "2 × 2040×920mm external metal clad doors",
      "Windows": "4 × 1210×610mm aluminium sliding with flyscreens",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "2 × reverse cycle split systems",
      "Data": "Cat6 data cabling provisions",
    },
    standardInclusions: [
      "5–6 × Office Desks", "5–6 × Office Chairs", "2 × Filing Cabinets",
      "LED Lighting Throughout", "2 × Reverse Cycle Air Conditioners",
      "Lockable Switchboard with RCD", "GPOs at Each Workstation",
      "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
      "2 × Smoke Detectors", "Noticeboard & Whiteboard",
    ],
  },
  "6x3m-office": {
    name: "6x3m Office",
    slug: "6x3m-office",
    tagline: "Mid-Size Office for Supervisors & Coordinators",
    size: "600cm × 300cm",
    capacity: "2–3 desks",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/6x3-office/1.jpg", "/images/products/6x3-office/2.jpg", "/images/products/6x3-office/3.jpg"],
    floorPlan: "/images/floorplans/SQF-4370-01-A - 6.0x3.0m Office - Floor Plan.pdf",
    description: "The 6.0m × 3.0m Office is a versatile mid-size portable workspace ideal for site supervisors, project coordinators, and small management teams. Fully climate-controlled with a complete electrical fit-out, this unit delivers a professional and comfortable working environment on any worksite.",
    features: [
      { title: "Efficient Layout", desc: "18m² of usable office space comfortably fits 2–3 desks with room for filing cabinets and storage." },
      { title: "Climate Controlled", desc: "1 × reverse cycle air conditioner maintains comfortable working temperatures year-round." },
      { title: "Full Electrical Fit-Out", desc: "Lockable switchboard with safety switch (RCD), LED lighting, and GPOs positioned for workstation use." },
      { title: "Robust Build", desc: "75mm steel frame with Colorbond cladding, insulated walls and ceiling, and commercial vinyl flooring." },
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
      "Air Conditioning": "1 × reverse cycle split system",
    },
    standardInclusions: [
      "2–4 × Office Desks", "2–4 × Office Chairs", "1 × Filing Cabinet",
      "LED Lighting Throughout", "1 × Reverse Cycle Air Conditioner",
      "Lockable Switchboard with RCD", "GPOs at Each Workstation",
      "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
      "1 × Smoke Detector", "Noticeboard",
    ],
  },
  "6x3m-supervisor-office": {
    name: "6x3m Supervisor Office",
    slug: "6x3m-supervisor-office",
    tagline: "Dedicated Workspace for Site Supervisors",
    size: "600cm × 300cm",
    capacity: "1–2 desks",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/6x3m-supervisor-office/1.jpg", "/images/products/6x3m-supervisor-office/2.jpg", "/images/products/6x3m-supervisor-office/3.jpg"],
    floorPlan: "/images/floorplans/SQF-1805-01-B - 6.0x3.0m Supervisors Office - Floor Plan.pdf",
    description: "The 6.0m × 3.0m Supervisor Office is purpose-built for site supervisors and project leaders who need a dedicated, private workspace. Featuring ergonomic furniture, ample storage, and a professional fit-out, this unit provides the focus and functionality required for effective site management.",
    features: [
      { title: "Private Workspace", desc: "Dedicated single or dual-occupancy office designed for supervisors who need space for meetings, planning, and documentation." },
      { title: "Ergonomic Furniture", desc: "Fitted with quality office desk, ergonomic chair, and built-in storage to support long working days on site." },
      { title: "Climate Controlled", desc: "Reverse cycle air conditioning ensures a comfortable working environment regardless of external conditions." },
      { title: "Secure & Professional", desc: "Lockable doors, full electrical fit-out with safety switch, and professional internal lining for a clean workspace." },
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
      "Air Conditioning": "1 × reverse cycle split system",
    },
    standardInclusions: [
      "1 × Executive Office Desk", "1 × Ergonomic Office Chair", "1 × Filing Cabinet",
      "1 × Bookshelf / Storage Unit", "LED Lighting Throughout",
      "1 × Reverse Cycle Air Conditioner", "Lockable Switchboard with RCD",
      "1 × First Aid Kit", "1 × Fire Extinguisher", "1 × Fire Blanket",
      "1 × Smoke Detector", "Noticeboard & Whiteboard",
    ],
  },
  "3x3m-office": {
    name: "3x3m Office",
    slug: "3x3m-office",
    tagline: "Compact Office for Gatekeepers & Security",
    size: "300cm × 300cm",
    capacity: "1–2 desks",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/3x3-office/1.jpg", "/images/products/3x3-office/2.jpg"],
    floorPlan: "/images/floorplans/SQF-4495-01-A - 3.0x3.0m Office - Floor Plan.pdf",
    description: "The 3.0m × 3.0m Office is a compact, single-person portable workspace perfect for gatekeepers, security staff, and weighbridge operators. Despite its small footprint, this unit is fully equipped with air conditioning, a complete electrical fit-out, and durable construction to handle the rigours of remote worksites.",
    features: [
      { title: "Small Footprint", desc: "At just 9m², this unit fits into tight site layouts while providing a fully functional, enclosed workspace." },
      { title: "Fully Equipped", desc: "Complete with desk, chair, air conditioning, and full electrical fit-out — everything needed for a productive workspace." },
      { title: "Climate Controlled", desc: "Reverse cycle air conditioning keeps the space comfortable in Central Queensland's extreme temperatures." },
      { title: "Quick to Deploy", desc: "Lightweight and easy to transport. Can be crane-lifted into position and operational within hours of delivery." },
    ],
    specifications: {
      "Frame": "75mm steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "6mm fibre cement sheet",
      "Insulation": "50mm poly foam walls & ceiling",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "1 × 2040×820mm external metal clad door",
      "Windows": "1 × 1210×610mm aluminium sliding with flyscreen",
      "Electrical": "Lockable switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "1 × reverse cycle split system",
    },
    standardInclusions: [
      "1 × Office Desk", "1 × Office Chair", "LED Lighting Throughout",
      "1 × Reverse Cycle Air Conditioner", "Lockable Switchboard with RCD",
      "GPOs", "1 × First Aid Kit", "1 × Fire Extinguisher",
      "1 × Smoke Detector",
    ],
  },
  "20ft-container-office": {
    name: "20ft Container Office",
    slug: "20ft-container-office",
    tagline: "Robust Converted Shipping Container Workspace",
    size: "600cm × 240cm",
    capacity: "2–3 desks",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/20ft-container-office/1.jpg"],
    floorPlan: null,
    description: "The 20ft Container Office is a converted shipping container fitted out as a fully functional portable office. Built from heavy-gauge Corten steel, this unit offers superior security and weather resistance. Ideal for sites requiring robust, lockable workspace that can withstand harsh conditions and remote locations.",
    features: [
      { title: "Superior Security", desc: "Heavy-gauge Corten steel construction with lockable container doors provides excellent security for equipment and documents." },
      { title: "Weather Resistant", desc: "Originally engineered for ocean freight, these containers handle extreme weather, dust, and rough handling with ease." },
      { title: "Full Office Fit-Out", desc: "Internally lined and insulated with desk space, electrical fit-out, lighting, and air conditioning for a comfortable workspace." },
      { title: "Easy Transport", desc: "Standard 20ft container dimensions allow transport on any tilt tray or side loader — no special permits required." },
    ],
    specifications: {
      "External Dimensions": "6,058mm (L) × 2,438mm (W) × 2,591mm (H)",
      "Construction": "Corten steel shipping container",
      "Internal Lining": "Insulated and lined walls & ceiling",
      "Flooring": "Commercial-grade vinyl over marine ply",
      "Doors": "1 × personnel door + original container doors",
      "Windows": "Aluminium sliding windows with security mesh",
      "Electrical": "Switchboard, RCD, LED lighting, GPOs",
      "Air Conditioning": "1 × reverse cycle split system",
    },
    standardInclusions: [
      "2–3 × Office Desks", "2–3 × Office Chairs", "LED Lighting Throughout",
      "1 × Reverse Cycle Air Conditioner", "Switchboard with RCD",
      "GPOs", "1 × First Aid Kit", "1 × Fire Extinguisher",
      "1 × Smoke Detector",
    ],
  },
  "gatehouse": {
    name: "Gatehouse",
    slug: "gatehouse",
    tagline: "Purpose-Built Security & Access Control Building",
    size: "1050cm × 340cm",
    capacity: "1–2 staff",
    badge: null,
    selfContained: false,
    mobile: false,
    images: ["/images/products/gatehouse/1.jpg", "/images/products/gatehouse/2.jpg", "/images/products/gatehouse/3.jpg", "/images/products/gatehouse/4.jpg"],
    floorPlan: "/images/floorplans/PJF-764-1416-01-2 - 10.5x3.4m Gatehouse - Floor Plan.pdf",
    description: "The 10.5m × 3.4m Gatehouse is a purpose-built security and access control building designed for site entry points. Featuring large windows for maximum visibility, a service counter, and space for access control systems, this unit ensures safe and controlled site access on mining, construction, and industrial projects.",
    features: [
      { title: "Maximum Visibility", desc: "Large windows on multiple sides provide clear sightlines to approaching vehicles and personnel for effective access control." },
      { title: "Service Counter", desc: "Built-in service window and counter for visitor sign-in, permit checks, and document exchange without leaving the building." },
      { title: "Access Control Ready", desc: "Pre-wired for boom gate controls, CCTV monitors, two-way radios, and electronic access control systems." },
      { title: "All-Day Comfort", desc: "Climate-controlled with reverse cycle air conditioning, kitchenette facilities, and ergonomic workstation for long shifts." },
    ],
    specifications: {
      "Dimensions": "1050cm (L) × 340cm (W)",
      "Frame": "Steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibre cement sheet, fully insulated",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "Personnel doors with security hardware",
      "Windows": "Large-format aluminium windows for visibility",
      "Electrical": "Switchboard, RCD, LED lighting, data & power provisions",
      "Air Conditioning": "Reverse cycle split system",
      "Kitchenette": "Bench with sink and space for appliances",
    },
    standardInclusions: [
      "1 × Security Workstation", "1 × Office Chair", "Service Counter & Window",
      "Kitchenette with Sink", "LED Lighting Throughout",
      "Reverse Cycle Air Conditioner", "Switchboard with RCD",
      "Data & Comms Provisions", "1 × First Aid Kit", "1 × Fire Extinguisher",
      "1 × Smoke Detector",
    ],
  },
  "self-contained-supervisor-office": {
    name: "Self-Contained Supervisor Office",
    slug: "self-contained-supervisor-office",
    tagline: "Independent Office with Integrated Bathroom",
    size: "660cm × 300cm",
    capacity: "1–2 desks",
    badge: "SELF-CONTAINED",
    selfContained: true,
    mobile: false,
    images: ["/images/products/6x3m-supervisor-office/1.jpg"],
    floorPlan: "/images/floorplans/SQF-1805-01-B - 6.0x3.0m Supervisors Office - Floor Plan.pdf",
    description: "The 6.6m × 3.0m Self-Contained Supervisor Office combines a dedicated private workspace with an integrated bathroom, eliminating the need for separate ablution facilities. Powered by an onboard generator with its own water supply, this unit requires no external connections — making it ideal for remote or greenfield sites where infrastructure hasn't yet been established.",
    features: [
      { title: "Fully Self-Contained", desc: "Onboard generator and water system mean zero external connections required. Deploy to any location and be operational immediately." },
      { title: "Integrated Bathroom", desc: "Built-in bathroom with shower, toilet, and hand basin — no need for a separate ablution block on site." },
      { title: "Private Office Space", desc: "Dedicated workspace with desk, chair, and storage for supervisors who need a quiet, professional environment." },
      { title: "Climate Controlled", desc: "Reverse cycle air conditioning maintains comfortable working temperatures regardless of external conditions." },
    ],
    specifications: {
      "Dimensions": "660cm (L) × 300cm (W)",
      "Frame": "Steel frame construction",
      "External Cladding": "Colorbond steel",
      "Internal Lining": "Fibre cement sheet, fully insulated",
      "Flooring": "Commercial-grade vinyl",
      "Doors": "1 × external metal clad door",
      "Windows": "Aluminium sliding windows with flyscreens",
      "Power": "Onboard generator",
      "Water": "Fresh water tank + grey water tank",
      "Bathroom": "Integrated shower, toilet & hand basin",
      "Air Conditioning": "1 × reverse cycle split system",
    },
    standardInclusions: [
      "1 × Office Desk", "1 × Office Chair", "1 × Filing Cabinet",
      "Shower, Toilet & Hand Basin", "LED Lighting Throughout",
      "1 × Reverse Cycle Air Conditioner", "Onboard Generator",
      "Pressure Pump System", "1 × First Aid Kit", "1 × Fire Extinguisher",
      "1 × Smoke Detector",
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
    title: `${p.name} Hire | Portable Site Offices QLD — Multitrade`,
    description: `Hire the ${p.name} for your worksite. ${p.tagline}. ${p.capacity}. Delivered across Central Queensland. 45+ years experience.`,
  };
}

export default function SiteOfficeDetailPage({ params }: { params: { slug: string } }) {
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
            <Link href="/hire/site-offices" className="hover:text-white/60">Site Offices</Link><span>/</span>
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
                <AddToQuoteButton product={{ id: product.slug, name: product.name, size: product.size, img: product.images[0], category: "site-offices" }} />
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
              <img src={product.images[0]} alt={product.name} className="w-full h-64 md:h-80 object-cover" />
              {product.selfContained && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/90 text-white backdrop-blur-sm">
                  SELF-CONTAINED
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

      {/* Image Gallery (if multiple images) */}
      {product.images.length > 1 && (
        <section className="py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Gallery</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200">
                  <img src={img} alt={`${product.name} - View ${i + 1}`} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Power & Site Requirements */}
      <PowerSiteRequirements
        buildingSize={product.size.startsWith("12") ? "12x3" : product.size.startsWith("6") ? "6x3" : product.size.startsWith("3") ? "3x3" : "other"}
      />

      {/* Suggested Add-Ons */}
      <SuggestedAddOns category="site-offices" currentProductId={product.slug} />

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
            category: "site-offices" as const,
            href: `/hire/site-offices/${p.slug}`,
            badge: p.badge,
            highlights: [
              p.selfContained ? "Self-contained" : "Requires site connections",
              `${p.capacity} capacity`,
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
    </>
  );
}
