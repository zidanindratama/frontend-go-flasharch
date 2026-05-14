import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blogs";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/blogs", priority: 0.85, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  {
    path: "/about/architecture",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/about/observability",
    priority: 0.72,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/about/load-test",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blogs/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.72 : 0.64,
    })),
  ];
}
