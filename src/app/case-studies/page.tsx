import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Multitrade Building Hire",
  description: "Real projects, real results. See how Multitrade Building Hire delivers portable building solutions across Queensland — from community facilities to off-grid solar offices.",
};

const CASE_STUDIES = [
  {
    slug: "gladstone-hockey",
    title: "12×3m Amenities Building",
    client: "Gladstone Hockey Association",
    location: "Gladstone, QLD",
    image: "/images/case-studies/gladstone-hockey/hero.jpg",
    tags: ["Turnkey", "Community", "DDA Compliant"],
    summary: "Full turnkey delivery of a custom 12×3m amenities building — design, manufacture, transport & installation. C2 wind rated, fully DDA compliant.",
    stats: [
      { value: "12×3m", label: "Building" },
      { value: "$210K+", label: "Value" },
      { value: "C2", label: "Wind Rating" },
    ],
  },
  {
    slug: "futura-solar",
    title: "Off-Grid Solar Site Office",
    client: "Futura Resources",
    location: "Wilton Coal Mine, Wyuna QLD",
    image: "/images/case-studies/futura-solar/hero.jpg",
    tags: ["Solar", "Off-Grid", "Mining"],
    summary: "A hire-ready solar building that eliminated diesel generation and supported a low-emission mine site strategy. Zero diesel burn, fully self-contained.",
    stats: [
      { value: "Zero", label: "Diesel" },
      { value: "Off-Grid", label: "Power" },
      { value: "Hire", label: "Model" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <a href="/" className="hover:text-white/60">Home</a><span>/</span>
            <span className="text-white/80 font-medium">Case Studies</span>
          </nav>
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-4">Real Projects. Real Results.</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Case Studies
          </h1>
          <p className="text-white/60 mt-3 text-lg max-w-2xl">
            See how Multitrade Building Hire delivers portable building solutions for clients across Queensland &mdash; from community sporting clubs to remote mining operations.
          </p>
        </div>
      </section>

      {/* Case Study Cards */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-8">
            {CASE_STUDIES.map((cs, i) => (
              <FadeIn key={cs.slug} delay={i * 0.1}>
                <Link href={`/case-studies/${cs.slug}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-2/5 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cs.image}
                        alt={cs.title}
                        className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {cs.tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-gray-700 backdrop-blur-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cs.client} &bull; {cs.location}</div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-amber-700 transition-colors">{cs.title}</h2>
                        <p className="text-gray-600 mt-3 leading-relaxed text-sm">{cs.summary}</p>
                      </div>

                      <div className="mt-6">
                        {/* Stats */}
                        <div className="flex gap-6 mb-5">
                          {cs.stats.map((s) => (
                            <div key={s.label}>
                              <div className="text-lg font-extrabold text-gray-900">{s.value}</div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-bold text-amber-700 group-hover:gap-3 transition-all">
                          Read Case Study
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Have a Project in Mind?</h2>
              <p className="text-gray-600 mb-8">Talk to Multitrade Building Hire about your portable building needs.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:0749792333" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                  (07) 4979 2333
                </a>
                <a href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white transition-colors" style={{ background: "var(--gold)" }}>
                  Get a Free Quote
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
