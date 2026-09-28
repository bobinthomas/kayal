import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { buildBlogSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { formatPostDate } from "@/lib/blog";
import { blogPosts, postPath } from "@/data/blog";

const TITLE = "Notes on Naadan Cooking | Kayal Foods Blog, Sydney";
const DESCRIPTION =
  "Stories from the Kayal Foods kitchen in Moorebank, Sydney — Kerala dishes, village recipes and the traditions behind naadan cooking.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog/" },
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og/home.png"] },
};

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          buildBlogSchema(blogPosts),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog/" },
          ]),
        ]}
      />
      <div className="bg-hf-footer py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">From the Kitchen</p>
          <h1 className="mt-3 font-hf-heading text-4xl font-semibold sm:text-5xl">Notes on Naadan Cooking</h1>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            Stories, recipes and traditions from Kerala&apos;s village table — cooked in Moorebank, Sydney.
          </p>
        </div>
      </div>

      <section aria-label="Blog posts" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={postPath(post.slug)}
                className="group flex h-full flex-col gap-5 rounded-3xl border border-hf-border bg-white p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.15)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="inline-flex w-fit items-center rounded-md bg-hf-badge-bg px-2.5 py-1 font-semibold uppercase text-hf-amber">
                      {post.category}
                    </span>
                    <time dateTime={post.publishedAt} className="text-hf-body">
                      {formatPostDate(post.publishedAt)}
                    </time>
                  </div>
                  <h2 className="font-hf-heading text-[22px] font-semibold text-hf-ink">{post.title}</h2>
                  <p className="text-sm leading-relaxed text-hf-body">{post.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] font-bold text-hf-ink">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
