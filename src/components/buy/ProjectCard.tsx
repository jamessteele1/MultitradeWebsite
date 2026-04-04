import Link from "next/link";

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  industry: string;
  dimensions: string;
  image: string;
  summary?: string;
}

export default function ProjectCard({
  slug,
  title,
  category,
  industry,
  dimensions,
  image,
  summary,
}: ProjectCardProps) {
  return (
    <Link
      href={slug}
      className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all block"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="text-base font-bold text-white leading-tight">
            {title}
          </div>
        </div>
      </div>
      <div className="p-4">
        {summary && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
            {summary}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {dimensions && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600">
              {dimensions}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700">
            {industry}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
            {category}
          </span>
        </div>
      </div>
    </Link>
  );
}
