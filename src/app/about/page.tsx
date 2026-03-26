import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description: "45+ years of portable building solutions in Central Queensland. Family-owned since 1980. Design, manufacture, hire, sale & installation. Meet the Multitrade Group.",
};

const TIMELINE = [
  { year: "1980", title: "Company Inception", desc: "Founded by Peter Groen-Int-Woud in Gladstone. Initially focused on contracting and installation, soon expanding into portable building hire." },
  { year: "2008", title: "Emerald Yard Established", desc: "Strategic expansion into the Emerald region during the rapid growth of Bowen Basin coal mines. C-RES BMA Certified." },
  { year: "2009", title: "Solar Toilet Development", desc: "Designed and manufactured an environmentally friendly toilet unit operating entirely off solar power." },
  { year: "2013", title: "Mobile Crib Rooms", desc: "Fully towable crib rooms with onboard generators and service tanks developed for remote worksites." },
  { year: "2023", title: "Solar Facility Launched", desc: "Industry-first off-grid solar power facility with 8.85kW PV and 32.8kWh lithium phosphate battery." },
  { year: "2024", title: "Multitrade Homes", desc: "Expanding into residential construction for Central Queensland families, led by Shane Finlay." },
];


export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <a href="/" className="hover:text-white/60">Home</a><span>/</span><span className="text-white/80 font-medium">About Us</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            45+ Years Building for <span className="gold-text">Queensland&apos;s Industries</span>
          </h1>
          <p className="text-white/60 mt-5 text-lg max-w-lg">
            The Multitrade Group has a long history in Central Queensland. Decades of experience have allowed us to position ourselves as the market leader in portable building solutions.
          </p>
          <div className="flex gap-8 md:gap-12 mt-10">
            {[{ v: "1980", l: "Year Established" }, { v: "45+", l: "Years Operating" }, { v: "100+", l: "Project Locations" }, { v: "0", l: "Lost Time Injuries" }].map((s, i) => (
              <div key={i}><div className="text-2xl md:text-3xl font-extrabold text-white">{s.v}</div><div className="text-xs text-white/40 mt-0.5">{s.l}</div></div>
            ))}
          </div>
        </div>
      </section>


      {/* Director Statement */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200 relative">
              <div className="absolute top-6 left-8 text-gray-200 opacity-40 text-6xl font-serif">&ldquo;</div>
              <div className="relative z-10 pl-4 pt-6">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">A Word from Our Director</h2>
                <div className="space-y-4 text-gray-600">
                  <p>Our focus at Multitrade Group has always been on building long-term relationships with our valued clients. We are proud that over time, these have developed through mutual trust, expertise and our proven success.</p>
                  <p>We understand the needs and drivers of our clients in the mining, oil & gas, infrastructure and government sectors — and we deliver on their expectations.</p>
                </div>
                <p className="mt-6 text-lg font-semibold italic text-gray-900">&ldquo;We are strong believers in the continuity of our services and we guarantee our professional services from inception to completion.&rdquo;</p>
                <div className="mt-4 font-bold text-gray-900">Anthony Groen-Int-Woud</div>
                <div className="text-sm text-gray-500">Managing Director</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn className="text-center mb-14">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Our Journey</div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">The History</h2>
          </FadeIn>
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-2xl font-extrabold gold-text">{t.year}</span>
                  </div>
                  <div className="w-px bg-gray-300 flex-shrink-0 mt-2" style={{ height: "calc(100% + 1rem)" }} />
                  <div className="pb-2">
                    <h3 className="font-bold text-gray-900">{t.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* Values */}
      <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">What Drives Us</div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Vision & Values</h2>
            <p className="text-white/50 mt-3 max-w-2xl mx-auto">To be the industry leader in the hire & sale of portable building projects, achieving sustainable growth through the quality of our people and the strength of our relationships.</p>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Safety", desc: "Safety and health are what matter most. Zero lost time injuries in over 5 years." },
              { name: "Client Relationships", desc: "We have trusting relationships built over decades of delivering on expectations." },
              { name: "Environment", desc: "We minimise our environmental impact through material and operational care." },
              { name: "Community", desc: "We show respect for the community, Indigenous Australians and the environment." },
            ].map((v, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full">
                  <h3 className="font-bold text-white text-sm mb-2">{v.name}</h3>
                  <p className="text-sm text-white/50">{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Your Next Project Starts With Us</h2>
            <p className="text-gray-500 mt-2">45+ years of experience. Queensland&apos;s largest privately owned fleet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <a href="/quote" className="px-8 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">Get a Free Quote</a>
              <a href="tel:0749792333" className="px-8 py-3.5 rounded-lg font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all">(07) 4979 2333</a>
            </div>
          </FadeIn>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
