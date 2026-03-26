"use client";

import Link from "next/link";
import AddToQuoteButton from "@/components/AddToQuoteButton";

type CompareProduct = {
  id: string;
  slug: string;
  name: string;
  size: string;
  capacity: string;
  img: string;
  category: "crib-rooms" | "site-offices" | "ablutions" | "containers" | "complexes" | "ancillary";
  href: string;
  highlights: string[];
  badge?: string | null;
};

type Props = {
  currentSlug: string;
  products: CompareProduct[];
};

export default function CompareProducts({ currentSlug, products }: Props) {
  const others = products.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return null;

  // Show up to 4 products to compare (including current for context)
  const current = products.find((p) => p.slug === currentSlug);
  const comparisons = current ? [current, ...others.slice(0, 3)] : others.slice(0, 4);

  return (
    <section className="py-10 md:py-14 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Compare Products</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparisons.length}, minmax(200px, 1fr))`, minWidth: `${comparisons.length * 220}px` }}>
            {comparisons.map((p) => {
              const isCurrent = p.slug === currentSlug;
              return (
                <div
                  key={p.slug}
                  className={`rounded-xl border overflow-hidden flex flex-col ${
                    isCurrent
                      ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    {isCurrent && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold bg-gold text-gray-900">
                        VIEWING
                      </div>
                    )}
                    {!isCurrent && p.badge && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold bg-gold text-gray-900">
                        {p.badge}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-900">{p.name}</h3>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                        {p.size}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        {p.capacity}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-3 space-y-1">
                      {p.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="3" strokeLinecap="round" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-4 space-y-2">
                      {!isCurrent && (
                        <Link
                          href={p.href}
                          className="block text-center text-xs font-semibold text-gray-600 hover:text-gray-900 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          View Details
                        </Link>
                      )}
                      <AddToQuoteButton
                        compact
                        product={{
                          id: p.id,
                          name: p.name,
                          size: p.size,
                          img: p.img,
                          category: p.category,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
