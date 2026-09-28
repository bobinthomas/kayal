"use client";

import { useRef, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { uploadImage } from "./adminApi";
import { resizeImageFile } from "./resizeImage";
import SaveBar from "./SaveBar";
import type { BlogFile, BlogPost } from "@/lib/content/schemas";

const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  unsupported_type: "That file type isn't supported — use JPEG, PNG, or WebP.",
  too_large: "That image is too large even after resizing.",
  github_auth: "The GitHub token is invalid or expired — can't upload right now.",
  github_error: "GitHub couldn't be reached — try again in a moment.",
  network_error: "Couldn't reach the server — check your connection and try again.",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      {children}
      {hint && <span className="block text-xs text-neutral-400">{hint}</span>}
    </label>
  );
}

const inputClass = "w-full rounded-lg border border-neutral-300 p-2 text-sm";

function PostPhoto({
  image,
  password,
  onChange,
}: {
  image: string;
  password: string;
  onChange: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileSelect(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const { dataBase64, contentType } = await resizeImageFile(file);
      const result = await uploadImage(password, dataBase64, contentType);
      if (result.ok && result.path) {
        onChange(result.path);
      } else {
        setUploadError(UPLOAD_ERROR_MESSAGES[result.error ?? "upload_failed"] ?? "Upload failed — try again.");
      }
    } catch {
      setUploadError("Couldn't process that image — try a different file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-neutral-500">Photo</span>
      <div className="flex gap-3">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white">
              Uploading…
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-fit rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            Replace photo
          </button>
          <span className="text-xs text-neutral-400">
            JPEG/PNG/WebP, resized automatically. Used on the post page, cards and link previews.
          </span>
        </div>
      </div>
      {uploadError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">{uploadError}</div>}
    </div>
  );
}

export default function BlogEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<BlogFile>("blog", password, onUnauthorized);
  const [selected, setSelected] = useState(0);
  const [autoSlug, setAutoSlug] = useState(false);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) {
    return (
      <p className="p-4 text-red-600">
        Could not load the blog{error ? ` — ${error}` : " (no content/blog.json found yet)"}.
      </p>
    );
  }

  const current = data;
  const index = Math.min(selected, current.posts.length - 1);
  const post = current.posts[index];

  const listOrder = current.posts
    .map((p, i) => ({ p, i }))
    .sort((a, b) => b.p.publishedAt.localeCompare(a.p.publishedAt) || a.i - b.i);

  function updatePost(patch: Partial<BlogPost>) {
    const posts = current.posts.slice();
    posts[index] = { ...posts[index], ...patch };
    setData({ ...current, posts });
  }

  function addPost() {
    const fresh: BlogPost = {
      slug: `new-post-${Date.now()}`,
      title: "",
      category: "Story",
      image: "/images/home-figma/special-1.png",
      publishedAt: todayIso(),
      excerpt: "",
      body: "",
    };
    setData({ ...current, posts: [...current.posts, fresh] });
    setSelected(current.posts.length);
    setAutoSlug(true);
  }

  function deletePost() {
    if (current.posts.length <= 1) return;
    if (!window.confirm(`Delete "${post.title || "this post"}"? Its web address will stop working.`)) return;
    setData({ ...current, posts: current.posts.filter((_, i) => i !== index) });
    setSelected(0);
    setAutoSlug(false);
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-5 p-4">
        <p className="text-sm text-neutral-500">
          Each post gets its own page at <code>/blog/your-post-address/</code>, listed on <code>/blog/</code> and in
          the sitemap. The newest three appear on the home page.
        </p>

        <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Home page section</legend>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.showOnHome}
              onChange={(e) => setData({ ...data, showOnHome: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium text-neutral-700">
              Show the latest posts on the home page (the /blog pages stay online either way)
            </span>
          </label>
          <Field label="Small label above the heading">
            <input
              value={data.homeEyebrow}
              maxLength={40}
              onChange={(e) => setData({ ...data, homeEyebrow: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={data.homeHeading}
              maxLength={80}
              onChange={(e) => setData({ ...data, homeHeading: e.target.value })}
              className={inputClass}
            />
          </Field>
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Posts ({data.posts.length})</legend>
          <ul className="space-y-1">
            {listOrder.map(({ p, i }) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(i);
                    setAutoSlug(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                    i === index ? "bg-emerald-50 font-semibold text-emerald-900" : "hover:bg-neutral-100"
                  }`}
                >
                  <span className="truncate">{p.title || "(untitled)"}</span>
                  <span className="shrink-0 text-xs text-neutral-400">{p.publishedAt}</span>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addPost}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold"
          >
            + New post
          </button>
        </fieldset>

        <fieldset key={index} className="space-y-4 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Edit post</legend>

          <Field label="Title">
            <input
              value={post.title}
              maxLength={110}
              onChange={(e) =>
                updatePost(
                  autoSlug ? { title: e.target.value, slug: slugify(e.target.value) || post.slug } : { title: e.target.value },
                )
              }
              className={inputClass}
            />
          </Field>

          <Field
            label="Web address"
            hint={
              autoSlug
                ? "Filled in from the title — edit it if you like."
                : "Changing this changes the post's link — old links and Google's copy will break."
            }
          >
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <span>/blog/</span>
              <input
                value={post.slug}
                maxLength={80}
                onChange={(e) => {
                  setAutoSlug(false);
                  updatePost({ slug: e.target.value.toLowerCase() });
                }}
                className={`${inputClass} flex-1`}
              />
              <span>/</span>
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category tag (e.g. Heritage)">
              <input
                value={post.category}
                maxLength={24}
                onChange={(e) => updatePost({ category: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Publish date">
              <input
                type="date"
                value={post.publishedAt}
                onChange={(e) => updatePost({ publishedAt: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <PostPhoto image={post.image} password={password} onChange={(path) => updatePost({ image: path })} />
          <Field label="Photo description (for accessibility and Google Images — leave blank to use the title)">
            <input
              value={post.imageAlt ?? ""}
              maxLength={140}
              onChange={(e) => updatePost({ imageAlt: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Short summary" hint={`${post.excerpt.length}/240 — shown on cards and used as the Google description.`}>
            <textarea
              value={post.excerpt}
              maxLength={240}
              rows={3}
              onChange={(e) => updatePost({ excerpt: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field
            label="Post"
            hint="Blank line = new paragraph. Start a line with “## ” for a subheading. Start lines with “- ” for a bullet list. Link with [text](/menu/) or [text](https://…)."
          >
            <textarea
              value={post.body}
              rows={18}
              onChange={(e) => updatePost({ body: e.target.value })}
              className={inputClass}
            />
          </Field>

          <details className="rounded-lg bg-neutral-50 p-3">
            <summary className="cursor-pointer text-xs font-semibold text-neutral-600">
              Google search text (optional)
            </summary>
            <div className="mt-3 space-y-3">
              <Field
                label="Search title"
                hint={`${(post.seoTitle ?? "").length}/70 — blank = “${post.title || "post title"} | Kayal Foods”.`}
              >
                <input
                  value={post.seoTitle ?? ""}
                  maxLength={70}
                  onChange={(e) => updatePost({ seoTitle: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field
                label="Search description"
                hint={`${(post.seoDescription ?? "").length}/160 — blank = the short summary.`}
              >
                <textarea
                  value={post.seoDescription ?? ""}
                  maxLength={160}
                  rows={2}
                  onChange={(e) => updatePost({ seoDescription: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </details>

          <button
            type="button"
            onClick={deletePost}
            disabled={data.posts.length <= 1}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-40"
          >
            Delete this post
          </button>
        </fieldset>
      </div>
    </div>
  );
}
