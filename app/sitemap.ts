import type { MetadataRoute } from "next";

const siteUrl = "https://akkapol-systems.vercel.app";
const lastModified = new Date("2026-06-01");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/cv`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
