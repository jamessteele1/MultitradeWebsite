import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study — Alpha HPA | 12×9m Office Complex, Yarwun QLD",
  description: "Multitrade Building Hire delivered a 12×9m office complex for Alpha HPA's Yarwun refinery — custom-engineered foundations over a swale drain, turnkey delivery ahead of schedule.",
};

const STATS = [
  { value: "12×9m", label: "Office Complex" },
  { value: "Ahead", label: "Of Schedule" },
  { value: "Custom", label: "Engineering" },
  { value: "Hire", label: "Flexible Terms" },
];

const SNAPSHOT = [
  { label: "Client", value: "Alpha HPA" },
  { label: "Location", value: "Yarwun, Central QLD" },
  { label: "Building", value: "12m × 9m Office Complex" },
  { label: "Sector", value: "Resources / Refining" },
  { label: "Contract Type", value: "Hire — flexible terms with ability to extend or adjust" },
  { label: "Delivery Model", value: "Full turnkey — site assessment, custom engineering, transport, crane hire, installation" },
  { label: "Scope of Works", value: "Engineering site visit, custom steel beam fabrication, welded footings over swale drain, crane lift, boilermaker on site, transportation of beams, full installation, electrical works — all under site permitting requirements" },
  { label: "Key Features", value: "Open-plan office layout with workstation partitions, multiple entry points with DDA-compliant ramps and yellow safety railings, split-system air conditioning, windows with security screens" },
  { label: "Project", value: "Alpha HPA Stage 2 — Operational Readiness Team office space" },
];

const STEPS = [
  { num: "01", title: "Site Assessment & Engineering", desc: "After the installation location was confirmed, the Multitrade team arranged for engineering to visit site and assess all requirements for building over the existing swale drain." },
  { num: "02", title: "Custom Foundation Design", desc: "Steel beams were fabricated and welded to custom footings designed to span the swale drain — a solution that preserved the drainage infrastructure while providing a stable foundation for the complex." },
  { num: "03", title: "Transport & Logistics", desc: "Multitrade coordinated transportation of the office complex modules and steel beams to the Yarwun site, managing all logistics for the restricted-access refinery environment." },
  { num: "04", title: "Crane Lift & Placement", desc: "Crane hire was arranged to lift the steel beams and building modules into position. A boilermaker attended site to weld beams to footings, ensuring structural integrity." },
  { num: "05", title: "Services & Compliance", desc: "All excavation and electrical works were completed in full compliance with the site\u2019s permitting requirements, meeting the stringent safety standards of the Alpha HPA facility." },
  { num: "06", title: "Handover — Ahead of Schedule", desc: "The installation ran smoothly and was completed ahead of schedule, allowing Alpha HPA to hand over the space to their Operational Readiness team on time for Stage 2 preparations." },
];

const GALLERY = [
  { src: "/images/case-studies/alpha-hpa/exterior-angle.jpg", alt: "12×9m office complex — exterior angle view with entry ramps and yellow safety railings" },
  { src: "/images/case-studies/alpha-hpa/exterior-front.jpg", alt: "Front elevation with dual entry ramps and security windows" },
  { src: "/images/case-studies/alpha-hpa/exterior-rear.jpg", alt: "Rear three-quarter view showing the full complex with air conditioning units" },
  { src: "/images/case-studies/alpha-hpa/interior-office.jpg", alt: "Interior — open-plan office with workstation partitions and desks" },
  { src: "/images/case-studies/alpha-hpa/exterior-side.jpg", alt: "Side elevation showing building raised on custom steel beam foundations" },
];

const WHY_CHOOSE = [
  { title: "Turnkey delivery, one point of contact", desc: "From engineering site visits to crane hire and boilermaker coordination — Multitrade managed the full scope so Alpha HPA didn\u2019t have to." },
  { title: "Custom engineering for complex sites", desc: "When the install location included a swale drain, we designed and fabricated custom steel beam foundations to solve the problem without compromise." },
  { title: "Delivered ahead of schedule", desc: "The installation was completed ahead of the agreed timeline, giving the client\u2019s Operational Readiness team early access to their workspace." },
  { title: "Flexible hire arrangements", desc: "The hire model gives Alpha HPA the flexibility to scale up, extend agreements, or adjust as their Stage 2 project evolves — without capital commitment." },
];

