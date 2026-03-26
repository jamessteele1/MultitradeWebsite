import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portable Building Hire Gladstone QLD",
  description: "Portable building hire in Gladstone QLD. Head office & manufacturing facility at 6 South Trees Drive. Same-day availability. Crib rooms, offices, ablutions, containers. Est. 1980.",
};

export default function GladstonePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/locations" className="hover:text-white/60">Locations</Link><span>/</span>
            <span className="text-white/80 font-medium">Gladstone</span>
          </nav>


          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-5">
                Head Office & Manufacturing — Est. 1980
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Portable Building Hire in <span className="gold-text">Gladstone</span>
              </h1>
              <p className="text-white/60 mt-4 text-lg max-w-lg">
                Our headquarters and primary manufacturing facility. Same-day availability on most fleet units. Servicing Gladstone, Curtis Island, Boyne Island, Calliope, and surrounds since 1980.
              </p>
              <div className="flex gap-3 mt-8">
                <Link href="/quote" className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-center">Get a Gladstone Quote</Link>
                <a href="tel:0749792333" className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all text-center">(07) 4979 2333</a>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-2xl shadow-black/20">
                <h3 className="font-bold text-gray-900 mb-3">Gladstone Head Office</h3>
                <div className="space-y-2.5 text-sm text-gray-600">
                  <div>6 South Trees Drive<br />PO BOX 8005<br />Gladstone QLD 4680</div>
                  <a href="tel:0749792333" className="block font-semibold text-gray-900">(07) 4979 2333</a>
                  <div>Mon–Fri: 7:00am – 5:00pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {[{ v: "HQ", l: "Head Office" }, { v: "Same Day", l: "Fleet Availability" }, { v: "Full", l: "Manufacturing" }, { v: "45+", l: "Years Here" }].map((s, i) => (
            <div key={i} className="text-center py-6 md:py-8">
              <div className="text-xl md:text-2xl font-extrabold text-gray-900">{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Areas */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Delivery Areas from Gladstone</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { n: "Boyne Island / Tannum Sands", d: "20 min", desc: "Aluminium smelter operations and coastal industrial sites." },
              { n: "Calliope", d: "25 min", desc: "Agricultural and light industrial portable building needs." },
              { n: "Curtis Island", d: "By barge", desc: "LNG plant operations — Santos GLNG, QGC, Arrow Energy." },
              { n: "Mount Larcom", d: "30 min", desc: "Limestone mining and rural site accommodation." },
              { n: "Biloela", d: "1.5 hrs", desc: "Coal mining and agricultural operations in the Callide Valley." },
              { n: "Agnes Water / 1770", d: "1.5 hrs", desc: "Tourism and construction projects on the Discovery Coast." },
            ].map((loc, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-amber-300 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">{loc.n}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{loc.d}</span>
                  </div>
                  <p className="text-sm text-gray-600">{loc.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* SEO Content */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portable Building Hire Gladstone QLD</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>Multitrade Building Hire has been Gladstone&apos;s trusted portable building provider since 1980. From our headquarters at 6 South Trees Drive, we offer the region&apos;s most comprehensive range of transportable buildings — crib rooms, site offices, ablution blocks, complexes, containers, and Queensland&apos;s first solar-powered portable facility.</p>
            <p>Strategically located in Gladstone&apos;s industrial hub, we&apos;re minutes from Curtis Island LNG operations, the Gladstone Ports precinct, and major alumina and aluminium facilities. Our in-house manufacturing capability means custom portable buildings are designed, built, and compliance-tested without leaving the yard.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Get a Quote — Gladstone Area</h2>
            <p className="text-white/50 mt-2">Local team, local knowledge. We respond within 2 hours during business hours.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110">Get Your Gladstone Quote</Link>
              <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5">(07) 4979 2333</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "LocalBusiness",
        "name": "Multitrade Building Hire - Gladstone",
        "description": "Portable building hire, sale, and manufacture in Gladstone QLD.",
        "address": { "@type": "PostalAddress", "streetAddress": "6 South Trees Drive", "addressLocality": "Gladstone", "addressRegion": "QLD", "postalCode": "4680", "addressCountry": "AU" },
        "telephone": "+61749792333", "email": "multitrade@multitrade.com.au", "url": "https://www.multitrade.com.au/locations/gladstone",
        "openingHours": "Mo-Fr 07:00-17:00", "foundingDate": "1980",
      })}} />

      <MobileCTA />
    </>
  );
}
