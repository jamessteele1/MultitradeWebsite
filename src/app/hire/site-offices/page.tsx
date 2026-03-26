import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Office Hire QLD | Portable Offices",
  description: "Hire portable site offices in Queensland. 3x3m to 12x3m offices, container conversions, gatehouses. Mine-spec compliant. Multitrade Building Hire.",
};

const PRODUCTS = [
    { id: "12x3m-office", name: "12x3m Office", size: "12x3m", capacity: "6-8 desks", desc: "Large open-plan or partitioned office with full electrical and data fit-out.", badge: "POPULAR", img: "/images/products/12x3-office/1.jpg" },
    { id: "6x3m-office", name: "6x3m Office", size: "6x3m", capacity: "2-4 desks", desc: "Mid-size office ideal for site supervisors and project coordinators.", badge: "", img: "/images/products/6x3-office/1.jpg" },
    { id: "6x3m-supervisor-office", name: "6x3m Supervisor Office", size: "6x3m", capacity: "1-2 desks", desc: "Dedicated supervisor workspace with ergonomic furniture and storage.", badge: "", img: "/images/products/6x3m-supervisor-office/1.jpg" },
    { id: "3x3m-office", name: "3x3m Office", size: "3x3m", capacity: "1-2 desks", desc: "Compact single-person office for gatekeepers and security staff.", badge: "", img: "/images/products/3x3-office/1.jpg" },
    { id: "20ft-container-office", name: "20ft Container Office", size: "6x2.4m", capacity: "2-3 desks", desc: "Converted shipping container with full office fit-out. Robust and secure.", badge: "", img: "/images/products/20ft-container-office/1.jpg" },
    { id: "gatehouse", name: "Gatehouse", size: "10.5x3.4m", capacity: "1-2 staff", desc: "Purpose-built security and access control building for site entry points.", badge: "", img: "/images/products/gatehouse/1.jpg" },
    { id: "self-contained-supervisor-office", name: "Self-Contained Supervisor Office", size: "6.6x3m", capacity: "1-2 desks", desc: "Office with integrated bathroom. No external connections required.", badge: "SELF-CONTAINED", img: "/images/products/6x3m-supervisor-office/1.jpg" },
    { id: "solar-facility", name: "Solar Facility", size: "Custom", capacity: "Off-grid power", desc: "Off-grid solar power system with 8.85kW PV array and 32.8kWh lithium phosphate battery. Eliminates diesel generators.", badge: "SOLAR", img: "/images/products/solar-facility/1.jpg" }
];

export default function SiteofficesPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <span className="text-white/80 font-medium">Site Offices</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
            {PRODUCTS.length} Products Available for Hire & Sale
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Site <span className="gold-text">Offices</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-lg text-base leading-relaxed">Professional portable offices for project management and site administration. From compact 3x3m offices to 12x3m open-plan workspaces, container office conversions, and gatehouses.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-black/5 transition-all cursor-pointer">
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
                      <Link href={`/hire/site-offices/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
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

      <MobileCTA />
    </>
  );
}
