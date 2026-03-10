import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oil & Gas Portable Buildings | LNG Site Accommodation QLD",
  description: "Portable buildings for oil and gas operations in Queensland. LNG plant support, pipeline projects, CSG operations. Trusted by Santos, QGC, Arrow Energy.",
};

const FEATURES = [
              { icon: "✓", title: "LNG Compliant", desc: "Buildings meeting LNG plant safety and compliance requirements for Curtis Island and beyond." },
              { icon: "✓", title: "Remote Deployment", desc: "Self-contained and solar-powered options for pipeline routes and remote well pads." },
              { icon: "✓", title: "Rapid Mobilisation", desc: "Quick turnaround for shutdown support, turnaround projects, and emergency deployments." },
              { icon: "✓", title: "ESG Solutions", desc: "Solar Facility eliminates diesel generators, reducing emissions for ESG reporting." },
];

const REGIONS = [
              { name: "Curtis Island", desc: "Santos GLNG, QCLNG, and APLNG operations via barge delivery." },
              { name: "Surat Basin", desc: "Roma, Chinchilla, Miles — CSG well pads and compression stations." },
              { name: "Gladstone Region", desc: "LNG support facilities, laydown areas, and contractor compounds." },
              { name: "Bowen Basin", desc: "Coal seam gas operations and associated infrastructure." },
              { name: "Central QLD Pipeline Routes", desc: "Temporary facilities for pipeline construction and maintenance." },
              { name: "North QLD", desc: "Gas processing and distribution infrastructure support." },
];

export default function OilgasPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/industries" className="hover:text-white/60">Industries</Link><span>/</span>
            <span className="text-white/80 font-medium">Oil & Gas</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-6">Curtis Island LNG & Surat Basin Experience</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Portable Buildings for <span className="gold-text">Oil & Gas</span>
            </h1>
            <p className="text-white/60 mt-5 text-lg leading-relaxed serif">Compliant portable buildings for LNG plants, pipeline projects, CSG operations, and processing facilities. Trusted by Santos GLNG, QGC, Arrow Energy, and major EPC contractors across Queensland.</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/quote" className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 text-center">Get a Quote →</Link>
              <a href="tel:0749792333" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 text-center">(07) 4979 2333</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Why Choose Multitrade</div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Built for Oil & Gas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all h-full">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-amber-50 text-amber-600 text-lg font-bold">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Regions We Service</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONS.map((r, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-amber-300 transition-all">
                  <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
                  <p className="text-sm text-gray-600">{r.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ready to Discuss Your Oil & Gas Project?</h2>
          <p className="text-white/50 mt-2 serif">Our team will assess your requirements and recommend the best solution.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110">Get a Free Quote →</Link>
            <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5">(07) 4979 2333</a>
          </div>
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
