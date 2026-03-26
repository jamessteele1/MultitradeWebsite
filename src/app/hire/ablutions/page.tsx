import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Toilet & Ablution Block Hire QLD",
  description: "Hire portable toilets, ablution blocks, and shower facilities in Queensland. Solar toilets, chemical toilets, and mine-spec compliant blocks. Multitrade Building Hire.",
};

const PRODUCTS = [
    { name: "6x3m Toilet Block", size: "6x3m", capacity: "High traffic", desc: "Large toilet block with multiple cubicles, urinals, and hand basins. Male/female configurations.", badge: "", img: "/images/products/6x3-toilet/1.jpg" },
    { name: "3.6x2.4m Toilet", size: "3.6x2.4m", capacity: "Medium traffic", desc: "Compact toilet unit ideal for smaller sites and construction projects.", badge: "", img: "/images/products/36x24-toilet/1.jpg" },
    { name: "Solar Toilet", size: "5.45x2.4m", capacity: "Medium traffic", desc: "Completely solar-powered with 2 pans and 2 hand basins. No utility connections required.", badge: "SOLAR", img: "/images/products/solar-toilet-6x24/1.jpg" },
    { name: "4.2x3m Shower Block", size: "4.2x3m", capacity: "Crew showers", desc: "Dedicated shower facility with hot water system for end-of-shift amenity.", badge: "", img: "/images/products/42x3m-ablution/1.jpg" },
    { name: "Chemical Toilet", size: "Portable", capacity: "Single use", desc: "Standalone chemical toilet for remote locations with no water connection.", badge: "", img: "/images/products/Chemical Toilet.png" },
    { name: "PWD Chemical Toilet", size: "Portable", capacity: "Accessible", desc: "Wheelchair accessible chemical toilet meeting PWD compliance requirements.", badge: "ACCESSIBLE", img: "/images/products/Chemical Toilet.png" },
    { name: "Bathhouse", size: "Custom", capacity: "Large crews", desc: "Change rooms with showers, double-stacked lockers, and bench seating.", badge: "", img: "/images/products/42x3m-ablution/2.jpg" }
];

export default function AblutionsPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <span className="text-white/80 font-medium">Ablutions & Toilets</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
            {PRODUCTS.length} Products Available for Hire & Sale
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ablutions <span className="gold-text">& Toilets</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-lg text-base leading-relaxed serif">Toilet blocks, shower facilities, solar-powered ablutions, and chemical toilets for mining, construction, and industrial worksites. All units meet Australian codes and regulations.</p>
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
                      <Link href={`/hire/ablutions/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
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
