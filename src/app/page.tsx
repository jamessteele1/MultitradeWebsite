import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import { CountUp } from "@/components/CountUp";
import { ParallaxVideo } from "@/components/ParallaxVideo";
import Link from "next/link";

const PRODUCTS = [
  { name: "Crib Rooms", desc: "Fully equipped lunch rooms with kitchenettes, seating, and air conditioning.", sizes: "6x3m — 12x3m", href: "/hire/crib-rooms", img: "/images/products/12x3-crib-room/1.jpg" },
  { name: "Site Offices", desc: "Professional portable offices for project management and administration.", sizes: "3x3m — 12x3m", href: "/hire/site-offices", img: "/images/products/12x3-office/1.jpg" },
  { name: "Ablutions", desc: "Toilet blocks, shower facilities, and solar-powered ablution buildings.", sizes: "3.6x2.4m — 6x3m", href: "/hire/ablutions", img: "/images/products/6x3-toilet/1.jpg" },
  { name: "Complexes", desc: "Multi-module complexes for large-scale site accommodation needs.", sizes: "12x6m — 12x12m+", href: "/hire/complexes", img: "/images/products/12x6m-complex/1.jpg" },
  { name: "Containers", desc: "Shipping containers, dangerous goods storage, and container conversions.", sizes: "10ft — 40ft", href: "/hire/containers", img: "/images/products/10ft-container/1.jpg" },
  { name: "Ancillary", desc: "Tanks, pumps, covered decks, flat racks, stairs, and hand wash stations.", sizes: "Various", href: "/hire/ancillary", img: "/images/products/5000l-tank-pump/1.jpg" },
];

