import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import bespokePages from "@/data/bespoke-pages.json";

/**
 * Image mapping for bespoke categories.
 * Replace placeholder paths with real photos as they become available.
 * Photos go in /public/images/bespoke-categories/
 */
const CATEGORY_IMAGE: Record<string, string> = {
  "First Aid Room": "/images/products/12x3-crib-room/1.jpg",
  "D&A Testing Room": "/images/products/12x3-crib-room/1.jpg",
  Bathhouse: "/images/products/12x6m-complex/1.jpg",
  "Server Room": "/images/products/12x3-office/1.jpg",
  "Control Room": "/images/products/12x3-office/1.jpg",
  "Cool Room / Cold Storage": "/images/products/10ft-container/1.jpg",
  "Gatehouse / Security": "/images/bespoke-categories/gatehouse.jpg",
  "Double Stack / Stackable": "/images/products/12x6m-complex/1.jpg",
  "PWD Accessible Facility": "/images/products/6x3-toilet/1.jpg",
  "Large Format Complex": "/images/products/12x6m-complex/1.jpg",
  "Kitchen / Mess": "/images/buildings-web/_CWM3930.jpg",
  "Container Office Conversion": "/images/products/10ft-container/1.jpg",
  "Accommodation / Village": "/images/products/12x6m-complex/1.jpg",
  "Custom Build": "/images/products/12x3-crib-room/1.jpg",
  "Gender Ablution": "/images/products/6x3-toilet/1.jpg",
  Laboratory: "/images/products/12x3-office/1.jpg",
  "Change Room": "/images/products/12x3-crib-room/1.jpg",
  "Workshop / Warehouse": "/images/products/10ft-container/1.jpg",
  "Switch Room": "/images/products/12x3-office/1.jpg",
  Classroom: "/images/products/12x3-office/1.jpg",
  "Amenities / Club Building": "/images/products/12x3-crib-room/1.jpg",
  "Training Room": "/images/products/12x3-office/1.jpg",
  "DNA Testing Room": "/images/products/12x3-crib-room/1.jpg",
  "Nap Room": "/images/products/12x3-crib-room/1.jpg",
  Gymnasium: "/images/products/12x6m-complex/1.jpg",
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
