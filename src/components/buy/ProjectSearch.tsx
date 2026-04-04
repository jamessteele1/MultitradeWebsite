"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import LeadCaptureForm from "./LeadCaptureForm";

interface Project {
  id: string;
  category: string;
  industry: string;
  dimensions: string;
  rooms: string[];
  keywords: string[];
  slug: string | null;
  title: string;
  available_as: string[];
  year: string;
  has_page: boolean;
}

interface SearchResult {
  project: Project;
  score: number;
}

const IMAGE_MAP: Record<string, string> = {
  "First Aid Room": "/images/products/12x3-crib-room/1.jpg",
  "D&A Testing Room": "/images/products/12x3-crib-room/1.jpg",
  Bathhouse: "/images/products/12x6m-complex/1.jpg",
  "Server Room": "/images/products/12x3-office/1.jpg",
  "Control Room": "/images/products/12x3-office/1.jpg",
  "Cool Room / Cold Storage": "/images/products/10ft-container/1.jpg",
  "Gatehouse / Security": "/images/products/12x3-office/1.jpg",
  "Double Stack / Stackable": "/images/products/12x6m-complex/1.jpg",
  "Large Format Complex": "/images/products/12x6m-complex/1.jpg",
  "Large Format Crib": "/images/products/12x3-crib-room/1.jpg",
  "Large Format Office": "/images/products/12x3-office/1.jpg",
  "Kitchen / Mess": "/images/products/12x3-crib-room/1.jpg",
  "Container Office Conversion": "/images/products/10ft-container/1.jpg",
  "Accommodation / Village": "/images/products/12x6m-complex/1.jpg",
  "PWD Accessible Facility": "/images/products/6x3-toilet/1.jpg",
  "Gender Ablution": "/images/products/6x3-toilet/1.jpg",
  "Custom Build": "/images/products/12x3-crib-room/1.jpg",
  Laboratory: "/images/products/12x3-office/1.jpg",
};

export default function ProjectSearch() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [matchSummary, setMatchSummary] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  const search = useCallback(
    (q: string) => {
      if (!q.trim() || projects.length === 0) {
        setResults([]);
        setTotalMatches(0);
        setMatchSummary("");
        return;
      }

      const words = q.toLowerCase().split(/\s+/).filter(Boolean);
      const scored: SearchResult[] = [];

      for (const project of projects) {
        let score = 0;
        for (const word of words) {
          // Keywords: +3
          if (project.keywords.some((k) => k.toLowerCase().includes(word)))
            score += 3;
          // Category: +5
          if (project.category.toLowerCase().includes(word)) score += 5;
          // Rooms: +4
          if (project.rooms.some((r) => r.toLowerCase().includes(word)))
            score += 4;
          // Industry: +2
          if (project.industry.toLowerCase().includes(word)) score += 2;
          // Dimensions: +2
          if (project.dimensions.toLowerCase().includes(word)) score += 2;
          // Title: +3
          if (project.title.toLowerCase().includes(word)) score += 3;
        }
        if (score > 0) scored.push({ project, score });
      }

      scored.sort((a, b) => b.score - a.score);

      // Group by category for summary
      const cats = new Map<string, number>();
      const industries = new Set<string>();
      for (const r of scored) {
        cats.set(
          r.project.category,
          (cats.get(r.project.category) || 0) + 1
        );
        industries.add(r.project.industry.toLowerCase());
      }

      const topCat = Array.from(cats.entries()).sort((a, b) => b[1] - a[1])[0];
      const indList = Array.from(industries)
        .filter((i) => i !== "other")
        .slice(0, 3)
        .join(", ");

      setTotalMatches(scored.length);
      setResults(scored.filter((r) => r.project.has_page).slice(0, 3));

      if (topCat) {
        setMatchSummary(
          `We've delivered ${scored.length} similar projects${indList ? ` across ${indList} operations` : ""} in Queensland.`
        );
      }
    },
    [projects]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  return (
    <div id="search-tool">
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="e.g. first aid room for mine site, bathhouse for 50 workers, cool room..."
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-sm"
        />
      </div>

      {matchSummary && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-sm text-gray-700">
              <span className="font-bold text-gray-900">{totalMatches}</span>{" "}
              matches found —{" "}
              <span className="text-gray-600">{matchSummary}</span>
            </p>
          </div>

          {results.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {results.map(({ project }) => (
                <Link
                  key={project.id}
                  href={project.slug!}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={
                        IMAGE_MAP[project.category] ||
                        "/images/products/12x3-crib-room/1.jpg"
                      }
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold text-white leading-tight">
                        {project.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 flex flex-wrap gap-1">
                    {project.dimensions && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-600">
                        {project.dimensions}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-50 text-green-700">
                      {project.industry}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 md:p-6">
            <p className="text-sm font-bold text-gray-900 mb-1">
              Get a Proposal Based on a Proven Design
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Tell us about your project and we&apos;ll prepare a proposal
              tailored to your site requirements.
            </p>
            <LeadCaptureForm />
          </div>
        </div>
      )}
    </div>
  );
}
