import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Building Hire QLD | Crib Rooms, Offices, Ablutions — Multitrade",
  description: "Hire portable buildings across Central Queensland. Crib rooms, site offices, ablutions, complexes, containers, and ancillary equipment. Mine-spec compliant. 45+ years experience.",
};

const CATEGORIES = [
  {
    name: "Crib Rooms",
    href: "/hire/crib-rooms",
    img: "/images/products/12x3-crib-room/1.jpg",
    desc: "Portable break facilities for 8–20 workers. Standard, self-contained, and mobile units available.",
    count: 6,
  },
  {
    name: "Site Offices",
    href: "/hire/site-offices",
    img: "/images/products/12x3-office/1.jpg",
    desc: "Professional portable offices from compact 3x3m units to large 12x3m open-plan workspaces and gatehouses.",
    count: 7,
  },
  {
    name: "Ablutions & Toilets",
    href: "/hire/ablutions",
    img: "/images/products/6x3-toilet/1.jpg",
    desc: "Portable toilet and shower blocks for worksites. Standard and solar-powered units in a range of sizes.",
    count: 5,
  },
  {
    name: "Complexes",
    href: "/hire/complexes",
    img: "/images/products/12x6m-complex/1.jpg",
    desc: "Multi-unit modular complexes combining offices, crib rooms, and ablutions into integrated site facilities.",
    count: 3,
  },
  {
    name: "Containers",
    href: "/hire/containers",
    img: "/images/products/20ft-container/1.jpg",
    desc: "General purpose, dangerous goods, and refrigerated shipping containers in 10ft, 20ft, and 40ft sizes.",
    count: 6,
  },
  {
    name: "Ancillary",
    href: "/hire/ancillary",
    img: "/images/products/stair-landing/1.jpg",
    desc: "Stairs, landings, covered decks, water tanks, waste tanks, road barriers, and wash facilities.",
    count: 8,
  },
];

export default function HireIndexPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <span className="text-white/80 font-medium">Hire</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Portable Building <span className="gold-text">Hire</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-base leading-relaxed serif">
            Everything your worksite needs — from crib rooms and offices to ablutions, complexes, containers, and ancillary equipment. Mine-spec compliant and delivered across Central Queensland.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <Link href={cat.href} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 transition-all block">
                  <div className="relative h-52 overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-xl font-extrabold tracking-tight">{cat.name}</div>
                      <div className="text-xs text-white/70 mt-0.5">{cat.count} products</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 serif leading-relaxed mb-3">{cat.desc}</p>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 flex items-center gap-1 transition-colors">
                      Browse {cat.name}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Not Sure What You Need?
          </h2>
          <p className="text-white/50 mt-2 serif">
            Tell us about your project and we&apos;ll recommend the right buildings for your site.
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
