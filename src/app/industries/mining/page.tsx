import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mining & Resources | Portable Buildings for Mine Sites",
  description: "Mine-spec portable buildings for QLD mining operations. C-RES BMA Certified. Crib rooms, offices, ablutions, and solar facilities. Trusted by BHP, Rio Tinto, Glencore.",
};

const MINING_PRODUCTS = [
  { name: "12x3m Crib Room", cat: "Crib Rooms", size: "12x3m", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=340&fit=crop", desc: "Spacious break facility for crews up to 20. Full kitchenette and climate control." },
  { name: "Mobile Crib Room", cat: "Self-Contained", size: "12.5x3m", img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=340&fit=crop", desc: "Fully towable with 11.2kVA generator and onboard water.", badge: "POPULAR" },
  { name: "12x3m Site Office", cat: "Offices", size: "12x3m", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=340&fit=crop", desc: "Professional workspace for project management and administration." },
  { name: "6x3m Toilet Block", cat: "Ablutions", size: "6x3m", img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=340&fit=crop", desc: "Mine-spec compliant toilet facilities with male/female configurations." },
  { name: "Solar Facility", cat: "Solar", size: "Custom", img: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=340&fit=crop", desc: "Off-grid solar power. 8.85kW PV with 32.8kWh lithium battery.", badge: "NEW" },
  { name: "12x12m Complex", cat: "Complexes", size: "12x12m", img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=500&h=340&fit=crop", desc: "Multi-module complex combining offices, crib rooms, and ablutions." },
];


export default function MiningPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 50%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/industries" className="hover:text-white/60">Industries</Link><span>/</span>
            <span className="text-white/80 font-medium">Mining & Resources</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-6">
              C-RES BMA Certified Company
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Portable Buildings for <span className="gold-text">Mining & Resources</span>
            </h1>
            <p className="text-white/60 mt-5 text-lg max-w-lg serif">
              Trusted by BHP, Rio Tinto, Glencore, and Anglo American. Mine-spec compliant, rapid deployment, across the Bowen Basin and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/quote" className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-center">Get a Mining Quote</Link>
              <a href="tel:0749792333" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all text-center">(07) 4979 2333</a>
            </div>
          </div>
        </div>
      </section>


      {/* Trust Bar */}
      <section className="bg-gray-50 border-b border-gray-200 py-5">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 overflow-x-auto">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">Trusted by:</span>
          {["BHP", "Glencore", "Anglo American", "Rio Tinto", "Thiess", "Coronado", "Downer", "UGL"].map((n, i) => (
            <span key={i} className="text-sm font-bold text-gray-300 tracking-wider whitespace-nowrap uppercase">{n}</span>
          ))}
        </div>
      </section>

      {/* Why Mining */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Built for the Demands of Mining</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Mine-Spec Compliant", d: "Every building meets Tier 1 requirements. Full electrical compliance and safety systems. C-RES BMA certified." },
              { t: "Rapid Deployment", d: "Fleet ready in Gladstone and Emerald yards. Typically 3-5 days to site across the Bowen Basin." },
              { t: "Off-Grid Solar", d: "Solar Facility with 8.85kW PV and 32.8kWh lithium battery. Eliminate generator costs." },
              { t: "Full Project Support", d: "Design, manufacture, transport, install, maintain. One point of contact from inception to completion." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="p-6 rounded-xl border border-gray-200 hover:border-amber-300 hover:shadow-lg transition-all h-full">
                  <h3 className="font-bold text-gray-900 mb-2">{item.t}</h3>
                  <p className="text-sm text-gray-500">{item.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* Products for Mining */}
      <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Popular for Mine Sites</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MINING_PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {p.badge && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{p.badge}</span>}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-xs text-white/70 mb-0.5">{p.cat} · {p.size}</div>
                      <div className="text-white font-bold">{p.name}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 serif">{p.desc}</p>
                    <Link href="/quote" className="block text-center py-2 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">Get a Quote</Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200">
              <p className="text-lg text-gray-700 serif leading-relaxed">
                &ldquo;Our site had no power or water available — having an off-grid option was the biggest driver to go solar. The site team love it. There&apos;s no diesel burn compared to the old mobile unit and it&apos;s considerably quieter. Alternative energy and maintaining low carbon emissions is something we&apos;re striving for.&rdquo;
              </p>
              <div className="mt-6"><div className="font-bold text-gray-900 text-sm">Futura Resources</div><div className="text-xs text-gray-500">Solar Facility Client — Remote QLD Mining Operation</div></div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* Safety Stats */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Your Safety Is Our Standard</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { v: "0", l: "Lost Time Injuries", s: "In over 5 years" },
              { v: "100%", l: "Mine Spec Compliant", s: "All fleet units" },
              { v: "<5yr", l: "Average Fleet Age", s: "Modern & maintained" },
              { v: "Tier 1", l: "Client Approved", s: "BHP, Rio Tinto, Glencore" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-extrabold text-white">{stat.v}</div>
                  <div className="text-sm font-semibold text-white/80 mt-1">{stat.l}</div>
                  <div className="text-xs text-white/40 mt-0.5">{stat.s}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portable Building Hire for Mining Sites — Queensland</h2>
          <div className="text-sm text-gray-600 space-y-3 serif">
            <p>Multitrade Building Hire has been the trusted portable building partner for Queensland&apos;s mining and resources sector since 1980. From our yards in Gladstone and Emerald, we provide rapid deployment of mine-spec crib rooms, site offices, ablution blocks, and complexes across the Bowen Basin, Central Highlands, Surat Basin, and beyond.</p>
            <p>As a C-RES BMA Certified company with zero lost time injuries in over 5 years, safety is embedded in our culture. Our fleet — Queensland&apos;s largest privately owned — is maintained to Tier 1 standards with an average age under 5 years.</p>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
