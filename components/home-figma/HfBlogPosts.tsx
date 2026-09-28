import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts, blogSettings, postPath } from "@/data/blog";
import HfReveal from "./HfReveal";

const LATEST_COUNT = 3;

export default function HfBlogPosts() {
  if (!blogSettings.showOnHome || blogPosts.length === 0) return null;
  const latest = blogPosts.slice(0, LATEST_COUNT);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-12 px-6 sm:px-10 lg:px-16">
        <HfReveal as="div" className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">
            {blogSettings.homeEyebrow}
          </p>
          <h2 className="font-hf-heading text-3xl font-bold text-hf-ink sm:text-4xl">
            {blogSettings.homeHeading}
          </h2>
        </HfReveal>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {latest.map((post, i) => (
            <HfReveal key={post.slug} as="div" delayMs={i * 100}>
              <Link
                href={postPath(post.slug)}
                className="group flex flex-col gap-5 rounded-3xl border border-hf-border p-5 transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.15)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <span className="inline-flex w-fit items-center rounded-md bg-hf-badge-bg px-2.5 py-1 text-[11px] font-semibold uppercase text-hf-amber">
                    {post.category}
                  </span>
                  <h3 className="font-hf-heading text-[22px] font-semibold text-hf-ink">{post.title}</h3>
                  <p className="text-sm leading-relaxed text-hf-body">{post.excerpt}</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-hf-ink">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </HfReveal>
          ))}
        </div>

        <Link
          href="/blog/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-hf-ink underline-offset-4 hover:underline"
        >
          View all posts <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
