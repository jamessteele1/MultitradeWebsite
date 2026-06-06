import type { MetadataRoute } from "next";

const BASE = "https://www.multitrade.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin tooling is not for indexing
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
