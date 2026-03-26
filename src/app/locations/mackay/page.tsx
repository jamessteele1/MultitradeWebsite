import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Building Hire Mackay QLD | Multitrade Building Hire",
  description: "Portable building hire in Mackay QLD. Mining accommodation, site offices, crib rooms for Bowen Basin southern corridor. Multitrade Building Hire.",
};

const AREAS = [
              { name: "Mackay CBD", dist: "3 hrs", desc: "Commercial and industrial development projects." },
              { name: "Sarina", dist: "3.5 hrs", desc: "Sugar industry and agricultural operations." },
              { name: "Hay Point / Dalrymple Bay", dist: "3 hrs", desc: "Coal export terminal operations and maintenance." },
              { name: "Nebo", dist: "3.5 hrs", desc: "Gateway to northern Bowen Basin mining operations." },
              { name: "Coppabella", dist: "3.5 hrs", desc: "Mining accommodation hub for basin operations." },
              { name: "Collinsville", dist: "4 hrs", desc: "Glencore mining operations and regional infrastructure." },
];
const INDUSTRIES = [
              { name: "Mining", desc: "Coal mining support, shutdown accommodation, and camp facilities." },
              { name: "Port Operations", desc: "Hay Point and Dalrymple Bay coal terminal support." },
              { name: "Sugar Industry", desc: "Mill maintenance shutdowns and seasonal worker accommodation." },
              { name: "Construction", desc: "Residential growth and commercial development projects." },
];

export default function MackayPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/locations" className="hover:text-white/60">Locations</Link><span>/</span>
            <span className="text-white/80 font-medium">Mackay</span>
          </nav>
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-5">Southern Bowen Basin Gateway</div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">Portable Building Hire in <span className="gold-text">Mackay</span></h1>
              <p className="text-white/60 mt-4 text-lg max-w-lg leading-relaxed">Gateway to the southern Bowen Basin. We service Mackay and the surrounding mining corridor from our Queensland fleet, delivering portable buildings for resource, construction, and port operations.</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/quote" className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 text-center">Get a Mackay Quote →</Link>
                <a href="tel:0749792333" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 text-center">(07) 4979 2333</a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <h3 className="font-bold text-gray-900 mb-3">Mackay Office</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>6 South Trees Drive, Gladstone QLD 4680</div>
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
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery Areas from Mackay</h2>
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
            <h2 className="text-2xl font-extrabold text-gray-900">Mackay Industries We Support</h2>
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
