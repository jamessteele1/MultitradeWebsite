import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve | Mining, Construction, Oil & Gas & Civil",
  description:
    "Mine-spec portable buildings for Queensland's mining, construction, oil & gas, and civil infrastructure sectors. 45+ years, the largest privately owned fleet in QLD.",
  alternates: { canonical: "https://www.multitrade.com.au/industries" },
};

const INDUSTRIES = [
  {
    name: "Mining & Resources",
    href: "/industries/mining",
    img: "/images/products/solar-facility/1.jpg",
    tag: "Bowen Basin · Central QLD",
    desc: "Mine-spec, C-RES BMA certified crib rooms, offices, ablutions and off-grid solar facilities. Trusted by BHP, Rio Tinto, Glencore and Anglo American.",
  },
  {
    name: "Construction",
    href: "/industries/construction",
    img: "/images/products/12x3-office/1.jpg",
    tag: "Statewide",
    desc: "Fast-deploy site offices, crib rooms, toilet blocks and storage containers for construction sites across Queensland — mine-spec quality on every project.",
  },
  {
    name: "Oil & Gas",
    href: "/industries/oil-gas",
    img: "/images/products/12x6m-complex/1.jpg",
    tag: "LNG · Pipeline · CSG",
    desc: "Accommodation and facilities for LNG plants, pipeline and CSG operations. Trusted by Santos, QGC and Arrow Energy across the Surat Basin and beyond.",
  },
  {
    name: "Civil Infrastructure",
    href: "/industries/civil",
    img: "/images/products/12x3-mobile-crib-room/1.jpg",
    tag: "Road · Bridge · Water",
    desc: "Mobile crib rooms and site offices for road works, bridge construction and water infrastructure — built to move with the job.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 50%, var(--navy-3) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80 font-medium">Industries</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-6">
              45+ Years · Queensland&apos;s Largest Privately Owned Fleet
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Portable Buildings{" "}
              <span className="gold-text">Built for Your Industry</span>
            </h1>
            <p className="text-white/60 mt-5 text-lg max-w-xl">
              From the Bowen Basin to the coast, we design, manufacture, hire,
              install and maintain mine-spec crib rooms, site offices, ablutions
              and complexes for Queensland&apos;s toughest sectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/quote"
                className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-center"
              >
                Get a Free Quote
              </Link>
              <a
                href="tel:0749792333"
                className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all text-center"
              >
                (07) 4979 2333
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Industry cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="mb-10 text-center">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">
              Sectors We Serve
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Four industries, one trusted partner
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Every sector has its own demands. Explore how we tailor buildings,
              compliance and logistics to yours.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {INDUSTRIES.map((ind, i) => (
              <FadeIn key={ind.href} delay={i * 0.08}>
                <Link
                  href={ind.href}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-amber-300 hover:shadow-xl transition-all h-full"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={ind.img}
                      alt={ind.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-xs text-white/70 mb-1">{ind.tag}</div>
                      <div className="text-2xl font-extrabold text-white leading-tight">
                        {ind.name}
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {ind.desc}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold gold-text">
                      Explore {ind.name}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why across industries */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, var(--navy), var(--navy-2))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Why Queensland Industry Chooses Multitrade
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { v: "45+", l: "Years in Operation", s: "Established 1980" },
              { v: "#1", l: "Privately Owned Fleet", s: "Largest in Queensland" },
              { v: "Mine Spec", l: "Compliance Standard", s: "C-RES BMA certified" },
              { v: "Turnkey", l: "End to End", s: "Design · build · install" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-3xl font-extrabold text-white">
                    {stat.v}
                  </div>
                  <div className="text-sm font-semibold text-white/80 mt-1">
                    {stat.l}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">{stat.s}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Portable Building Hire Across Queensland Industries
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              Since 1980, Multitrade Building Hire has supplied portable and
              modular buildings to Queensland&apos;s mining, construction, oil
              &amp; gas, and civil infrastructure sectors. From our yards in
              Gladstone and Emerald, we hire, sell, install and
              custom-manufacture crib rooms, site offices, ablution blocks,
              complexes and containers — delivered mine-spec and ready to work.
            </p>
            <p>
              Whatever your sector, you get one point of contact from design
              through to installation and ongoing maintenance, backed by
              Queensland&apos;s largest privately owned fleet. Explore your
              industry above, or{" "}
              <Link href="/quote" className="text-blue-600 hover:underline">
                request a free quote
              </Link>{" "}
              and we&apos;ll tailor a solution to your site.
            </p>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
