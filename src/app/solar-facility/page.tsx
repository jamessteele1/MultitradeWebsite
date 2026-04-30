"use client";

import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";
import FloorplanViewer from "@/components/FloorplanViewer";
import PdfDownloadGate from "@/components/PdfDownloadGate";
import { useState } from "react";

const MODELS = [
  {
    id: "solar-facility-12x335",
    name: "12x3.35m Solar Facility",
    size: "1200cm × 335cm",
    solarPanels: "15 × Jinko 590W panels",
    solarOutput: "8.85kW PV",
    batteryStandard: "5 × 4.1kWh Troppo Batteries = 20.5kWh",
    batteryMax: "8 × 4.1kWh = 32.8kWh",
    powerOutput: "8,000W continuous (Max 16,000W, 10S)",
    ac: "1 × 5.0kW Mitsubishi Heavy Industries Reverse Cycle Split System",
    door: "1 × 2040×920mm External Metal Clad Door, Crimsafe Security Screen, Door Closer",
    windows: "3 × 1200×1200mm Sliding Glass Windows, Crimsafe Mesh, Internal Roller Blinds",
    kitchenette: "2300mm Bench Top with single bowl sink, 3190mm overhead cupboards, 1400mm bench with overhead storage",
    water: "650L potable water tank + 650L grey water tank, pressure pump & filter",
    gpos: "10 × Double GPO + 2 × Single GPO",
    leds: "3 × 1200mm internal + 1 × 600mm internal, 3 × 600mm external",
    floorPlan: "/images/floorplans/SQF-4586-01-A - 12.0x3.35m Solar Facility - Floor Plan.pdf",
  },
  {
    id: "solar-facility-9x335",
    name: "9x3.35m Solar Facility",
    size: "900cm × 335cm",
    solarPanels: "12 × Jinko 590W panels",
    solarOutput: "7.08kW PV",
    batteryStandard: "5 × 4.1kWh Troppo Batteries = 20.5kWh",
    batteryMax: "8 × 4.1kWh = 32.8kWh",
    powerOutput: "8,000W continuous (Max 16,000W, 10S)",
    ac: "1 × 5.0kW MHI Inverter Reverse Cycle Split System",
    door: "1 × 2040×920mm External Metal Clad Door, Crimsafe Security Screen, Door Closer",
    windows: "3 × 1200×1200mm Sliding Glass Windows, Crimsafe Mesh, Internal Roller Blinds",
    kitchenette: "2300mm Bench Top with single bowl sink, 3190mm overhead cupboards, 1400mm bench with overhead storage",
    water: "650L potable water tank + 650L grey water tank, pressure pump & filter",
    gpos: "8 × Double GPO + 2 × Single GPO",
    leds: "2 × 1200mm internal + 1 × 600mm internal, 3 × 600mm external",
    floorPlan: "/images/floorplans/SQF-4641-01-A - 9.0x3.35m Solar Facility - Floor Plan.pdf",
  },
];

const FEATURES = [
  {
    title: "RedEarth 'Bush Chook' Off-Grid Power",
    desc: "Australian-made lithium phosphate battery system with 20.5kWh standard, expandable to 32.8kWh. Developed in collaboration with RedEarth, supported by the Australian Government's AusIndustry Entrepreneurs Programme.",
  },
  {
    title: "High-Performance Solar Array",
    desc: "Up to 15 × Jinko 590W MPPT PV panels producing 8.85kW. Panels double as a tropical roof providing an air gap across the entire roof for additional insulation.",
  },
  {
    title: "Zero Diesel, Zero Emissions",
    desc: "Completely eliminates diesel generators. No fuel deliveries, no oil changes, no generator servicing. Reduce your carbon footprint and meet ESG and sustainability targets.",
  },
  {
    title: "Immediate Site Establishment",
    desc: "No downtime waiting for external services. No electrical or plumbing sub-trades needed — delivered and operational immediately. Just place and power up.",
  },
  {
    title: "Remote Monitoring",
    desc: "Monitor battery levels, solar input, and power consumption remotely via Red Earth's EMU app on computer and mobile dashboards.",
  },
  {
    title: "Versatile & Customisable",
    desc: "Open plan layout suits office setups or crib room configurations. The wider 3.35m width provides more ergonomic flow and space than standard 3.0m buildings.",
  },
  {
    title: "Comfortable & Quiet",
    desc: "R2.0 wall batts, R1.8 ceiling batts, and R2.3 roof blanket insulation. All windows fitted with blackout blinds and Crimsafe security screens. Silent operation — no generator noise.",
  },
  {
    title: "Self-Contained Water System",
    desc: "650L potable water tank and 650L grey water tank with WaterPro pressure pump and filter. 50mm cam lock fill point for easy refilling.",
  },
];