const STATS = [
  { value: "45+", label: "Years in Operation", sub: "Est. 1980" },
  { value: "100s", label: "Project Locations", sub: "Across QLD" },
  { value: "QLD's", label: "Largest Fleet", sub: "Privately Owned" },
  { value: "0", label: "Lost Time Injuries", sub: "In 5+ Years" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[75vh] md:min-h-0 flex flex-col md:block">
        <ParallaxVideo
          src="/images/hero-video.mp4"
          className="hidden md:block"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/buildings-web/_CWM6261-Edit.jpg"
          alt="Multitrade solar-powered portable building with blue sky and green fields"
          className="absolute inset-0 w-full h-full object-cover object-[center_25%] md:hidden"
        />
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to right, rgba(15,27,61,0.95) 0%, rgba(15,27,61,0.8) 50%, rgba(15,27,61,0.5) 100%)" }} />
        <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to bottom, rgba(15,27,61,0.7) 0%, rgba(15,27,61,0.3) 50%, rgba(15,27,61,0.6) 100%)" }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24 lg:py-32 flex flex-col justify-between md:block min-h-[inherit]">
          <div className="max-w-3xl">
            <div className="animate-hero">
              <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium mb-6">
                NEW — Solar-Powered Facility Now Available
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Portable Buildings<br className="hidden md:block" />
                <span className="gold-text">Built for</span> Industry
              </h1>
            </div>
            <p className="animate-hero-delay hidden md:block text-lg text-gray-400 mt-6 leading-relaxed max-w-lg serif">
              Queensland&apos;s largest privately owned fleet. 45+ years delivering
              hire, sale, installation, and custom manufacture of portable
              buildings for mining, construction, and civil projects.
            </p>
          </div>
          <div className="max-w-3xl">
            <div className="animate-hero-delay-2 flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <Link
                href="/quote"
                className="px-8 py-4 rounded-lg font-semibold text-gray-900 text-center bg-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                Get a Free Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <a
                href="tel:0749792333"
                className="px-8 py-4 rounded-lg font-semibold text-white border border-white/20 text-center hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                (07) 4979 2333
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* ─── STATS BAR ─── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gray-200">
            {STATS.map((stat, i) => (
              <FadeIn key={i} delay={0.1 * i} className="text-center py-4 md:py-8">
                <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  <CountUp value={stat.value} />
                </div>
                <div className="text-sm font-semibold text-gray-800 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY MULTITRADE ─── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Why Multitrade</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Built Different. Built to Last.</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto serif">
              We don&apos;t just hire buildings — we design, manufacture, and install them from our own facility in Gladstone.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M5 20V6a1 1 0 011-1h4a1 1 0 011 1v14"/><path d="M13 20V10a1 1 0 011-1h4a1 1 0 011 1v10"/><path d="M8 9h.01"/><path d="M8 13h.01"/><path d="M16 13h.01"/></svg>
                ),
                title: "Own Manufacturing",
                desc: "Purpose-built factory at our Gladstone HQ. We control quality from raw steel to finished building.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                ),
                title: "45+ Years Experience",
                desc: "Established in 1980. Thousands of buildings delivered across Queensland\u2019s toughest project sites.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
                ),
                title: "Zero LTI Record",
                desc: "5+ years with no lost time injuries. Safety isn\u2019t a slogan here — it\u2019s how we operate every day.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                ),
                title: "End-to-End Service",
                desc: "Design, manufacture, delivery, installation, connection, and ongoing maintenance — all in-house.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="relative p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 gold-text group-hover:bg-gold/20 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Our Fleet</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Portable Buildings for Every Need</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto serif">
              From single-module offices to multi-building complexes. Hire, buy, or have us custom-manufacture to your specifications.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PRODUCTS.map((product, i) => (
              <FadeIn key={i} delay={0.1 * i}>
              <Link href={product.href} className="product-card group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 transition-all duration-500 block">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img src={product.img} alt={product.name} className="product-img w-full h-full object-cover transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-black/40 backdrop-blur-sm">{product.sizes}</div>
                  <div className="product-overlay absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-300">
                    <span className="px-6 py-3 rounded-lg font-semibold text-sm text-gray-900 bg-gold flex items-center gap-2">
                      View Range
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{product.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-semibold gold-text tracking-wide">HIRE & SALE</span>
                    <span className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ─── SERVICES OVERVIEW ─── */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">What We Do</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">More Than Just Hire</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto serif">
              Full-service portable building solutions — from a single office to a complete site setup.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                title: "Hire",
                desc: "Short and long-term hire from QLD\u2019s largest private fleet.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                ),
              },
              {
                title: "Buy",
                desc: "New and refurbished buildings available for outright purchase.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                ),
              },
              {
                title: "Manufacture",
                desc: "Custom-built to your specs in our Gladstone factory.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                ),
              },
              {
                title: "Install",
                desc: "Delivery, craning, blocking, and full electrical connection.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                ),
              },
              {
                title: "Relocate",
                desc: "Move existing buildings between sites with full logistics support.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                ),
              },
            ].map((service, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <Link href="/services" className="group p-5 rounded-xl border border-gray-200 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 text-center block h-full">
                  <div className="w-11 h-11 rounded-lg bg-gray-100 group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gray-600 group-hover:text-amber-600 transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{service.desc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold gold-text hover:brightness-110 transition-all">
              Learn more about our services
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECT ─── */}
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Project Spotlight</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Built for Real Worksites</h2>
            <p className="text-white/50 mt-3 max-w-xl mx-auto serif">
              From remote mine sites to major infrastructure projects — we deliver complete site facility solutions.
            </p>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <FadeIn delay={0.1} className="relative rounded-xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/12x6m-complex/1.jpg"
                alt="Multi-building complex installation with covered walkway and decking"
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-xs font-bold text-gray-900">
                  MULTI-BUILDING COMPLEX
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25} className="space-y-6">
              <h3 className="text-2xl font-extrabold text-white">Site Office &amp; Crib Complex — Bowen Basin</h3>
              <p className="text-white/60 serif leading-relaxed">
                A complete multi-module facility featuring interconnected site offices, crib rooms, and ablution buildings — all designed, manufactured, delivered, and installed by Multitrade. Connected via covered walkways with full electrical and plumbing services.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Scope", value: "6 Buildings" },
                  { label: "Location", value: "Bowen Basin, QLD" },
                  { label: "Turnaround", value: "4 Weeks" },
                  { label: "Services", value: "Full Install" },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-white/40 font-medium uppercase tracking-wide">{stat.label}</div>
                    <div className="text-lg font-bold text-white mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/quote"
                  className="px-6 py-3 rounded-lg font-semibold text-gray-900 text-center bg-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Scope Your Project
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link
                  href="/hire/complexes"
                  className="px-6 py-3 rounded-lg font-semibold text-white text-center border border-white/20 hover:bg-white/5 transition-all"
                >
                  View Complexes
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── CLIENT LOGOS ─── */}
      <section className="bg-white py-12 overflow-hidden">
        <FadeIn className="text-center mb-8">
          <div className="text-xs font-semibold tracking-widest uppercase text-gray-400">Trusted by Industry Leaders</div>
        </FadeIn>
        <div className="relative overflow-hidden">
          <div className="marquee-track">
            {[...Array(2)].map((_, set) =>
              [
                { name: "Glencore", src: "/images/logos/clients/glencore.png" },
                { name: "Rio Tinto", src: "/images/logos/clients/rio-tinto.png" },
                { name: "Thiess", src: "/images/logos/clients/thiess.png" },
                { name: "Coronado", src: "/images/logos/clients/coronado.png" },
                { name: "Downer", src: "/images/logos/clients/downer.png" },
                { name: "UGL", src: "/images/logos/clients/ugl.png" },
                { name: "Monadelphous", src: "/images/logos/clients/monadelphous.png" },
                { name: "Fortescue", src: "/images/logos/clients/fortescue.png" },
                { name: "New Hope Group", src: "/images/logos/clients/new-hope.png" },
                { name: "Gladstone Ports", src: "/images/logos/clients/gpc.png" },
                { name: "Fulton Hogan", src: "/images/logos/clients/fulton-hogan.png" },
                { name: "McCosker", src: "/images/logos/clients/mccosker.png" },
                { name: "Acciona", src: "/images/logos/clients/acciona.png" },
                { name: "Aestec Services", src: "/images/logos/clients/aestec.png" },
                { name: "Golding", src: "/images/logos/clients/golding.svg" },
              ].map((client, i) => (
                <div key={`${set}-${i}`} className="flex-shrink-0 mx-6 md:mx-10 flex items-center justify-center h-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.src} alt={client.name} className="h-7 md:h-9 w-auto max-w-[120px] object-contain opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>



      <MobileCTA />
    </>
  );
}
