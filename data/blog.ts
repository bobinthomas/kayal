/**
 * Blog posts. Content lives in content/blog.json — edit via /admin ("Blog"
 * tab) or the file directly, never hardcode posts in components.
 */
import blogJson from "@/content/blog.json";
import type { BlogPost } from "@/lib/content/schemas";

export const blogSettings = {
  showOnHome: blogJson.showOnHome,
  homeEyebrow: blogJson.homeEyebrow,
  homeHeading: blogJson.homeHeading,
};

// Newest first; posts sharing a date keep their order in the file.
export const blogPosts: BlogPost[] = (blogJson.posts as BlogPost[])
  .map((post, index) => ({ post, index }))
  .sort((a, b) => b.post.publishedAt.localeCompare(a.post.publishedAt) || a.index - b.index)
  .map(({ post }) => post);

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`;
}
