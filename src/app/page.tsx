import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";

const PRODUCTS = [
  { name: "Crib Rooms", desc: "Fully equipped lunch rooms with kitchenettes, seating, and air conditioning.", sizes: "6x3m — 12x3m", href: "/hire/crib-rooms", img: "/images/products/12x3-crib-room/1.jpg" },
  { name: "Site Offices", desc: "Professional portable offices for project management and administration.", sizes: "3x3m — 12x3m", href: "/hire/site-offices", img: "/images/products/12x3-office/1.jpg" },
  { name: "Ablutions", desc: "Toilet blocks, shower facilities, and solar-powered ablution buildings.", sizes: "3.6x2.4m — 6x3m", href: "/hire/ablutions", img: "/images/products/6x3-toilet/1.jpg" },
  { name: "Complexes", desc: "Multi-module complexes for large-scale site accommodation needs.", sizes: "12x6m — 12x12m+", href: "/hire/complexes", img: "/images/products/12x6m-complex/1.jpg" },
  { name: "Containers", desc: "Shipping containers, dangerous goods storage, and container conversions.", sizes: "10ft — 40ft", href: "/hire/containers", img: "/images/products/10ft-container/1.jpg" },
  { name: "Ancillary", desc: "Tanks, pumps, covered decks, flat racks, stairs, and hand wash stations.", sizes: "Various", href: "/hire/ancillary", img: "/images/products/5000l-tank-pump/1.jpg" },
];

const STATS = [
  { value: "45+", label: "Years in Operation", sub: "Est. 1980" },
  { value: "100s", label: "Project Locations", sub: "Across QLD" },
  { value: "QLD's", label: "Largest Fleet", sub: "Privately Owned" },
  { value: "0", label: "Lost Time Injuries", sub: "In 5+ Years" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 40%, #2a1f14 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 70% 50%, rgba(212,168,67,0.3) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="animate-hero">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-6">
                NEW — Solar-Powered Facility Now Available
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Portable Buildings{" "}
                <span className="gold-text">Built for</span> Industry
              </h1>
            </div>
            <p className="animate-hero-delay text-lg text-gray-400 mt-6 leading-relaxed max-w-lg serif">
              Queensland&apos;s largest privately owned fleet. 45+ years delivering
              hire, sale, installation, and custom manufacture of portable
              buildings for mining, construction, and civil projects.
            </p>
            <div className="animate-hero-delay-2 flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/quote"
                className="px-8 py-4 rounded-lg font-semibold text-gray-900 text-center bg-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <a
                href="tel:0749792333"
                className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                (07) 4979 2333
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ─── STATS BAR ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gray-200">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center py-4 md:py-8">
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-800 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Our Fleet</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Portable Buildings for Every Need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto serif">
              From single-module offices to multi-building complexes. Hire, buy, or have us custom-manufacture to your specifications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PRODUCTS.map((product, i) => (
              <Link key={i} href={product.href} className="product-card group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 transition-all duration-500">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img src={product.img} alt={product.name} className="product-img w-full h-full object-cover transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-black/40 backdrop-blur-sm">{product.sizes}</div>
                  <div className="product-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300">
                    <span className="px-6 py-3 rounded-lg font-semibold text-sm text-gray-900 bg-gold flex items-center gap-2">
                      View Range
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{product.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold gold-text tracking-wide">HIRE & SALE</span>
                    <span className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ─── CLIENT LOGOS ─── */}
      <section className="bg-white py-12 overflow-hidden">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">Trusted by Industry Leaders</div>
        </div>
        <div className="relative">
          <div className="marquee-track">
            {[...Array(2)].map((_, set) =>
              ["BHP", "Glencore", "Anglo American", "Rio Tinto", "Thiess", "Coronado", "Downer", "UGL", "Monadelphous", "Golding"].map((name, i) => (
                <div key={`${set}-${i}`} className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center h-12">
                  <span className="text-gray-300 font-bold text-lg tracking-wider uppercase">{name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Your Next Project Starts With Us
          </h2>
          <p className="text-white/50 mt-2 serif">
            45+ years of experience. Queensland&apos;s largest privately owned fleet.
            Tell us what you need.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/quote"
              className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all flex items-center gap-2"
            >
              Get a Free Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <a
              href="tel:0749792333"
              className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
            >
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
