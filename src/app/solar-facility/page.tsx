import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Facility | Off-Grid Power for Portable Buildings",
  description:
    "Eliminate diesel generators with Multitrade's Solar Facility. 20.5kW battery storage, upgradable to 40+ kW. ESG compliant off-grid power for remote worksites across Queensland.",
};

const FEATURES = [
  {
    title: "20.5kW Battery Storage",
    desc: "High-capacity lithium phosphate battery provides reliable power storage for site buildings, lighting, and equipment — day and night.",
  },
  {
    title: "Upgradable to 40+ kW",
    desc: "Modular design allows battery capacity to be scaled up to 40+ kW as your site grows or power demands increase.",
  },
  {
    title: "Zero Diesel, Zero Emissions",
    desc: "Completely eliminates the need for diesel generators. Reduce your carbon footprint and meet ESG and sustainability targets.",
  },
  {
    title: "Plug & Play Integration",
    desc: "Designed to power Multitrade portable buildings directly. Connects to crib rooms, site offices, and ablutions with minimal setup.",
  },
  {
    title: "Remote Monitoring",
    desc: "Monitor battery levels, solar input, and power consumption remotely. Know your system status from anywhere.",
  },
  {
    title: "Low Maintenance",
    desc: "No fuel deliveries, no oil changes, no generator servicing. Dramatically lower ongoing operational costs compared to diesel.",
  },
];

const SPECS: Record<string, string> = {
  "Battery Storage": "20.5kW lithium phosphate",
  "Max Capacity": "Upgradable to 40+ kW",
  "Solar Array": "High-efficiency PV panels",
  "Fuel Required": "None — fully solar powered",
  "Monitoring": "Remote monitoring included",
  "Compliance": "ESG / sustainability compliant",
  "Noise": "Silent operation — 0dB",
  "Maintenance": "Minimal — no diesel servicing",
  "Compatibility": "All Multitrade portable buildings",
  "Delivery": "Delivered and installed by our team",
};

export default function SolarFacilityPage() {
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-5">
            <Link href="/" className="hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <Link href="/hire" className="hover:text-white/60">
              Hire
            </Link>
            <span>/</span>
            <span className="text-white/80 font-medium">Solar Facility</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">
                  SOLAR
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold text-green-300 bg-green-900/50 border border-green-700/30">
                  ZERO EMISSIONS
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Solar Facility
              </h1>
              <p className="text-white/50 mt-1 text-sm font-medium">
                Off-Grid Power for Portable Buildings
              </p>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-lg">
                Eliminate diesel generators with our Solar Facility. Featuring
                20.5kW lithium phosphate battery storage — upgradable to 40+ kW
                — this system provides clean, silent, reliable power for your
                portable buildings. Meet your ESG targets while cutting fuel
                costs and servicing overhead.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <AddToQuoteButton
                  product={{
                    id: "solar-facility",
                    name: "Solar Facility",
                    size: "Custom",
                    img: "/images/products/solar-facility/1.jpg",
                    category: "ancillary",
                  }}
                />
                <a
                  href="tel:0749792333"
                  className="px-6 py-3 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all"
                >
                  (07) 4979 2333
                </a>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/solar-facility/1.jpg"
                alt="Multitrade Solar Facility"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm">
                ZERO DIESEL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Key Features & Benefits
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {f.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Technical Specifications
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {Object.entries(SPECS).map(([key, val], i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <span className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">
                      {key}
                    </span>
                    <span className="text-sm text-gray-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Cost Comparison vs Diesel
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                {[
                  {
                    label: "Fuel costs",
                    diesel: "$800–1,500/mo",
                    solar: "$0",
                  },
                  {
                    label: "Servicing",
                    diesel: "$200–500/mo",
                    solar: "Minimal",
                  },
                  { label: "Noise", diesel: "75+ dB", solar: "0 dB" },
                  {
                    label: "Emissions",
                    diesel: "High CO₂",
                    solar: "Zero",
                  },
                  {
                    label: "Fuel deliveries",
                    diesel: "Weekly",
                    solar: "None",
                  },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 gap-3 text-sm items-center"
                  >
                    <span className="font-medium text-gray-700">
                      {row.label}
                    </span>
                    <span className="text-red-500/80 line-through text-center">
                      {row.diesel}
                    </span>
                    <span className="text-green-700 font-semibold text-center">
                      {row.solar}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                  * Diesel costs are indicative estimates based on typical remote
                  site operations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Gallery</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "/images/products/solar-facility/1.jpg",
              "/images/products/solar-facility/2.jpg",
            ].map((img, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-gray-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Solar Facility - View ${i + 1}`}
                  className="w-full h-56 md:h-72 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to Go Solar on Your Site?
          </h2>
          <p className="text-white/50 mt-2">
            Tell us about your power requirements and we&apos;ll design a solar
            solution that eliminates your diesel dependency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/quote"
              className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all flex items-center gap-2"
            >
              Get a Free Quote
              <svg
                width="16"
                height="16"
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
            <a
              href="tel:0749792333"
              className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              (07) 4979 2333
            </a>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
