import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations | Portable Building Hire Across Central Queensland",
  description:
    "Portable building hire across Central Queensland — Gladstone (head office), Emerald, the Bowen Basin, Mackay and Rockhampton. Rapid deployment from our Gladstone and Emerald yards since 1980.",
  alternates: { canonical: "https://www.multitrade.com.au/locations" },
};

const LOCATIONS = [
  {
    name: "Gladstone",
    href: "/locations/gladstone",
    badge: "Head Office",
    blurb:
      "Our headquarters and main manufacturing yard at 6 South Trees Drive — same-day fleet availability for Gladstone, Curtis Island, Boyne Island and Calliope.",
  },
  {
    name: "Emerald",
    href: "/locations/emerald",
    badge: "Regional Yard",
    blurb:
      "Central Highlands depot with rapid deployment to Bowen Basin mining operations and surrounding resource projects.",
  },
  {
    name: "Bowen Basin",
    href: "/locations/bowen-basin",
    badge: "Mining Region",
    blurb:
      "Camp accommodation, crib rooms, offices and ablutions for the coal fields — deployed fast from our Gladstone and Emerald yards.",
  },
  {
    name: "Mackay",
    href: "/locations/mackay",
    blurb:
      "Mining accommodation, site offices and crib rooms for the Bowen Basin's southern corridor and the greater Mackay region.",
  },
  {
    name: "Rockhampton",
    href: "/locations/rockhampton",
    blurb:
      "Site offices, crib rooms and ablutions for Central Queensland construction and mining — delivered from Gladstone in under two hours.",
  },
];

function PinIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function LocationsPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)",
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80 font-medium">Locations</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-5">
              Two Queensland Yards — Gladstone &amp; Emerald
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Portable Building Hire Across{" "}
              <span className="gold-text">Central Queensland</span>
            </h1>
            <p className="text-white/60 mt-4 text-lg max-w-xl">
              Headquartered in Gladstone with a regional yard in Emerald, we
              deliver crib rooms, site offices, ablutions and complexes right
              across the Bowen Basin and Central Queensland — since 1980.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/quote"
                className="px-8 py-4 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all text-center"
              >
                Get a Quote
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

      {/* Location cards */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">
              Where We Service
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Local teams across the region
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Pick your area for local knowledge, delivery times and the nearest
              yard.
            </p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LOCATIONS.map((loc, i) => (
              <FadeIn key={loc.href} delay={i * 0.06}>
                <Link
                  href={loc.href}
                  className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 p-6 hover:border-amber-300 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <PinIcon />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {loc.name}
                      </h3>
                      {loc.badge && (
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                          {loc.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    {loc.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold gold-text">
                    Portable building hire in {loc.name}
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
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Portable Building Hire Across Central Queensland
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              Multitrade Building Hire has served Central Queensland since 1980.
              From our Gladstone headquarters and manufacturing facility at 6
              South Trees Drive — and our regional yard in Emerald — we hire,
              sell, install and custom-manufacture crib rooms, site offices,
              ablution blocks, complexes and containers across the region.
            </p>
            <p>
              We deliver rapidly to the Bowen Basin coal fields, the Central
              Highlands, Mackay&apos;s southern corridor, Rockhampton and the
              Gladstone industrial precinct. Choose your area above for local
              delivery times and contact details, or{" "}
              <Link href="/quote" className="text-blue-600 hover:underline">
                request a free quote
              </Link>{" "}
              and we&apos;ll deploy from the nearest yard.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 md:py-20"
        style={{
          background: "linear-gradient(135deg, var(--navy), var(--navy-2))",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Not sure which yard is closest?
            </h2>
            <p className="text-white/50 mt-2">
              Give us a call — we&apos;ll sort delivery from wherever&apos;s
              nearest. We respond within 2 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Link
                href="/quote"
                className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110"
              >
                Get a Quote
              </Link>
              <a
                href="tel:0749792333"
                className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5"
              >
                (07) 4979 2333
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
