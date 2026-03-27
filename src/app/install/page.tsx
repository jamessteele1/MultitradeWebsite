import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Install | Lead Contractor, Project Management & Site Construction — Multitrade",
  description: "Full-service portable building installation, civil works, building services, and project management across Queensland. QBCC 20298. Carpentry, steel fabrication, concreting, plumbing, electrical & more. 45+ years experience.",
};

const SERVICE_CATEGORIES = [
  {
    id: "project-management",
    tag: "Lead Contractor",
    title: "Project Management & Delivery",
    desc: "Multitrade provides full lead contractor and project management services from inception to completion. We coordinate all trades and services, manage engineering approvals, and deliver comprehensive Tier 1 documentation including ITPs, WABs, and site walkthroughs. One point of contact for your entire project.",
    features: [
      "Lead contractor services",
      "End-to-end project management",
      "Engineering & certification",
      "Tier 1 documentation & ITPs",
      "Site visits & activity briefs",
      "Stakeholder coordination",
      "Planning permissions & approvals",
      "Quality audits & walkthroughs",
    ],
    img: "/images/buildings-web/_CWM6231.jpg",
  },
  {
    id: "installation",
    tag: "Installation",
    title: "Portable Building Installation",
    desc: "Comprehensive installation services for transportable and portable buildings of all sizes. From single site offices through to large-scale multi-building complexes, our experienced crew handles site preparation, crane lifts, positioning, tie-downs, and full commissioning with all trades coordinated.",
    features: [
      "Site compliant safety systems",
      "Crane lift & positioning",
      "Footings & tie-down systems",
      "Electrical connection & testing",
      "Plumbing & sewer connections",
      "Co-ordination of all trades",
      "Plant & equipment",
      "Complex multi-building setups",
    ],
    img: "/images/buildings-web/_CWM6271-Edit.jpg",
  },
  {
    id: "civil-works",
    tag: "Civil Works",
    title: "Concreting & Civil Works",
    desc: "On-site civil construction capabilities for portable building projects and beyond. Our team delivers foundations, slabs, footings, drainage, carparks, and walkways — everything needed to prepare your site and support your portable building infrastructure.",
    features: [
      "Concrete slabs & footings",
      "Foundations & piers",
      "Drainage systems",
      "Carparks & hardstands",
      "Walkways & pathways",
      "Site preparation",
    ],
    img: "/images/buildings-web/_CWM5926.jpg",
  },
  {
    id: "building-services",
    tag: "Building Services",
    title: "Building Services & Maintenance",
    desc: "Full building services capability under QBCC licence 20298. From renovations and refurbishments to new construction, our trades team covers carpentry, steel fabrication, painting, plumbing, and electrical. We also provide ongoing fleet maintenance for portable buildings across Queensland.",
    features: [
      "Carpentry & renovations",
      "Refurbishments & demolition",
      "Steel fabrication (workshop & on-site)",
      "Painting & decorating",
      "Plumbing & roofing",
      "Electrical services",
      "Decks, landings & handrails",
      "Ongoing fleet maintenance",
    ],
    img: "/images/buildings-web/_CWM6104.jpg",
  },
  {
    id: "transport",
    tag: "Transport",
    title: "Transport & Logistics",
    desc: "Reliable delivery and relocation services across Queensland with established logistics partners. We have decades of experience moving portable buildings to remote and challenging sites, including barge operations to Curtis Island and multi-building convoy coordination.",
    features: [
      "Table top & semi-trailer",
      "Hiab crane (5–8m reach)",
      "Drop deck / extendable tray",
      "Barge to Curtis Island",
      "Remote site coordination",
      "Multi-building convoys",
    ],
    img: "/images/buildings-web/_CWM5844-Edit.jpg",
  },
  {
    id: "manufacturing",
    tag: "Design & Build",
    title: "Custom Manufacturing",
    desc: "In-house design and fabrication from our Gladstone facility. Every site is different — we custom manufacture portable buildings to your exact specifications. From mobile crib rooms to server rooms and fire safe control rooms, we have the expertise to deliver industry-leading products.",
    features: [
      "In-house design team",
      "Steel fabrication workshop",
      "Electrical fit-out & testing",
      "Custom floor plans",
      "Specialist builds (server rooms, fire safe)",
      "Quality audits & ITPs",
    ],
    img: "/images/buildings-web/_CWM5860.jpg",
  },
];

const BUILDING_SERVICES_DETAIL = [
  {
    title: "Carpentry",
    items: ["Refurbishment", "Renovations", "Doors & windows", "Demolition work", "Disabled ramps", "Decks & landings", "Shed erection", "Awnings & carports", "Fencing", "Sign erection"],
  },
  {
    title: "Steel Fabrication",
    items: ["Workshop facilities", "On-site capability", "Landings & platforms", "Handrails", "Step stringers", "Posts & frames"],
  },
  {
    title: "Painting & Decorating",
    items: ["Internal & external painting", "Plasterboard repairs", "Line marking", "Stencilling"],
  },
  {
    title: "Plumbing & Electrical",
    items: ["New installations", "Maintenance services", "Roofing", "Electrical fit-out", "Testing & compliance"],
  },
];

