import type { MetadataRoute } from "next";
import bespokePages from "@/data/bespoke-pages.json";

const BASE = "https://www.multitrade.com.au";

// Hire product detail slugs, grouped by section.
// NOTE: keep in sync with the PRODUCTS objects in
// src/app/hire/<section>/[slug]/page.tsx — if you add/remove a product
// page, update it here so it appears in the sitemap.
const HIRE_PRODUCTS: Record<string, string[]> = {
  "crib-rooms": [
    "12x3m-crib-room",
    "6x3m-crib-room",
    "12x3m-mobile-crib",
    "6-6x3m-self-contained",
    "7-2x3m-self-contained",
    "9-6x3m-living-quarters",
  ],
  "site-offices": [
    "12x3m-office",
    "6x3m-office",
    "3x3m-office",
    "6x3m-supervisor-office",
    "self-contained-supervisor-office",
    "20ft-container-office",
    "gatehouse",
  ],
  ablutions: [
    "6x3m-toilet-block",
    "3-6x2-4m-toilet",
    "4-2x3m-shower-block",
    "bathhouse",
    "solar-toilet",
    "chemical-toilet",
    "pwd-chemical-toilet",
  ],
  containers: [
    "20ft-container",
    "20ft-high-cube-container",
    "10ft-container",
    "20ft-dg-container",
    "10ft-dg-container",
    "20ft-shelved-container",
    "20ft-riggers-container",
  ],
  ancillary: [
    "5000l-tank-pump",
    "6000l-waste-tank",
    "4000l-waste-tank",
    "12x3m-covered-deck",
    "40ft-flat-rack",
    "stair-landing",
    "dual-hand-wash-station",
    "wash-trough",
  ],
};

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${BASE}${path}`,
    changeFrequency,
    priority,
  });

  // Top-level + key landing pages
  const core: MetadataRoute.Sitemap = [
    entry("/", 1.0, "weekly"),
    entry("/hire", 0.9, "weekly"),
    entry("/buy", 0.9, "weekly"),
    entry("/install", 0.8),
    entry("/site-planner", 0.8, "weekly"),
    entry("/scope-builder", 0.8, "weekly"),
    entry("/solar-facility", 0.7),
    entry("/quote", 0.8),
    entry("/about", 0.6),
    entry("/contact", 0.6),
    entry("/case-studies", 0.7),
  ];

  // Hire category landing pages
  const hireCategories: MetadataRoute.Sitemap = [
    "crib-rooms",
    "site-offices",
    "ablutions",
    "complexes",
    "containers",
    "ancillary",
  ].map((c) => entry(`/hire/${c}`, 0.8, "weekly"));

  // Hire product detail pages
  const hireProducts: MetadataRoute.Sitemap = Object.entries(HIRE_PRODUCTS).flatMap(
    ([section, slugs]) => slugs.map((s) => entry(`/hire/${section}/${s}`, 0.7)),
  );

  // Industries + locations + case studies (SEO landing pages)
  const industries: MetadataRoute.Sitemap = [
    entry("/industries", 0.7, "weekly"),
    ...["mining", "construction", "oil-gas", "civil"].map((i) =>
      entry(`/industries/${i}`, 0.6),
    ),
  ];

  const locations: MetadataRoute.Sitemap = [
    entry("/locations", 0.7, "weekly"),
    ...["gladstone", "mackay", "rockhampton", "emerald", "bowen-basin"].map((l) =>
      entry(`/locations/${l}`, 0.6),
    ),
  ];

  const caseStudies: MetadataRoute.Sitemap = [
    "gladstone-hockey",
    "futura-solar",
    "alpha-hpa",
  ].map((c) => entry(`/case-studies/${c}`, 0.6));

  // Bespoke "previous build" project pages
  const projectPages: MetadataRoute.Sitemap = bespokePages.map((p) =>
    entry(p.slug, 0.6),
  );

  return [
    ...core,
    ...hireCategories,
    ...hireProducts,
    ...industries,
    ...locations,
    ...caseStudies,
    ...projectPages,
  ];
}
