import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import bespokePages from "@/data/bespoke-pages.json";

/**
 * Image mapping for bespoke categories.
 * Replace placeholder paths with real photos as they become available.
 * Photos go in /public/images/bespoke-categories/
 */
// Real build photos per category — keep in sync with the IMAGE_MAP in
// ProjectSearch.tsx (search results) and the per-page heroes in
// bespoke-pages.json so the /buy grid, search, and detail pages all match.
const CATEGORY_IMAGE: Record<string, string> = {
  "Accommodation / Village": "/images/bespoke/accommodation-village/1.jpg",
  "Amenities / Club Building": "/images/case-studies/gladstone-hockey/hero.jpg",
  Bathhouse: "/images/bespoke/bathhouse/1.jpg",
  "Change Room": "/images/bespoke/standard-room/1.jpg",
  Classroom: "/images/bespoke/standard-room/1.jpg",
  "Container Office Conversion": "/images/bespoke/container-office-conversion/1.jpg",
  "Control Room": "/images/bespoke/control-room/1.jpg",
  "Cool Room / Cold Storage": "/images/bespoke/cool-room-cold-storage/1.jpg",
  "Custom Build": "/images/bespoke/custom-build/1.jpg",
  "D&A Testing Room": "/images/bespoke/standard-room/1.jpg",
  "DNA Testing Room": "/images/bespoke/standard-room/1.jpg",
  // Double Stack / Stackable: still a placeholder — no two-storey photo yet
  "Double Stack / Stackable": "/images/products/12x6m-complex/1.jpg",
  "First Aid Room": "/images/bespoke/standard-room/1.jpg",
  "Gatehouse / Security": "/images/bespoke/gatehouse-security/1.jpg",
  "Gender Ablution": "/images/bespoke/gender-ablution/1.jpg",
  "Kitchen / Mess": "/images/bespoke/kitchen-mess/1.jpg",
  Laboratory: "/images/bespoke/standard-room/1.jpg",
  "Large Format Complex": "/images/bespoke/large-format-complex/1.jpg",
  "Large Format Crib": "/images/bespoke/large-format-crib/1.jpg",
  "Large Format Office": "/images/bespoke/large-format-office/1.jpg",
  "PWD Accessible Facility": "/images/bespoke/pwd-accessible-facility/1.jpg",
  "Server Room": "/images/bespoke/server-room/1.jpg",
  "Switch Room": "/images/bespoke/switch-room/1.jpg",
  "Training Room": "/images/bespoke/standard-room/1.jpg",
  "Workshop / Warehouse": "/images/bespoke/workshop-warehouse/1.jpg",
};

/** Rename categories for display */
const DISPLAY_NAME: Record<string, string> = {
  "Large Format Crib": "Large Format Complex",
  "Large Format Office": "Large Format Complex",
};

/** Categories to hide from the grid */
const HIDDEN_CATEGORIES = new Set(["Custom Lookout"]);

export default function BespokeCategories() {
  // Group bespoke pages by category and count from full dataset
  const cats = new Map<string, { count: number; slug: string }>();
  for (const p of bespokePages) {
    if (HIDDEN_CATEGORIES.has(p.category)) continue;

    const displayName = DISPLAY_NAME[p.category] || p.category;
    if (!cats.has(displayName)) {
      cats.set(displayName, { count: 1, slug: p.slug });
    } else {
      cats.get(displayName)!.count++;
    }
  }

  const categories = Array.from(cats.entries())
    .map(([name, { slug }]) => ({
      name,
      slug,
      image:
        CATEGORY_IMAGE[name] || "/images/products/12x6m-complex/1.jpg",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {categories.map((cat, i) => (
        <FadeIn key={cat.name} delay={i * 0.04}>
          <Link
            href={cat.slug}
            className="group bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/10 transition-all block"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-base font-bold text-white leading-tight">
                  {cat.name}
                </div>
              </div>
            </div>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
