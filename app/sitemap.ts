import type { MetadataRoute } from "next";

import { listPosts } from "@/lib/blog";

const siteUrl = "https://akkapol-systems.vercel.app";
// Keep this stable across builds; update it only when page content changes.
const lastModified = new Date("2026-08-25");

export default function sitemap(): MetadataRoute.Sitemap {
  // Published posts are read from content/blog at build time. New Markdown
  // files are picked up by the next build/deploy.
  const posts = listPosts();
  const newestPostDate = posts[0]?.date;

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/th`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/cv`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: newestPostDate ? new Date(newestPostDate) : lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...postEntries,
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/th/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
