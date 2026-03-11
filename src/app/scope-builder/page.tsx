import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import ScopeForm from "@/components/scope-builder/ScopeForm";
import ScopeIntro from "@/components/scope-builder/ScopeIntro";

export default function ScopeBuilderPage() {
  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 60%, var(--navy-3) 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Scope <span className="gold-text">Builder</span>
          </h1>
          <p className="text-white/65 mt-4 max-w-3xl mx-auto serif">
            Convert rough project requirements into a structured preliminary recommendation that your team can submit directly to MBH.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <ScopeIntro />
          <ScopeForm />
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
