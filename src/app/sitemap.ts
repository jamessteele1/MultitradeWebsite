import type { MetadataRoute } from "next";
import bespokePages from "@/data/bespoke-pages.json";

const BASE = "https://multitrade-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/hire`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/buy`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/quote`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/case-studies`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/hire/crib-rooms`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hire/site-offices`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hire/ablutions`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hire/complexes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hire/containers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/hire/ancillary`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const projectPages: MetadataRoute.Sitemap = bespokePages.map((p) => ({
    url: `${BASE}${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
