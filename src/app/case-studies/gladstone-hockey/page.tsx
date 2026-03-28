import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Study — Gladstone Hockey Association | 12×3m Amenities Building",
  description: "Full turnkey delivery of a custom 12×3m amenities building for the Gladstone Hockey Association. Design, manufacture, transport & installation — $210K project, C2 wind rated, fully DDA compliant.",
};

const STATS = [
  { value: "12×3m", label: "Building Size" },
  { value: "$210K+", label: "Project Value" },
  { value: "C2", label: "Wind Rating" },
  { value: "Turnkey", label: "Delivery Model" },
];

const SNAPSHOT = [
  { label: "Client", value: "Gladstone Hockey Association" },
  { label: "Location", value: "60 Tank Street, Gladstone Central QLD 4680" },
  { label: "Building Size", value: "12.0 × 3.0 m" },
  { label: "Structure", value: "Steel frame, C2 wind rated" },
  { label: "Delivery Model", value: "Full turnkey — design, manufacture, transport, install" },
  { label: "Scope of Works", value: "New concrete slab (12×6m), crane delivery & placement, PWD ramp & landings, electrical connection, plumbing to council main, concrete pathways, council planning approvals" },
  { label: "Key Features", value: "7 toilets (incl. 2 ambulant, 1 PWD), 4 tiled showers, 5 S/S basins, 315L HWS, bench seats, coat hooks, floor wastes — fully DDA compliant" },
  { label: "Project Value", value: "$210,466 incl. GST" },
  { label: "Commenced", value: "October 2025" },
  { label: "Council", value: "Gladstone Regional Council" },
];

const STEPS = [
  { num: "01", title: "Design & Approvals", desc: "Generated engineering drawings, completed geotechnical testing, and managed all council planning submissions and certifications through Gladstone Regional Council." },
  { num: "02", title: "Manufacture", desc: "Custom-manufactured the building at our Brisbane facility to the club\u2019s approved design, with C2 wind-rated steel frame construction and full fitout." },
  { num: "03", title: "Transport", desc: "Transported the completed building by semi-load from Brisbane to the Gladstone Hockey Fields \u2014 a seamless single-lift delivery." },
  { num: "04", title: "Slab & Placement", desc: "Formed, poured, and finished a 12\u00d76m concrete slab, then used a crane with qualified rigger and dogman to place the building precisely onto the new footings." },
  { num: "05", title: "Access & Pathways", desc: "Constructed PWD-compliant external landings and ramp (1:14 gradient), installed guttering, and connected concrete pathways to existing walkways." },
  { num: "06", title: "Services Connection", desc: "Connected electrical services to the existing facility and installed council-approved sewer jump-up and full plumbing connections." },
];

const GALLERY = [
  { src: "/images/case-studies/gladstone-hockey/covered-entry.jpg", alt: "PWD-compliant entry under covered walkway" },
  { src: "/images/case-studies/gladstone-hockey/walkway.jpg", alt: "Walkway with PWD ramp and tactile indicators" },
  { src: "/images/case-studies/gladstone-hockey/entry.jpg", alt: "Front entry with Multitrade signage and blue door" },
  { src: "/images/case-studies/gladstone-hockey/rear-view.jpg", alt: "Rear view with 315L hot water system and ramp" },
  { src: "/images/case-studies/gladstone-hockey/side-ramp.jpg", alt: "Side ramp view with red bunting along pathway" },
  { src: "/images/case-studies/gladstone-hockey/canopy-wide.jpg", alt: "Wide angle view with covered canopy and landings" },
  { src: "/images/case-studies/gladstone-hockey/end-view.jpg", alt: "End view showing hot water system and covered area" },
];

const WHY_CHOOSE = [
  { title: "One contractor, zero headaches", desc: "Design, manufacture, approvals, transport, and installation \u2014 all under one roof from our Gladstone base." },
  { title: "Built for Queensland conditions", desc: "C2 wind-rated steel frame construction, engineered for the demands of Central Queensland\u2019s climate." },
  { title: "Fully DDA-compliant design", desc: "PWD facilities, ambulant-compliant stalls, accessible ramps and landings designed to meet current Australian Standards." },
  { title: "Local knowledge, national capability", desc: "A long-term Gladstone business with the facilities and capacity to manufacture in Brisbane and deliver anywhere." },
];

