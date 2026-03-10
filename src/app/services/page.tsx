import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { FadeIn } from "@/components/FadeIn";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Installation, Transport & Custom Manufacturing",
  description: "End-to-end portable building services. Installation, transport, custom manufacturing, and maintenance. Tier 1 documentation and compliance. Multitrade Building Hire.",
};

const SERVICES = [
  { title: "Portable Building Installation", tag: "Installation", desc: "Full installation from site preparation through to commissioning. Engineering, certification, project management, and co-ordination of all trades.", features: ["Site compliant safety systems", "Engineering & certification", "Project management", "Transport & logistics", "Crane lift & positioning", "Electrical connection & testing"], img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700&h=450&fit=crop" },
  { title: "Transport & Logistics", tag: "Transport", desc: "Reliable delivery across Queensland with established logistics partners. Table top, Hiab crane, drop deck, and barge options.", features: ["Table top & semi-trailer", "Hiab crane (5-8m reach)", "Drop deck / extendable tray", "Barge to Curtis Island", "Remote site coordination", "Multi-building convoys"], img: "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=700&h=450&fit=crop" },
  { title: "Custom Manufacturing", tag: "Design & Build", desc: "In-house design and fabrication in our Gladstone facility. From mobile crib rooms to server rooms and fire safe control rooms.", features: ["In-house design team", "Steel fabrication workshop", "Electrical fit-out & testing", "Custom floor plans", "Specialist builds", "Quality audits & ITPs"], img: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=700&h=450&fit=crop" },
  { title: "Building Services & Maintenance", tag: "Maintenance", desc: "Carpentry, steel fabrication, painting, concreting, plumbing, and electrical through Multitrade (QBCC 20298).", features: ["Carpentry & renovations", "Steel fabrication", "Painting & decorating", "Concreting & civil works", "Plumbing services", "Ongoing fleet maintenance"], img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=700&h=450&fit=crop" },
];


export default function ServicesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span><span className="text-white/80 font-medium">Services</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl">
            Design. Manufacture. <span className="gold-text">Hire. Install.</span>
          </h1>
          <p className="text-white/60 mt-5 text-lg max-w-lg serif">End-to-end portable building solutions. One point of contact from project inception to completion.</p>
        </div>
      </section>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-20">
        {SERVICES.map((service, i) => (
          <FadeIn key={i}>
            <div className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:[direction:rtl] lg:*:[direction:ltr]" : ""}`}>
              <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ aspectRatio: "16/10" }}>
                <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold gold-text mb-4">{service.tag}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{service.title}</h2>
                <p className="text-gray-600 mt-3 serif">{service.desc}</p>
                <div className="grid sm:grid-cols-2 gap-2 mt-6">
                  {service.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/quote" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg text-sm font-semibold text-gray-900 bg-gold hover:brightness-110 transition-all">
                  Enquire About This Service
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>


      {/* Process Steps */}
      <section className="bg-gray-50 border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">From Enquiry to Completion</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-5 gap-4">
            {[
              { s: "01", t: "Enquiry", d: "Tell us what you need. Site visits available." },
              { s: "02", t: "Design & Quote", d: "Tailored solution with floor plans and pricing." },
              { s: "03", t: "Build or Select", d: "Custom manufacture or select from our fleet." },
              { s: "04", t: "Deliver & Install", d: "Transport, positioning, and commissioning." },
              { s: "05", t: "Support", d: "Ongoing maintenance and project support." },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
                  <div className="text-3xl font-extrabold gold-text opacity-30 mb-2">{step.s}</div>
                  <h3 className="font-bold text-gray-900 text-sm">{step.t}</h3>
                  <p className="text-xs text-gray-500 mt-1 serif">{step.d}</p>
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Need a Service Quote?</h2>
            <p className="text-white/50 mt-2 serif">Our team responds within 2 business hours.</p>
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
