import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import ScopeWizard from "@/components/scope-builder/ScopeWizard";

export default function ScopeBuilderPage() {
  return (
    <>
      <Header />
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
              "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%,rgba(212,168,67,.12) 0%,transparent 50%)",
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Build Your <span className="gold-text">Site Setup</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-3xl mx-auto">
            Select what you need and we&apos;ll recommend the right buildings, equipment, and services for your project.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <ScopeWizard />
        </div>
      </section>
      <MobileCTA />
    </>
  );
}