export default function GladstoneHockeyCaseStudy() {
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
            <span className="text-white/80 font-medium">Gladstone Hockey</span>
          </nav>
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-4">Case Study</div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            12×3m Amenities Building
          </h1>
          <p className="text-white/60 mt-3 text-lg">
            Gladstone Hockey Association &bull; Gladstone, QLD
          </p>
          <p className="text-white/40 mt-1 text-sm">
            Design &bull; Manufacture &bull; Install — Full Turnkey Delivery
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
                src="/images/case-studies/gladstone-hockey/hero.jpg"
                alt="Completed 12×3m amenities building at Gladstone Hockey Fields"
                className="w-full h-64 md:h-[32rem] object-cover"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-3 mb-8">
              Completed amenities building — Gladstone Hockey Fields, 60 Tank Street, Gladstone
            </p>
          </FadeIn>
        </div>
      </section>

      {/* The Challenge */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Challenge</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">An Ageing Facility That Needed Replacing</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The Gladstone Hockey Association had been operating with an ageing amenities block that had reached the end of its serviceable life. Structurally compromised and with failing plumbing, the existing facility no longer met the standard expected by players, coaches, or visiting officials. The club needed a complete replacement — not a patch-up job.</p>
              <div className="bg-white border border-gray-200 rounded-xl p-6 my-6 relative">
                <div className="absolute top-4 left-5 text-gray-200 text-4xl font-serif">&ldquo;</div>
                <p className="text-gray-700 italic pl-6 pt-4">The existing toilet and shower block was at the end of usability both structurally and in terms of plumbing. We needed to provide a more modern and up-to-date facility for players and spectators.</p>
                <p className="text-sm font-semibold text-gray-900 mt-3 pl-6">— Brett Ryan, Facilities Director</p>
              </div>
              <p>Traditional construction and on-site refurbishment were considered, but quickly ruled out. The cost and logistical complexity of rebuilding in place made both options unviable. The club needed a solution that could be delivered quickly, within budget, and without a lengthy on-site construction programme disrupting the playing season.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Solution</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Custom-Built, Fully Compliant, Turnkey Delivery</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Multitrade Building Hire designed, manufactured, and installed a custom 12×3m amenities building — purpose-built to meet the club&apos;s brief, compliant with Gladstone Regional Council requirements, and engineered to C2 wind rating for the local climate.</p>
              <p>Rather than simply supplying a building, Multitrade managed the entire project end-to-end: from initial design and council planning approvals through to manufacture at our Brisbane facility, transport by semi-load to site, and full installation including a new concrete slab, PWD-compliant ramp and landings, electrical connections, and plumbing tie-in to council mains.</p>
              <p>The building was designed to meet full accessibility standards, featuring a dedicated PWD toilet and LH unisex facility with compliant grab rails and a 1:14-grade access ramp, alongside four showers, seven toilets (including ambulant-compliant stalls), five stainless-steel hand basins, a 315L hot water system, and 19 coat hooks — everything a busy community sports facility needs.</p>
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
                <img src="/images/case-studies/gladstone-hockey/entry.jpg" alt="PWD-compliant entry with Multitrade signage" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Front entry — PWD unisex toilet with Multitrade signage</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/case-studies/gladstone-hockey/walkway.jpg" alt="PWD ramp and walkway with tactile indicators" className="w-full h-72 object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <p className="text-xs text-gray-500 mt-2">View along the building — PWD ramp, landings and railings</p>
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

      {/* How We Delivered It */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">How We Delivered It</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">End-to-End Project Management</h2>
            <p className="text-gray-600 mb-8">Multitrade handled every phase of the project, removing the complexity of managing multiple contractors from the club&apos;s plate:</p>
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

      {/* Navigating the Challenges */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Navigating the Challenges</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Problem-Solving on the Ground</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>A project of this scope always encounters hurdles — and this one was no different. The existing facility&apos;s infrastructure wasn&apos;t designed for a modern building, requiring careful coordination of new electrical and plumbing connections. Council compliance for a permanent structure on community land added an additional layer of approvals and certifications.</p>
              <div className="bg-white border border-gray-200 rounded-xl p-6 my-6 relative">
                <div className="absolute top-4 left-5 text-gray-200 text-4xl font-serif">&ldquo;</div>
                <p className="text-gray-700 italic pl-6 pt-4">There were small items at times but all were handled well and in quick time, with phone calls and site meetings. All in all it was a smooth journey.</p>
                <p className="text-sm font-semibold text-gray-900 mt-3 pl-6">— Brett Ryan, Facilities Director</p>
              </div>
              <p>Throughout the project, the club found the communication clear and the team accessible. &ldquo;Anthony was very easy to talk to,&rdquo; Brett recalls. &ldquo;With the plans that were available it was easy to understand what we could get and what alterations we could make to keep the project within our budget.&rdquo;</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Photo Grid 2 */}
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

      {/* The Result */}
      <section className="py-16 md:py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">The Result</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">A Facility the Community Can Be Proud Of</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>The Gladstone Hockey Association now has a purpose-built, fully compliant, modern amenities facility that will serve players, coaches, officials, and spectators for years to come. The feedback from members and visitors has been unanimous: the upgrade has transformed the experience at the grounds.</p>
              <div className="bg-white border border-gray-200 rounded-xl p-6 my-6 relative">
                <div className="absolute top-4 left-5 text-gray-200 text-4xl font-serif">&ldquo;</div>
                <p className="text-gray-700 italic pl-6 pt-4">We have had feedback from players and visitors that they are very happy with the upgraded and now modern building. With Queensland state selection trials coming up mid-year, it will be a great opportunity to show off to other hockey regions what we have achieved.</p>
                <p className="text-sm font-semibold text-gray-900 mt-3 pl-6">— Brett Ryan, Facilities Director</p>
              </div>
              <p>The modular approach delivered real advantages over traditional construction: a controlled manufacturing environment in Brisbane, a single crane lift on the day of installation, and a complete turnkey package that meant the club only had to deal with one contractor from start to finish.</p>
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
                This was a new experience for myself and the team at the Gladstone Hockey Association, and seeing this project progress to the finished product we now have is a great achievement. Our thanks and appreciation go out to Multitrade for their workmanship and professionalism in making this happen for us.
              </p>
              <div className="mt-6">
                <div className="font-bold text-white">Brett Ryan</div>
                <div className="text-sm text-white/50">Facilities Director, Gladstone Hockey Association</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Why Multitrade</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Why Clubs & Organisations Choose Multitrade</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-full">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Planning a Similar Project?</h2>
              <p className="text-gray-600 mb-8">Talk to Multitrade Building Hire about your amenities, office, or facilities brief today.</p>
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
