import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import ProposalCTA from "@/components/buy/ProposalCTA";
import SpecsTable from "@/components/buy/SpecsTable";
import SimilarProjects from "@/components/buy/SimilarProjects";
import SidebarProposalCard from "@/components/buy/SidebarProposalCard";
import ProjectGallery from "@/components/buy/ProjectGallery";
import bespokePages from "@/data/bespoke-pages.json";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return bespokePages.map((p) => ({
    slug: p.slug.replace("/buy/projects/", ""),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = bespokePages.find(
    (p) => p.slug === `/buy/projects/${slug}`
  );
  if (!project) return {};

  return {
    title: project.seo_title,
    description: project.seo_description,
    alternates: {
      canonical: `https://multitrade-website.vercel.app/buy/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = bespokePages.find(
    (p) => p.slug === `/buy/projects/${slug}`
  );
  if (!project) notFound();

  // Extract optional fields that only some projects have
  const projectAny = project as Record<string, unknown>;
  const galleryImages = Array.isArray(projectAny.gallery) ? projectAny.gallery as string[] : null;
  const caseStudyLink = typeof projectAny.case_study === "string" ? projectAny.case_study : null;

  const quickSpecs = [
    { label: "Dimensions", value: project.dimensions || "Custom" },
    { label: "Wind Rating", value: project.wind_rating },
    {
      label: "Configuration",
      value:
        project.rooms.length > 0
          ? `${project.rooms.length} areas`
          : "Custom layout",
    },
    { label: "Power", value: "240V single phase" },
  ];

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div
        className="border-b border-white/10"
        style={{ background: "var(--navy)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-white/40">
            <Link href="/" className="hover:text-white/60">
              Home
            </Link>
            <span>/</span>
            <Link href="/buy" className="hover:text-white/60">
              Buy
            </Link>
            <span>/</span>
            <span className="text-white/60">Completed Projects</span>
            <span>/</span>
            <span className="text-white/80 font-medium">
              {project.category}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Split */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Left: Image */}
            <div>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      project.badge === "Proven Design"
                        ? "bg-green-500 text-white"
                        : "bg-gold text-white"
                    }`}
                  >
                    {project.badge}
                  </span>
                </div>
              </div>
              {galleryImages && (
                <ProjectGallery
                  images={galleryImages}
                  title={project.title}
                />
              )}
            </div>

            {/* Right: Info */}
            <div>
              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">
                  {project.industry}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                  {project.region}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600">
                  {project.category}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mt-4">
                {project.summary}
              </p>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {quickSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                  >
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {spec.label}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-0.5">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Block */}
              <div id="proposal-cta" className="mt-6">
                <ProposalCTA
                  projectTitle={project.title}
                  projectCategory={project.category}
                  projectDimensions={project.dimensions}
                  projectSlug={project.slug}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content (2/3) */}
            <div className="md:col-span-2 space-y-10">
              {/* The Brief */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  The Brief
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.brief}
                </p>
              </div>

              {/* What We Delivered */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  What We Delivered
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.delivered}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Key Features
                </h2>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {project.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-5">
              {/* Full Specs */}
              <SpecsTable specs={Object.fromEntries(Object.entries(project.specs).filter(([, v]) => v != null)) as Record<string, string>} />

              {/* Need Something Similar? */}
              <SidebarProposalCard
                projectTitle={project.title}
                projectCategory={project.category}
                projectDimensions={project.dimensions}
                projectSlug={project.slug}
              />

              {caseStudyLink && (
                <Link
                  href={caseStudyLink}
                  className="flex items-center gap-3 rounded-xl p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-600">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Read the Full Case Study</div>
                    <div className="text-xs text-gray-500">Detailed project walkthrough with gallery</div>
                  </div>
                </Link>
              )}

              {/* Available As */}
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-bold text-gray-900">
                    Available As
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {["Hire", "Purchase", "Custom Build"].map((opt) => (
                    <div
                      key={opt}
                      className="flex items-center justify-between px-4 py-2.5"
                    >
                      <span className="text-xs text-gray-600 font-medium">
                        {opt}
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        Available
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Projects */}
      <div className="border-t border-gray-200 bg-gray-50">
        <SimilarProjects
          slugs={project.similar_slugs}
          currentSlug={project.slug}
        />
      </div>

      {/* Bottom CTA Band */}
      <section style={{ background: "#0f1216" }} className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Built Over 500 Buildings in 45 Years
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Whatever your site needs, chances are we&apos;ve already designed
            and delivered it. Tell us about your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <a
              href="#proposal-cta"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gold hover:bg-amber-600 transition-colors"
            >
              Get a Free Proposal
            </a>
            <a
              href="tel:0749786122"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white border border-white/20 hover:border-white/40 transition-colors"
            >
              (07) 4978 6122
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-gray-50 border-y border-gray-200 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sm text-gray-600 space-y-3">
            {project.seo_content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: project.title,
            description: project.summary,
            manufacturer: {
              "@type": "Organization",
              name: "Multitrade Building Hire",
            },
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Multitrade Building Hire",
              },
            },
            category: project.category,
          }),
        }}
      />

      <MobileCTA />
    </>
  );
}
