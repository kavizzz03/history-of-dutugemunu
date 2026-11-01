import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...["story", "heroes", "map", "duel", "works"].map((id) => ({ url: `${SITE_URL}/#${id}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
