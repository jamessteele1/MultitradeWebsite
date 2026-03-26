import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import CatalogueDownload from "@/components/CatalogueDownload";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Portable Buildings QLD | Custom & Standard Fleet — Multitrade",
  description:
    "Purchase portable buildings in Queensland. Custom-designed solutions for mining, construction & civil projects, plus our standard fleet of crib rooms, offices, ablutions & more. 45+ years experience.",
};

const CUSTOM_CATEGORIES = [
  {
    name: "Mining Camp Facilities",
    img: "/images/products/12x6m-complex/1.jpg",
    desc: "Complete camp setups — crib rooms, ablutions, laundries, and recreation facilities configured to your site layout and crew size.",
    stat: "Camps for 20–2,000+",
  },
  {
    name: "Site Office Complexes",
    img: "/images/products/12x3-office/1.jpg",
    desc: "Multi-module office configurations with reception areas, meeting rooms, and open-plan workspaces joined under shared rooflines.",
    stat: "Multi-module designs",
  },
  {
    name: "Medical & First Aid",
    img: "/images/buildings-web/_CWM6175.jpg",
    desc: "Purpose-built first aid rooms, medical facilities, and paramedic stations designed to site-specific health requirements.",
    stat: "Mine-spec compliant",
  },
  {
    name: "Wet Mess & Kitchen Facilities",
    img: "/images/buildings-web/_CWM3930.jpg",
    desc: "Commercial kitchen fit-outs, dining halls, and wet mess facilities built to food safety standards for remote worksites.",
    stat: "Commercial grade",
  },
  {
    name: "Ablution Blocks",
    img: "/images/products/6x3-toilet/1.jpg",
    desc: "Custom shower and toilet configurations from small 2-cubicle blocks through to large-scale ablution facilities for major projects.",
    stat: "Any configuration",
  },
  {
    name: "Specialist & Unique Builds",
    img: "/images/buildings-web/_CWM3960.jpg",
    desc: "Control rooms, workshops, laboratories, communications huts, and anything else your project requires. If you can brief it, we can build it.",
    stat: "200+ designs delivered",
  },
];

const STANDARD_FLEET = [
  {
    name: "Crib Rooms",
    href: "/buy/crib-rooms",
    img: "/images/products/12x3-crib-room/1.jpg",
    desc: "Portable break facilities for 8–20 workers. Standard, self-contained, and mobile units.",
    count: 6,
  },
  {
    name: "Site Offices",
    href: "/buy/site-offices",
    img: "/images/products/12x3-office/1.jpg",
    desc: "Professional portable offices from compact 3x3m to large 12x3m open-plan workspaces.",
    count: 7,
  },
  {
    name: "Ablutions & Toilets",
    href: "/buy/ablutions",
    img: "/images/products/6x3-toilet/1.jpg",
    desc: "Portable toilet and shower blocks. Standard and solar-powered units in a range of sizes.",
    count: 5,
  },
  {
    name: "Complexes",
    href: "/buy/complexes",
    img: "/images/products/12x6m-complex/1.jpg",
    desc: "Multi-unit modular complexes combining offices, crib rooms, and ablutions into one facility.",
    count: 3,
  },
  {
    name: "Containers",
    href: "/buy/containers",
    img: "/images/products/20ft-container/1.jpg",
    desc: "General purpose, dangerous goods, and refrigerated containers in 10ft, 20ft, and 40ft.",
    count: 6,
  },
  {
    name: "Ancillary",
    href: "/buy/ancillary",
    img: "/images/products/stair-landing/1.jpg",
    desc: "Stairs, landings, covered decks, water tanks, waste tanks, barriers, and wash facilities.",
    count: 8,
  },
];

export default function BuyIndexPage() {
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
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/80 font-medium">Buy</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Portable Building <span className="gold-text">Sales</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-base leading-relaxed">
            Purchase new or refurbished portable buildings — from custom-designed
            solutions built to your exact specifications, to our ready-to-go
            standard fleet. Manufactured in Gladstone, delivered Australia-wide.
          </p>
        </div>
      </section>

      {/* Custom Building Solutions */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-700 font-semibold mb-4">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                DESIGN &amp; BUILD
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customise Your Building Solution
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                We design and manufacture portable buildings to your exact
                requirements. With over 200 custom designs delivered across
                mining, construction, and civil projects — if you can brief it,
                we can build it.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CUSTOM_CATEGORIES.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">
                        CUSTOM
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">{cat.name}</div>
                      <div className="text-xs text-white/70">{cat.stat}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                    <Link
                      href="/quote"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors"
                    >
                      Request Custom Quote
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Custom Build Process */}
          <FadeIn delay={0.3}>
            <div className="mt-12 bg-gray-50 rounded-2xl border border-gray-200 p-6 md:p-10">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                How It Works
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    step: "01",
                    title: "Brief Us",
                    desc: "Tell us what you need — size, layout, features, and site conditions. We'll ask the right questions.",
                  },
                  {
                    step: "02",
                    title: "We Design",
                    desc: "Our team produces detailed floorplans and specifications tailored to your project requirements.",
                  },
                  {
                    step: "03",
                    title: "We Build",
                    desc: "Manufactured in our Gladstone facility with full quality control and compliance checks.",
                  },
                  {
                    step: "04",
                    title: "We Deliver",
                    desc: "Transported and installed on your site, ready to work. Full handover and documentation included.",
                  },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gold text-white text-sm font-extrabold mb-3">
                      {s.step}
                    </div>
                    <div className="font-bold text-gray-900 mb-1">
                      {s.title}
                    </div>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-gray-200" />
      </div>

      {/* Standard Fleet */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-600 font-semibold mb-4">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                READY TO GO
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Standard Fleet
              </h2>
              <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                Our proven range of portable buildings available for immediate
                purchase. New builds and quality refurbished units — the same
                mine-spec fleet trusted by Tier 1 operators across Queensland.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STANDARD_FLEET.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <Link
                  href={cat.href}
                  className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all block"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-xl font-extrabold tracking-tight">
                        {cat.name}
                      </div>
                      <div className="text-xs text-white/70 mt-0.5">
                        {cat.count} products
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                      {cat.desc}
                    </p>
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 flex items-center gap-1 transition-colors">
                      Browse {cat.name}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
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

      {/* Catalogue Download */}
      <CatalogueDownload />

      {/* SEO Content */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Portable Building Sales — Queensland
          </h2>
          <div className="text-sm text-gray-600 space-y-3">
            <p>
              Multitrade Building Hire manufactures and sells portable buildings
              for mining, construction, and civil projects throughout Queensland
              and Australia. Whether you need a single site office or a complete
              modular camp facility for 2,000+ workers, our team designs and
              builds to your exact specifications.
            </p>
            <p>
              Our standard fleet includes crib rooms, site offices, ablution
              blocks, building complexes, shipping containers, and ancillary
              equipment — all mine-spec compliant and ready for immediate
              delivery. For unique requirements, our custom design and build
              service has delivered over 200 bespoke solutions across the Bowen
              Basin, Surat Basin, and Central Queensland.
            </p>
            <p>
              With manufacturing facilities in Gladstone, over 45 years of
              industry experience, and a zero lost time injury safety record,
              Multitrade is Queensland&apos;s most trusted portable building
              supplier. Contact us for a no-obligation quote on any standard or
              custom building solution.
            </p>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