export default function AlphaHPACaseStudy() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <a href="/" className="hover:text-white/60">Home</a><span>/</span>
            <a href="/case-studies" className="hover:text-white/60">Case Studies</a><span>/</span>
            <span className="text-white/80 font-medium">Alpha HPA</span>
          </nav>
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-4">Case Study</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            12×9m Office Complex
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Alpha HPA &bull; Yarwun, Central QLD
          </p>
          <p className="text-white/40 mt-1 text-sm">
            Resources / Refining &bull; Turnkey Delivery &bull; Ahead of Schedule
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
                src="/images/case-studies/alpha-hpa/exterior-front.jpg"
                alt="12×9m office complex at Alpha HPA Yarwun — front elevation with dual entry ramps"
                className="w-full h-64 md:h-[32rem] object-cover"
              />
            </div>
            <div className="mb-8" />
          </FadeIn>
        </div>
      </section>

      {/* About Alpha HPA */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">About the Client</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Alpha HPA — Pioneering High-Purity Alumina</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Alpha HPA is an Australian company that has commercialised a purification technique for aluminium, producing a range of ultra-high purity aluminium materials. Following the success of their Stage 1 facility at Yarwun, Alpha HPA is constructing a larger scale facility set to become one of the largest single-site ultra-high-purity alumina refineries globally.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Challenge</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Limited Space, Complex Foundations</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>As Alpha HPA scaled toward Stage 2 commissioning, the site needed dedicated office space for a growing Operational Readiness team. Available space at the Yarwun facility was extremely limited.</p>
              <p>The solution required creative site planning: the office complex would need to be constructed over an existing swale drain to conserve room on site. This introduced engineering complexity around foundations and structural support that went well beyond a standard modular building deployment.</p>
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
                <img src="/images/case-studies/alpha-hpa/exterior-angle.jpg" alt="Office complex exterior — angle view with entry ramps" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Exterior — showing raised foundations and dual access ramps with safety railings</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/alpha-hpa/exterior-rear.jpg" alt="Office complex rear three-quarter view" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Three-quarter view — full complex with air conditioning and entry ramps at both ends</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Solution</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Custom Engineering, Turnkey Delivery</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Multitrade Building Hire worked closely with Alpha HPA to design and deliver a fit-for-purpose 12×9m office complex tailored to the site&apos;s constraints. After the installation location was confirmed, the MBH team arranged for engineering to visit site and address all requirements for building over the swale drain.</p>
              <p>Steel beams were fabricated and welded to custom footings to support the structure. Multitrade coordinated the full scope of work, including transportation of beams, crane hire for lifting into position, and a boilermaker to weld beams to footings on site. All excavation and electrical works were completed in full compliance with the site&apos;s permitting requirements.</p>
              <p>The installation ran smoothly and was completed ahead of schedule, allowing Alpha HPA to hand over the space to their operations team on time.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Project Snapshot */}
      <section className="py-16 md:py-20">
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

      {/* How We Delivered It */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">How We Delivered It</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">End-to-End Project Management</h2>
            <p className="text-gray-600 mb-8">Multitrade handled every phase — from engineering assessment to ahead-of-schedule handover:</p>
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

      {/* The Outcome */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Outcome</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Fit for Purpose, Ready to Scale</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The office complex has proven fit for purpose as the Operational Readiness team continues to grow in preparation for Alpha HPA&apos;s Stage 2 project. The hire arrangement has provided the flexibility needed to scale up as required, with the ability to extend or adjust agreements without issue.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Photo Grid 2 — Interior */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FadeIn>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/alpha-hpa/interior-office.jpg" alt="Interior — open-plan office with workstation partitions" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Interior — open-plan office layout with workstation partitions, ready for the operations team</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/alpha-hpa/exterior-side.jpg" alt="Side view showing building on custom steel foundations" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Side elevation — building raised on custom steel beam foundations over the swale drain</p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <div className="text-5xl text-white/20 font-serif mb-4">&ldquo;</div>
              <p className="text-xl md:text-2xl text-white/90 italic leading-relaxed">
                From start to finish, the team at Multitrade demonstrated exceptional professionalism and support. They were consistently easy to work with, responsive, and committed to delivering a high-quality product on time.
              </p>
              <div className="mt-6">
                <div className="font-bold text-white">Marion Gluestein</div>
                <div className="text-sm text-white/50">General Superintendent, Alpha HPA</div>
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
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">The Finished Product</h2>
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

      {/* Why Choose */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Why Multitrade</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Why Alpha HPA Chose Multitrade</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Planning a Similar Project?</h2>
              <p className="text-gray-600 mb-8">Talk to Multitrade Building Hire about your office complex, site accommodation, or modular building needs.</p>
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
