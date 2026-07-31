"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";

export type FleetItem = {
  name: string;
  href: string;
  img: string;
  desc: string;
  count: number;
};

/**
 * Searchable grid of the standard-fleet purchase categories. The search box
 * filters the cards client-side by name / description so a visitor can jump
 * straight to (say) "offices" or "toilets" without scanning every card.
 */
export default function StandardFleetGrid({ items }: { items: FleetItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.desc.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <>
      {/* Search box */}
      <FadeIn>
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buildings — e.g. office, toilet, crib, container…"
              aria-label="Search standard fleet"
              className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No standard buildings match &ldquo;{query}&rdquo;.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-3 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat, i) => (
            <FadeIn key={cat.name} delay={i * 0.06}>
              <Link
                href={cat.href}
                className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all block"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-white/20 backdrop-blur-sm">
                      PURCHASE
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-xl font-extrabold tracking-tight">
                      {cat.name}
                    </div>
                    <div className="text-xs text-white/70 mt-0.5">
                      {cat.count} product{cat.count === 1 ? "" : "s"} available
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {cat.desc}
                  </p>
                  <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-900 flex items-center gap-1 transition-colors">
                    Request Purchase Price
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
