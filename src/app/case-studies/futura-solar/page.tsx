import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study — Futura Resources | Off-Grid Solar Site Office",
  description: "How a hire-ready solar building eliminated diesel generation at Wilton Coal Mine. Zero diesel burn, no grid connection, fully self-contained off-grid site office.",
};

const STATS = [
  { value: "Zero", label: "Diesel Burn" },
  { value: "Off-Grid", label: "Solar Powered" },
  { value: "Hire", label: "Flexible Term" },
  { value: "Same Day", label: "Site Setup" },
];

const SNAPSHOT = [
  { label: "Product", value: "Solar Site Office \u2014 hire" },
  { label: "Client", value: "Futura Resources" },
  { label: "Site", value: "Wilton Coal Mine, Wyuna QLD" },
  { label: "Contract Type", value: "Hire \u2014 flexible term" },
  { label: "Power", value: "Fully off-grid solar with battery storage \u2014 no grid connection required" },
  { label: "Water", value: "Self-contained onboard 650L fresh and grey water system" },
  { label: "Climate Control", value: "Reverse cycle split system air conditioning" },
  { label: "Fit-Out", value: "Full kitchen appliances, tables, and chairs \u2014 ready to use on delivery" },
  { label: "Structure", value: "C2 wind-rated steel frame with heavy insulation for remote conditions" },
];

const STEPS = [
  { num: "01", title: "Transport to Site", desc: "The building was delivered and positioned on a prepared pad at Wilton Coal Mine. Transport included delivery and placement \u2014 $4,350 ex GST." },
  { num: "02", title: "Instant Power", desc: "The integrated solar and battery system powered up the moment the sun hit the panels. No generator required, no fuel ordered, no electrical connection to organise." },
  { num: "03", title: "Self-Contained Water", desc: "The onboard water tank was filled on delivery. The pressure pump, filter, and grey water management system handled everything else." },
  { num: "04", title: "Ready to Use", desc: "The team walked in from day one \u2014 air conditioning, fridge, microwave, pie warmer, tables and chairs all in place. The break room was operational immediately." },
  { num: "05", title: "Silent Operation", desc: "With the noisy diesel unit gone, the site environment improved noticeably. The solar system runs silently day and night, drawing on battery storage when panels aren\u2019t producing." },
  { num: "06", title: "Ongoing Flexibility", desc: "As a hire product, Futura Resources retains full flexibility. The building can be relocated, upgraded, or returned \u2014 no asset on the balance sheet, no disposal costs." },
];

const GALLERY = [
  { src: "/images/case-studies/futura-solar/wide-view.jpg", alt: "Wide view of Solar Site Office at Wilton Coal Mine with covered outdoor area" },
  { src: "/images/case-studies/futura-solar/signage-front.jpg", alt: "Front view with Multitrade Solar Facility signage" },
  { src: "/images/case-studies/futura-solar/battery-end-onsite.jpg", alt: "Battery bay end with Solar Facility branding and fire safety equipment" },
  { src: "/images/case-studies/futura-solar/mesh-gate-end.jpg", alt: "End view showing mesh security gate and air conditioning unit" },
  { src: "/images/products/solar-facility/exterior-elevated.jpg", alt: "Elevated view showing roof-mounted solar panels" },
  { src: "/images/products/solar-facility/battery-bay.jpg", alt: "RedEarth battery storage system and power management" },
  { src: "/images/products/solar-facility/interior-kitchen.jpg", alt: "Interior \u2014 fully equipped kitchen with appliances" },
  { src: "/images/products/solar-facility/interior-dining.jpg", alt: "Interior \u2014 dining and break room area" },
  { src: "/images/products/solar-facility/aerial-solar-panels.jpg", alt: "Aerial view of solar panel array on roof" },
];

const WHY_CHOOSE = [
  { icon: "\u2600\uFE0F", title: "Truly Off-Grid", desc: "Fully self-powered with integrated solar panels and battery storage. No grid connection, no generator, no fuel deliveries." },
  { icon: "\uD83D\uDD07", title: "Silent Operation", desc: "The solar system runs without noise or vibration \u2014 a significant improvement for site amenity and worker wellbeing compared to diesel units." },
  { icon: "\uD83D\uDCA7", title: "Self-Contained Water", desc: "Onboard 650L fresh water tank and grey water management system means no site water infrastructure is needed." },
  { icon: "\u267B\uFE0F", title: "Supports ESG Goals", desc: "Zero diesel burn directly reduces site emissions. Ideal for operators with sustainability targets or low-emission operational strategies." },
  { icon: "\uD83C\uDFD7\uFE0F", title: "No Installation Required", desc: "Delivered, positioned, and operational. No civil works, no tradespeople on site, no commissioning delays." },
  { icon: "\uD83D\uDD04", title: "Hire Flexibility", desc: "A hire model keeps assets off the balance sheet and gives operators the ability to scale, relocate, or upgrade as project needs change." },
];

