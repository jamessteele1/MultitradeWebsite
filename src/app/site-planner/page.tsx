import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import SitePlannerClient from "@/components/site-planner/SitePlannerClient";

export const metadata = {
  title: "Site Layout Planner | Multitrade Building Hire",
  description:
    "Plan your site layout with our drag-and-drop tool. Place portable buildings to scale and export your layout as PDF.",
};

export default function SitePlannerPage() {
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
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-14 text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            Site Layout <span className="gold-text">Planner</span>
          </h1>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Drag and drop buildings onto the grid to plan your site layout. Export as PDF to include with your quote.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 min-h-[600px]">
        <SitePlannerClient />
      </section>
      <MobileCTA />
    </>
  );
}