const CONSTRUCTION = [
  "75mm Steel Frame Construction",
  "200×75mm PFC Bearers",
  "C10015 Floor Joists @ 600mm Centres",
  "19mm T&G F11 Plywood Flooring",
  "2mm Commercial Vinyl Floor Covering, Coved 100mm Up Walls",
  "2400mm Internal Ceiling Height",
  "Pre-finished Plywood Internal Wall & Ceiling Lining",
  "R2.0 Wall Batts, R1.8 Ceiling Batts & R2.3 Roof Blanket Insulation",
  "Colorbond 'Panelrib' Profile Horizontal Wall Cladding",
  "Zincalume 'Trimdek' Profile Roof Sheeting",
  "Colorbond Barge Capping With Stop Ends",
];

const STANDARD_INCLUSIONS = [
  "1 × 2040×920mm External Metal Clad Door with Crimsafe",
  "3 × 1200×1200mm Sliding Glass Windows with Crimsafe",
  "1 × 5.0kW Inverter Reverse Cycle Split System AC",
  "1 × 2300mm Bench Top & Splashback with Cupboards",
  "1 × 3190mm Overhead Cupboards",
  "1 × 1400mm Bench Top with Overhead Storage",
  "1 × 3L Boiling Water Unit — Wall Mounted",
  "1 × Macerator Pump — Under Sink",
  "1 × Stainless Steel Hand Basin with Soap/Towel Dispenser",
  "1 × RedEarth 'Bush Chook' Off-Grid Power System",
  "15 × Jinko 590W Solar Panels (8.85kW PV)",
  "2 × Lockable Double Mesh Gates",
  "1 × 650L Potable Water Slimline Tank",
  "1 × 650L Grey Water Slimline Tank",
  "1 × Water Pressure Pump & Filter",
  "1 × Smoke Detector",
  "LED Internal & External Lighting Throughout",
];