export default function FuturaSolarCaseStudy() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <a href="/" className="hover:text-white/60">Home</a><span>/</span>
            <a href="/case-studies/gladstone-hockey" className="hover:text-white/60">Case Studies</a><span>/</span>
            <span className="text-white/80 font-medium">Futura Solar</span>
          </nav>
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-4">Case Study</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Off-Grid Solar Site Office
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Futura Resources &bull; Wilton Coal Mine, Wyuna QLD
          </p>
          <p className="text-white/40 mt-1 text-sm">
            Zero Diesel &bull; Self-Contained &bull; Hire-Ready
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 md:gap-12 mt-10">
            {STATS.map((s, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 -mt-0">
          <FadeIn>
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/20 -mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/case-studies/futura-solar/hero.jpg"
                alt="Solar Site Office deployed at Wilton Coal Mine with covered walkway and signage"
                className="w-full h-64 md:h-[32rem] object-cover"
              />
            </div>
            <div className="mb-8" />
          </FadeIn>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Challenge</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Diesel Dependence in a Remote Operation</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Futura Resources operates Wilton Coal Mine in the remote Wyuna region of Queensland, where grid power and town water are simply not options. Like many remote resource sites, the team had been relying on a diesel-powered mobile unit to provide a break room and site office for field crews &mdash; a solution that came with a familiar set of headaches: constant noise, ongoing fuel costs, carbon emissions, and maintenance demands that cut into operational time.</p>
              <p>Beyond the day-to-day frustrations, the diesel unit was increasingly at odds with Futura&apos;s broader company direction. With sustainability and low-emission operations becoming a key strategic focus, the team needed a smarter alternative &mdash; one that could deliver a genuinely comfortable, self-contained work environment without a single drop of fuel.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Solution</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">A Purpose-Built Solar Site Office</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Multitrade Building Hire supplied a Solar Site Office &mdash; a purpose-built, hire-ready building engineered from the ground up for exactly this kind of environment. Rather than retrofitting solar onto a standard building, this unit integrates an off-grid solar power system directly into the structure, providing reliable, silent energy generation and storage with no external infrastructure required.</p>
              <p>The building arrived on site fully equipped and ready to go &mdash; a completely self-contained facility requiring nothing from the site other than a flat, level pad. For a remote mining operation, that simplicity is worth a great deal.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Photo Grid 1 */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FadeIn>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/futura-solar/signage-front.jpg" alt="Solar Site Office at Wilton Coal Mine with Multitrade signage" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Solar Site Office deployed at Wilton Coal Mine &mdash; Futura Resources</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/futura-solar/battery-end-onsite.jpg" alt="Battery bay end with Solar Facility branding" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Battery bay end &mdash; RedEarth power system with covered outdoor break area</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Project Snapshot */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Project Snapshot</div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">At a Glance</h2>
            <div className="divide-y divide-gray-200">
              {SNAPSHOT.map((item, i) => (
                <div key={i} className="py-3 flex gap-4">
                  <div className="w-36 flex-shrink-0 text-sm font-semibold text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.value}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How It Delivered */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">How It Delivered</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Simple by Design</h2>
            <p className="text-gray-600 mb-8">Getting the solar office onto site was straightforward by design. With no installation crew, no earthworks, and no connection to infrastructure required, mobilisation was a logistics exercise rather than a construction project.</p>
          </FadeIn>
          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <span className="text-sm font-extrabold text-amber-700">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{step.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* The Result */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Result</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">A Genuine Upgrade on Every Front</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The feedback from Futura Resources has been clear and consistent: the solar office has been a genuine upgrade on every front. The team loves it. The diesel unit is gone. Fuel costs have been eliminated from that part of the operation entirely.</p>
              <p>Crucially, the building has delivered beyond its brief. It&apos;s not just a functional break room &mdash; it&apos;s a comfortable, well-insulated, well-equipped space that the crew actually wants to spend time in. The reverse cycle air conditioning keeps it cool through Queensland summers and warm through cooler months, and the quality of insulation means it holds temperature well without the system working overtime.</p>
              <p>From a strategic perspective, the outcome aligned directly with Futura&apos;s low-emission company goals. Solar power is already used elsewhere on their operations, and the positive experience at Wilton has reinforced confidence in expanding that approach further. The team is already looking at additional solar hire options as the company continues to transition away from diesel across its sites.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <div className="text-5xl text-white/20 font-serif mb-4">&ldquo;</div>
              <p className="text-xl md:text-2xl text-white/90 italic leading-relaxed">
                The solar office has been absolutely fantastic on site. The team loves it. Zero diesel burn, no noise, and it aligns perfectly with our low-emission strategy. We&apos;re already looking at what else we can do.
              </p>
              <div className="mt-6">
                <div className="font-bold text-white">Craig Glanville</div>
                <div className="text-sm text-white/50">Futura Resources &mdash; Wilton Coal Mine</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Gallery</div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">The Solar Site Office</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GALLERY.map((img, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Why It Works</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Built for Remote Resource Operations</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Need Off-Grid Site Accommodation?</h2>
              <p className="text-gray-600 mb-8">Talk to Multitrade Building Hire about solar hire solutions for your remote operation.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:0749792333" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
                  (07) 4979 2333
                </a>
                <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-white transition-colors" style={{ background: "var(--gold)" }}>
                  Get in Touch
                </a>
                <a href="/quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
                  Get a Quote
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
