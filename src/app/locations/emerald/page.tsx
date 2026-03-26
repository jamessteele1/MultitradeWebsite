import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Building Hire Emerald QLD | Multitrade Building Hire",
  description: "Portable building hire in Emerald QLD. Crib rooms, site offices, ablutions for Bowen Basin mining operations. Regional depot with rapid deployment.",
};

const AREAS = [
              { name: "Blackwater", dist: "1 hr", desc: "BHP and Coronado coal mining operations." },
              { name: "Moranbah", dist: "2.5 hrs", desc: "Major Bowen Basin mining hub — BHP, Anglo American." },
              { name: "Dysart", dist: "2 hrs", desc: "Norwich Park, Saraji, and surrounding mines." },
              { name: "Capella", dist: "45 min", desc: "Peak Downs mine and Central Highlands operations." },
              { name: "Springsure", dist: "1 hr", desc: "Agricultural and resource operations south of Emerald." },
              { name: "Clermont", dist: "1.5 hrs", desc: "Blair Athol and northern basin operations." },
];
const INDUSTRIES = [
              { name: "Coal Mining", desc: "BHP, Anglo American, Coronado, and Glencore operations across the Bowen Basin." },
              { name: "Gas & Energy", desc: "CSG well pads, compression stations, and pipeline infrastructure." },
              { name: "Agriculture", desc: "Cotton, grain, and cattle operations requiring temporary facilities." },
              { name: "Civil Works", desc: "Road maintenance, bridge works, and regional infrastructure projects." },
];

export default function EmeraldPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/locations" className="hover:text-white/60">Locations</Link><span>/</span>
            <span className="text-white/80 font-medium">Emerald</span>
          </nav>
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-5">Regional Depot — Bowen Basin Access</div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">Portable Building Hire in <span className="gold-text">Emerald</span></h1>
              <p className="text-white/60 mt-4 text-lg max-w-lg leading-relaxed">Our Emerald regional depot provides rapid access to the Bowen Basin coal mines and Central Highlands operations. Established during the basin's expansion, we deliver buildings cost-effectively with quick maintenance turnaround.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/quote" className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 text-center">Get a Emerald Quote →</Link>
                <a href="tel:0749792333" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 text-center">(07) 4979 2333</a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="font-bold text-gray-900 mb-3">Emerald Office</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Industrial Drive, Emerald QLD</div>
                  <a href="tel:0749792333" className="block font-semibold text-gray-900">(07) 4979 2333</a>
                  <div>Mon–Fri: 7:00am – 5:00pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b border-gray-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery Areas from Emerald</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AREAS.map((a, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{a.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{a.dist}</span>
                  </div>
                  <p className="text-sm text-gray-600">{a.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900">Emerald Industries We Support</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-white p-5 rounded-xl border border-gray-200 h-full">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{ind.name}</h3>
                  <p className="text-sm text-gray-600">{ind.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
