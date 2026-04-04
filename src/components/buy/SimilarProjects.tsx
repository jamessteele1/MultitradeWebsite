import ProjectCard from "./ProjectCard";
import bespokePages from "@/data/bespoke-pages.json";

interface SimilarProjectsProps {
  slugs: string[];
  currentSlug: string;
}

export default function SimilarProjects({ slugs, currentSlug }: SimilarProjectsProps) {
  const similar = slugs
    .filter((s) => s !== currentSlug)
    .map((slug) => bespokePages.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Similar Projects
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {similar.map((project) => (
            <ProjectCard
              key={project!.slug}
              slug={project!.slug}
              title={project!.title}
              category={project!.category}
              industry={project!.industry}
              dimensions={project!.dimensions}
              image={project!.image}
              summary={project!.summary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
