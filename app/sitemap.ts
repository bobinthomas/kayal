import type { MetadataRoute } from "next";
import { restaurant } from "@/data/restaurant";
import { blogPosts, postPath } from "@/data/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/menu/", priority: 0.9 },
    { path: "/specials/", priority: 0.9 },
    { path: "/catering/", priority: 0.7 },
    { path: "/onam-sadya/", priority: 0.7 },
    { path: "/about/", priority: 0.6 },
    { path: "/contact/", priority: 0.8 },
    { path: "/privacy/", priority: 0.2 },
  ];
  const pages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: `${restaurant.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));

  const newestPost = blogPosts[0]?.publishedAt;
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${restaurant.url}/blog/`,
      lastModified: newestPost ? new Date(newestPost) : lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${restaurant.url}${postPath(post.slug)}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...pages, ...blogPages];
}
