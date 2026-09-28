import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import CallCta from "@/components/CallCta";
import PostBody from "@/components/blog/PostBody";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { formatPostDate } from "@/lib/blog";
import { blogPosts, getPost, postPath } from "@/data/blog";

// Only slugs in content/blog.json exist — anything else is a 404 (required for
// the static export, which can't render new paths on demand).
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const title = post.seoTitle ?? `${post.title} | Kayal Foods`;
  const description = post.seoDescription ?? post.excerpt;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      images: [{ url: post.image, alt: post.imageAlt ?? post.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingSchema(post),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
            { name: post.title, path: postPath(post.slug) },
          ]),
        ]}
      />
      <div className="bg-hf-footer py-14 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/blog/" className="text-sm font-semibold text-hf-amber hover:underline">
            ← All posts
          </Link>
          <div className="mt-5 flex items-center gap-3 text-xs">
            <span className="rounded-md bg-white/10 px-2.5 py-1 font-semibold uppercase text-hf-amber">
              {post.category}
            </span>
            <time dateTime={post.publishedAt} className="text-white/70">
              {formatPostDate(post.publishedAt)}
            </time>
          </div>
          <h1 className="mt-4 font-hf-heading text-4xl font-semibold leading-tight sm:text-5xl">{post.title}</h1>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
          <Image
            src={post.image}
            alt={post.imageAlt ?? post.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-10">
          <PostBody body={post.body} />
        </div>

        <div className="mt-12 rounded-3xl bg-hf-badge-bg p-8 ring-1 ring-hf-amber/30">
          <h2 className="font-hf-heading text-2xl font-semibold text-hf-ink">Come and taste it</h2>
          <p className="mt-2 leading-relaxed text-hf-body">
            Dine-in is by booking — one call and your pot goes on.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <CallCta placement="blog_post" />
            <Link
              href="/menu/"
              className="inline-flex min-h-11 items-center rounded-full border-2 border-hf-ink px-6 text-sm font-semibold text-hf-ink transition-colors hover:bg-hf-ink hover:text-white"
            >
              See the menu
            </Link>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-posts-heading" className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="more-posts-heading" className="font-hf-heading text-2xl font-semibold text-hf-ink">
              More from the kitchen
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={postPath(p.slug)}
                    className="group flex h-full flex-col gap-2 rounded-3xl border border-hf-border p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.15)]"
                  >
                    <span className="text-[11px] font-semibold uppercase text-hf-amber">{p.category}</span>
                    <span className="font-hf-heading text-lg font-semibold text-hf-ink">{p.title}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13px] font-bold text-hf-ink">
                      Read More <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
