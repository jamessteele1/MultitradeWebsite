import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Building Accessories & Equipment Hire QLD",
  description: "Hire ancillary equipment — tanks, pumps, covered decks, flat racks, stairs, and hand wash stations. Multitrade Building Hire Queensland.",
};

const PRODUCTS = [
    { id: "5000l-tank-pump", name: "5000L Tank & Pump Combo", size: "Skid mounted", capacity: "5000L", desc: "Potable water tank with pump system on a skid-mounted frame for easy deployment.", badge: "", img: "/images/products/5000l-tank-pump/1.jpg" },
    { id: "6000l-waste-tank", name: "6000L Waste Tank", size: "6000L", capacity: "Waste", desc: "Large-capacity waste tank for ablution and crib room waste collection.", badge: "", img: "/images/products/6000l-waste-tank/1.jpg" },
    { id: "4000l-waste-tank", name: "4000L Waste Tank", size: "4000L", capacity: "Waste", desc: "Mid-size waste tank for smaller site requirements.", badge: "", img: "/images/products/4000l-waste-tank/1.jpg" },
    { id: "12x3m-covered-deck", name: "12x3m Covered Deck", size: "12x3m", capacity: "Walkway", desc: "Weatherproof covered walkway and deck connecting building modules.", badge: "", img: "/images/products/12x3m-covered-deck/1.jpg" },
    { id: "40ft-flat-rack", name: "40ft Flat Rack", size: "40ft", capacity: "Heavy loads", desc: "Open-sided flat rack for oversized cargo and equipment transport.", badge: "", img: "/images/products/40ft-flat-rack/1.jpg" },
    { id: "stair-landing", name: "Stair & Landing", size: "Various", capacity: "Access", desc: "Portable stair and landing systems for building access and egress.", badge: "", img: "/images/products/stair-landing/1.jpg" },
    { id: "dual-hand-wash-station", name: "Dual Hand Wash Station", size: "Compact", capacity: "2 users", desc: "Standalone hand wash station with hot and cold water for site hygiene.", badge: "", img: "/images/products/dual-hand-wash-station/1.jpg" },
    { id: "wash-trough", name: "Wash Trough", size: "Various", capacity: "Multiple", desc: "Heavy-duty wash trough for boot wash and equipment cleaning stations.", badge: "", img: "/images/products/wash-trough/1.jpg" }
];

export default function AncillaryPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <span className="text-white/80 font-medium">Ancillary Equipment</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
            {PRODUCTS.length} Products Available for Hire & Sale
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ancillary <span className="gold-text">Equipment</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-lg text-base leading-relaxed serif">Supporting equipment and accessories to complete your site setup. Tanks, pumps, covered walkways, flat racks, stairs and landings, and hand wash stations.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {p.badge && <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{p.badge}</span>}
                    <div className="absolute bottom-3 left-3 z-20 text-white">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-white/70">{p.size} · {p.capacity}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 serif">{p.desc}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link href={`/hire/ancillary/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                        See Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                      <Link href="/quote" className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">Get a Quote</Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Need Help Choosing?</h2>
          <p className="text-white/50 mt-2 serif">Tell us your project requirements and we&apos;ll recommend the best solution.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 flex items-center gap-2">Get a Free Quote →</Link>
            <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 flex items-center gap-2">(07) 4979 2333</a>
          </div>
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