const STATS = [
  { value: "45+", label: "Years Experience" },
  { value: "100+", label: "Project Locations" },
  { value: "0", label: "Lost Time Injuries" },
  { value: "QBCC", label: "Licence 20298" },
];


export default function InstallPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span><span className="text-white/80 font-medium">Install</span>
          </nav>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
              QBCC 20298 — Full Building Services Licence
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Design. Manufacture. <br className="hidden sm:block" /><span className="gold-text">Hire. Install.</span>
            </h1>
            <p className="text-white/60 mt-5 text-lg max-w-xl">
              Full-service lead contractor from project inception to completion. Portable building installation, civil works, building services, and ongoing maintenance — one point of contact for everything.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl">
            {STATS.map((s, i) => (
              <div key={i} className="text-center px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10">
                <div className="text-2xl md:text-3xl font-extrabold gold-text">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Service Categories */}
      <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 space-y-24">
        {SERVICE_CATEGORIES.map((service, i) => (
          <FadeIn key={service.id}>
            <div id={service.id} className="scroll-mt-24">
              <div className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[direction:rtl] lg:*:[direction:ltr]" : ""}`}>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-black/5" style={{ aspectRatio: "16/10" }}>
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold gold-text mb-4">{service.tag}</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{service.title}</h2>
                  <p className="text-gray-600 mt-3 leading-relaxed">{service.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-2 mt-6">
                    {service.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href="/quote" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">
                    Get a Quote
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      </section>


      {/* Building Services Detail Breakdown */}
      <section className="bg-gray-50 border-y border-gray-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold gold-text mb-4">QBCC 20298</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Full Trade Capabilities</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">Our licensed team covers every trade needed for portable building projects, renovations, and site construction.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUILDING_SERVICES_DETAIL.map((cat, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-6 h-full">
                  <h3 className="font-bold text-gray-900 mb-4 text-base">{cat.title}</h3>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="3" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* Documentation & Compliance */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold gold-text mb-4">Tier 1 Compliance</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Documentation & Compliance</h2>
                <p className="text-gray-600 mt-3 leading-relaxed">
                  Successful projects begin with systematic documentation controls. Multitrade provides a comprehensive solution for even the most demanding Tier 1 clients — from detailed designs and procurement through to construction documentation including footings, tie-downs, planning permissions, and engineering approvals.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mt-6">
                  {[
                    "Inspection Test Points (ITPs)",
                    "Work Activity Briefs (WABs)",
                    "Site walkthroughs & audits",
                    "Engineering approvals",
                    "Planning permissions",
                    "Footings & tie-down specs",
                    "User manuals for custom builds",
                    "Compliance certification",
                  ].map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { std: "ISO 9001", year: "2015", label: "Quality", color: "#3B82F6" },
                  { std: "ISO 14001", year: "2015", label: "Environmental", color: "#22C55E" },
                  { std: "ISO 45001", year: "2018", label: "Safety", color: "#F59E0B" },
                ].map((c) => (
                  <div key={c.std} className="flex flex-col items-center text-center p-5 rounded-xl border border-gray-200 bg-white shadow-lg shadow-black/5">
                    <div className="relative w-16 h-16 mb-3">
                      <svg viewBox="0 0 80 80" className="w-full h-full">
                        <circle cx="40" cy="40" r="37" fill="none" stroke={c.color} strokeWidth="2.5" opacity="0.5" />
                        <circle cx="40" cy="40" r="30" fill={c.color} fillOpacity="0.1" />
                        <path d="M28 40 L36 48 L52 32" fill="none" stroke={c.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                        <path id={`arc-install-${c.std}`} d="M12,40 a28,28 0 0,1 56,0" fill="none" />
                        <text fontSize="6" fill="#374151" fillOpacity="0.4" fontWeight="600" letterSpacing="2">
                          <textPath href={`#arc-install-${c.std}`} startOffset="50%" textAnchor="middle">CERTIFIED</textPath>
                        </text>
                      </svg>
                    </div>
                    <div className="text-sm font-extrabold text-gray-800">{c.std}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{c.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* Process Steps */}
      <section className="bg-gray-50 border-y border-gray-200 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">From Enquiry to Completion</h2>
            <p className="text-gray-500 mt-2">One point of contact through every stage of your project.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { s: "01", t: "Enquiry", d: "Tell us what you need. Site visits available anywhere in Queensland." },
              { s: "02", t: "Design & Quote", d: "Tailored solution with floor plans, engineering specs, and pricing." },
              { s: "03", t: "Build or Select", d: "Custom manufacture or select from our fleet of 200+ buildings." },
              { s: "04", t: "Deliver & Install", d: "Transport, civil works, positioning, and full commissioning." },
              { s: "05", t: "Support", d: "Ongoing maintenance, fleet servicing, and project support." },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-5 h-full">
                  <div className="text-3xl font-extrabold gold-text opacity-30 mb-2">{step.s}</div>
                  <h3 className="font-bold text-gray-900 text-sm">{step.t}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.d}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-14 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Your Next Project Starts With Us</h2>
            <p className="text-white/50 mt-2 max-w-lg mx-auto">From a single portable building through to large-scale site establishments — we manage it all. Our team responds within 2 business hours.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <Link href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110">Request a Quote</Link>
              <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-white border border-white/20 hover:bg-white/5">(07) 4979 2333</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
