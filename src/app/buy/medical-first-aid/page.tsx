import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical & First Aid Facilities for Sale | Mine-Spec First Aid Rooms — Multitrade Building Hire",
  description:
    "Purpose-built first aid rooms, medical facilities and paramedic stations for sale. Mine-spec compliant, C2 wind rated and delivered fully fitted out. Built for Queensland worksites.",
};

const PRODUCTS = [
  {
    id: "15x3-4m-first-aid-room",
    name: "15x3.4m First Aid Room",
    size: "15x3.4m",
    capacity: "2 Treatment Bays",
    desc: "Purpose-built mine-spec first aid room. Treatment bay, consult room, secure drug safe and PWD-accessible ensuite.",
    badge: "NEW",
    img: "/images/products/15x3-4m-first-aid-room/2.jpg",
  },
];

export default function MedicalFirstAidPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/buy" className="hover:text-white/60">Buy</Link><span>/</span>
            <span className="text-white/80 font-medium">Medical &amp; First Aid</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
            {PRODUCTS.length} Product Available for Purchase
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Medical &amp; First Aid <span className="gold-text">Facilities</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-lg text-base leading-relaxed">Purpose-built first aid rooms, medical facilities and paramedic stations designed to site-specific health requirements. Mine-spec compliant, C2 wind rated, and delivered fully fitted out.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all cursor-pointer">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {p.badge && <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{p.badge}</span>}
                    <div className="absolute bottom-3 left-3 z-20 text-white">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-white/70">{p.size} · {p.capacity}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{p.desc}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link href={`/buy/medical-first-aid/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                        See Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                      <AddToQuoteButton compact showServiceUpgrades buildingSize="other" product={{ id: p.id, name: p.name, size: p.size, img: p.img, category: "medical-first-aid" }} />
                    </div>
                  </div>
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
