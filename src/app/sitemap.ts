import type { MetadataRoute } from "next";

const BASE = "https://7stories.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/templates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const cats = [
    "wedding", "newborn", "baby", "family", "elders", "books", "pets",
    "brand", "product", "events", "travel", "anniversary", "memorial",
  ];
  const categoryRoutes: MetadataRoute.Sitemap = cats.map((c) => ({
    url: `${BASE}/templates/${c}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...core, ...categoryRoutes];
}
