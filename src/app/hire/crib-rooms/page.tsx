import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crib Room Hire QLD | Portable Lunch Rooms",
  description: "Hire portable crib rooms and lunch rooms for mining & construction sites in Queensland. Standard, self-contained & mobile options. Multitrade Building Hire — 45+ years experience.",
};

const PRODUCTS = [
  { id: "12x3m-crib-room", name: "12x3m Crib Room", size: "12x3m", capacity: "Up to 30", selfContained: false, mobile: false, img: "/images/products/12x3-crib-room/1.jpg", description: "Spacious break facility for larger crews. Full kitchenette, dual AC, and LED lighting.", features: ["2 × 3.5kW AC units", "Full kitchenette", "Seating for 30", "LED lighting"], badge: "POPULAR" },
  { id: "6x3m-crib-room", name: "6x3m Crib Room", size: "6x3m", capacity: "Up to 15", selfContained: false, mobile: false, img: "/images/products/6x3-crib/1.jpg", description: "Versatile and durable portable break space. TECO AC, kitchenette, commercial vinyl flooring.", features: ["1 × 3.9kW AC", "1200mm kitchenette", "Commercial vinyl", "Insulated walls"], badge: null },
  { id: "solar-facility", name: "Solar Facility", size: "Custom", capacity: "Off-grid power", selfContained: true, mobile: false, img: "/images/products/solar-facility/1.jpg", description: "Off-grid solar power system with 20.5kW battery storage, upgradable to 40+ kW. Eliminates diesel generators.", features: ["20.5kW battery storage", "Upgradable to 40+ kW", "No diesel required", "ESG compliant"], badge: "SOLAR", href: "/solar-facility" },
  { id: "12x3m-mobile-crib", name: "12x3m Mobile Crib Room", size: "12.5x3m", capacity: "Up to 20", selfContained: true, mobile: true, img: "/images/products/12x3-mobile-crib-room/1.jpg", description: "Fully transportable, self-sufficient facility on a heavy-duty trailer. 11.2kVA generator and onboard water.", features: ["11.2kVA Kubota gen", "2 × 1000L water", "Air brakes & dual axles", "Mine spec"], badge: "SELF-CONTAINED" },
  { id: "6-6x3m-self-contained", name: "6.6x3m Self-Contained Crib", size: "6.6x3m", capacity: "Up to 8", selfContained: true, mobile: false, img: "/images/products/66x3m-self-contained-crib/1.jpg", description: "Eliminates the need for sub trades. Ready to work straight off the truck with kitchen and water storage.", features: ["Kitchen facilities", "230L water tank", "230L grey water tank", "Storage area"], badge: "SELF-CONTAINED" },
  { id: "7-2x3m-self-contained", name: "7.2x3m Self-Contained Crib", size: "7.2x3m", capacity: "Up to 15", selfContained: true, mobile: false, img: "/images/products/72x3m-self-contained-crib/1.jpg", description: "Larger self-contained crib with integrated bathroom. No external connections required.", features: ["Full bathroom", "Kitchen facilities", "Water storage", "Independent operation"], badge: "SELF-CONTAINED" },
  { id: "9-6x3m-living-quarters", name: "9.6x3m Living Quarters", size: "9.6x3m", capacity: "1-2 persons", selfContained: true, mobile: false, img: "/images/products/96x3m-living-quarters/1.jpg", description: "Combined living and break space for remote accommodation. Sleeping quarters with kitchen and bathroom.", features: ["Sleeping quarters", "Kitchen & bathroom", "Split system AC", "Fully insulated"], badge: "ACCOMMODATION" },
];


export default function CribRoomsPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <span className="text-white/80 font-medium">Crib Rooms</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
              {PRODUCTS.length} Products Available for Hire & Sale
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Crib Rooms & <span className="gold-text">Lunch Rooms</span>
            </h1>
            <p className="text-white/60 mt-4 max-w-lg">
              Comfortable, fully equipped break facilities for crews of 5 to 2,000. Standard, self-contained, and mobile options. Queensland&apos;s largest privately owned fleet.
            </p>
          </div>
        </div>
      </section>


      {/* Product Grid */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all duration-400">
                <div className="relative h-52 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {p.badge && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{p.badge}</span>}
                  <div className="absolute bottom-3 left-3 text-white"><div className="text-lg font-bold">{p.name}</div></div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">{p.size}</span>
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">{p.capacity}</span>
                    {p.selfContained && <span className="px-2 py-1 rounded-md bg-amber-50 text-xs font-medium text-amber-700 border border-amber-200">Self-Contained</span>}
                    {p.mobile && <span className="px-2 py-1 rounded-md bg-green-50 text-xs font-medium text-green-700 border border-green-200">Towable</span>}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{p.description}</p>
                  <div className="grid grid-cols-2 gap-1.5 mb-4">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-gray-100">
                    <Link href={p.href || `/hire/crib-rooms/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                      See Details
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                    <AddToQuoteButton compact product={{ id: p.id, name: p.name, size: p.size, img: p.img, category: "crib-rooms" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* SEO Content */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portable Crib Room Hire — Central Queensland</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>Multitrade Building Hire provides comfortable, fully equipped crib rooms and lunch rooms for mining, construction, and industrial worksites across Queensland. With standard inclusions like kitchen sinks, instant boiling water units, and pie warmers, our units meet even the toughest Tier 1 site requirements.</p>
            <p>Our crib room hire fleet ranges from compact 6x3m units for small crews through to 12x3m facilities seating up to 30 workers. For remote sites without connections, our self-contained and mobile crib rooms come with onboard generators, water tanks, and waste systems.</p>
            <p>With yards in Gladstone and Emerald and over 45 years of experience, we deliver across the Bowen Basin, Central Highlands, Surat Basin, and throughout Central Queensland. All units are mine-spec compliant and backed by our zero lost time injury safety record.</p>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