export default function SolarFacilityPage() {
  const [activeModel, setActiveModel] = useState(0);
  const model = MODELS[activeModel];

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
            <Link href="/" className="hover:text-white/60">Home</Link>
            <span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link>
            <span>/</span>
            <span className="text-white/80 font-medium">Solar Facility</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">SOLAR</span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold text-green-300 bg-green-900/50 border border-green-700/30">ZERO EMISSIONS</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                The Solar Facility
              </h1>
              <p className="text-white/50 mt-1 text-sm font-medium">
                The Future of Portable Buildings is Here
              </p>
              <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-lg">
                Power your operations anytime, anywhere with unparalleled efficiency. In collaboration with RedEarth, a pioneer in solar and battery technology, and supported by the Australian Government&apos;s AusIndustry Entrepreneurs Programme, the Solar Facility is your sustainable solution for off-grid, on-site operational efficiency.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 bg-white/5">Eco-Friendly</span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 bg-white/5">Reliable</span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 bg-white/5">Portable</span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 bg-white/5">Silent Operation</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <AddToQuoteButton
                  product={{
                    id: "solar-facility",
                    name: "Solar Facility",
                    size: "12x3.35m / 9x3.35m",
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
                src="/images/products/solar-facility/hero-exterior.jpg"
                alt="Multitrade Solar Facility — exterior view"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm">
                ZERO DIESEL
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-10 md:py-14 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Why Choose the Solar Facility?</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-2xl">Completely off-grid. Operate independently from traditional power sources such as generators and terminated site power.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Completely Off-Grid", desc: "No generators, no site power needed" },
              { label: "Reduce Carbon Footprint", desc: "Aligns with sustainability goals" },
              { label: "Cost Effective", desc: "Eliminates fuel, servicing & trade connections" },
              { label: "Immediate Establishment", desc: "No sub-trades, no waiting" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{item.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Key Features & Benefits</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5 hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Selector + Specs */}
      <section className="bg-gray-50 border-y border-gray-200 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          {/* Model tabs */}
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mr-4">Specifications</h2>
            {MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(i)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeModel === i
                    ? "bg-gold text-gray-900 shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Solar & Power Specs */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Solar & Power System</h3>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden">
                {[
                  ["Solar Panels", model.solarPanels],
                  ["Solar Output", model.solarOutput],
                  ["Battery (Standard)", model.batteryStandard],
                  ["Battery (Max)", model.batteryMax],
                  ["Power Output", model.powerOutput],
                  ["Battery Voltage", "48–57.6V"],
                  ["Monitoring", "RedEarth EMU app (computer & mobile)"],
                ].map(([key, val], i) => (
                  <div key={i} className={`flex items-start gap-3 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <span className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">{key}</span>
                    <span className="text-sm text-gray-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Building Specs */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Building Specifications</h3>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden">
                {[
                  ["Dimensions", model.size],
                  ["Air Conditioning", model.ac],
                  ["Door", model.door],
                  ["Windows", model.windows],
                  ["Kitchenette", model.kitchenette],
                  ["Water System", model.water],
                  ["Power Points", model.gpos],
                  ["LED Lighting", model.leds],
                ].map(([key, val], i) => (
                  <div key={i} className={`flex items-start gap-3 px-5 py-3 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <span className="text-sm font-semibold text-gray-700 w-40 flex-shrink-0">{key}</span>
                    <span className="text-sm text-gray-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floor Plan Viewer */}
          <FloorplanViewer productId={model.id} />

          {/* Floor Plan PDF link */}
          <div className="mt-4">
            <PdfDownloadGate
              pdfUrl={model.floorPlan}
              productName={`${model.name} — Floor Plan`}
              productSlug={model.id}
              variant="ghost"
              label={`Download ${model.name} Floor Plan (PDF)`}
            />
          </div>
        </div>
      </section>

      {/* See It in Action — video placed right after key features */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-5">See It in Action</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/images/products/solar-facility/video-poster.jpg"
              className="w-full"
            >
              <source
                src="/images/products/solar-facility/video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Comparison vs Diesel</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-6 space-y-4">
                {[
                  { label: "Fuel costs", diesel: "$800–1,500/mo", solar: "$0" },
                  { label: "Servicing", diesel: "$200–500/mo", solar: "Minimal" },
                  { label: "Noise", diesel: "75+ dB", solar: "0 dB" },
                  { label: "Emissions", diesel: "High CO₂", solar: "Zero" },
                  { label: "Fuel deliveries", diesel: "Weekly", solar: "None" },
                  { label: "Site establishment", diesel: "Sub-trades required", solar: "Immediate" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-3 text-sm items-center">
                    <span className="font-medium text-gray-700">{row.label}</span>
                    <span className="text-red-500/80 line-through text-center">{row.diesel}</span>
                    <span className="text-green-700 font-semibold text-center">{row.solar}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-400">
                  * Diesel costs are indicative estimates based on typical remote site operations.
                </div>
              </div>
            </div>

            {/* Construction Notes & Standard Inclusions */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Construction</h2>
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-5 mb-6">
                <div className="grid grid-cols-1 gap-2">
                  {CONSTRUCTION.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Inclusions */}
      <section className="py-10 md:py-14 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Standard Inclusions</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {STANDARD_INCLUSIONS.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-10 md:py-14 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Gallery</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { src: "/images/products/solar-facility/aerial-solar-panels.jpg", alt: "Aerial view showing solar panels on roof" },
              { src: "/images/products/solar-facility/exterior-elevated.jpg", alt: "Elevated exterior view with green fields" },
              { src: "/images/products/solar-facility/exterior-side.jpg", alt: "Side exterior showing water tanks" },
              { src: "/images/products/solar-facility/battery-bay.jpg", alt: "Battery bay with RedEarth storage and AC unit" },
              { src: "/images/products/solar-facility/redearth-battery.jpg", alt: "RedEarth lithium phosphate battery close-up" },
              { src: "/images/products/solar-facility/interior-kitchen.jpg", alt: "Interior kitchen and dining area" },
              { src: "/images/products/solar-facility/interior-dining.jpg", alt: "Interior dining space with seating" },
              { src: "/images/products/solar-facility/hero-exterior.jpg", alt: "Full exterior view with blue sky" },
            ].map((img, i) => (
              <div
                key={i}
                className={`rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg shadow-black/5 ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className={`w-full object-cover hover:scale-105 transition-transform duration-700 ${i === 0 ? "h-56 md:h-80" : "h-56 md:h-64"}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Ready to Go Solar on Your Site?
          </h2>
          <p className="text-white/50 mt-2">
            Tell us about your power requirements and we&apos;ll design a solar solution that eliminates your diesel dependency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all flex items-center gap-2">
              Get a Free Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
            <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
              (07) 4979 2333
            </a>
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
