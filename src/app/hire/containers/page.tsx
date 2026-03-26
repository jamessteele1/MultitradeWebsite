import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Container Hire & Sale QLD",
  description: "Hire or buy shipping containers in Queensland. Standard, high cube, dangerous goods, shelved, and container office conversions. Multitrade Building Hire.",
};

const PRODUCTS = [
    { id: "20ft-container", name: "20ft Container", size: "20ft (6x2.4m)", capacity: "33 cubic m", desc: "Standard 20ft shipping container for secure on-site storage.", badge: "", img: "/images/products/20ft-container/1.jpg" },
    { id: "20ft-high-cube-container", name: "20ft High Cube Container", size: "20ft HC", capacity: "37 cubic m", desc: "Extra height container for taller items and equipment storage.", badge: "", img: "/images/products/20ft-container/1.jpg" },
    { id: "10ft-container", name: "10ft Container", size: "10ft (3x2.4m)", capacity: "16 cubic m", desc: "Compact container for smaller sites with limited space.", badge: "", img: "/images/products/10ft-container/1.jpg" },
    { id: "20ft-dg-container", name: "20ft Dangerous Goods Container", size: "20ft DG", capacity: "DG compliant", desc: "Side-opening dangerous goods storage meeting hazmat requirements.", badge: "DG RATED", img: "/images/products/10ft-dg-container/1.jpg" },
    { id: "10ft-dg-container", name: "10ft Dangerous Goods Container", size: "10ft DG", capacity: "DG compliant", desc: "Compact dangerous goods storage for smaller hazardous material quantities.", badge: "DG RATED", img: "/images/products/10ft-dg-container/1.jpg" },
    { id: "20ft-shelved-container", name: "20ft Shelved Container", size: "20ft", capacity: "Organised", desc: "Container fitted with adjustable heavy-duty shelving for organised storage.", badge: "", img: "/images/products/20ft-shelved-container/1.jpg" },
    { id: "20ft-riggers-container", name: "20ft Riggers Container", size: "20ft", capacity: "Workshop", desc: "Purpose-built workshop with workbench, shelving, and power for rigging teams.", badge: "", img: "/images/products/20ft-container-office/1.jpg" }
];

export default function ContainersPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">Home</Link><span>/</span>
            <Link href="/hire" className="hover:text-white/60">Hire</Link><span>/</span>
            <span className="text-white/80 font-medium">Shipping Containers</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/70 font-medium mb-4">
            {PRODUCTS.length} Products Available for Hire & Sale
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Shipping <span className="gold-text">Containers</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-lg text-base leading-relaxed">A large range of storage containers for hire and sale across Australia. Standard shipping, dangerous goods, refrigerated, shelved, and custom-converted containers available at short notice.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all cursor-pointer">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {p.badge && <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md text-xs font-bold text-gray-900 bg-gold">{p.badge}</span>}
                    <div className="absolute bottom-3 left-3 z-20 text-white">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-white/70">{p.size} · {p.capacity}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3">{p.desc}</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link href={`/hire/containers/${p.id}`} className="text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                        See Details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                      <AddToQuoteButton compact product={{ id: p.id, name: p.name, size: p.size, img: p.img, category: "containers" }} />
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <MobileCTA />
    </>
  );
}
