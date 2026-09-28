/**
 * Helpers for blog post content (content/blog.json, edited via /admin).
 * Post bodies are plain text — no HTML — so they're rendered as React nodes
 * (never dangerouslySetInnerHTML) from the small block format parsed here.
 */

export type BodyBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export function parseBody(body: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  for (const chunk of body.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    if (lines[0].startsWith("## ")) {
      blocks.push({ type: "h2", text: lines[0].slice(3).trim() });
      lines.shift();
      if (lines.length === 0) continue;
    }
    if (lines.every((line) => line.startsWith("- "))) {
      blocks.push({ type: "ul", items: lines.map((line) => line.slice(2).trim()) });
    } else {
      blocks.push({ type: "p", text: lines.join(" ") });
    }
  }
  return blocks;
}

export type InlinePart =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

// Only site-relative and https links are turned into anchors; anything else
// (e.g. a javascript: URL) is left as plain text.
export function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [whole, label, href] = match;
    const start = match.index ?? 0;
    if (start > last) parts.push({ type: "text", text: text.slice(last, start) });
    if (href.startsWith("/") || href.startsWith("https://")) {
      parts.push({ type: "link", text: label, href });
    } else {
      parts.push({ type: "text", text: whole });
    }
    last = start + whole.length;
  }
  if (last < text.length) parts.push({ type: "text", text: text.slice(last) });
  return parts;
}

// 'YYYY-MM-DD' -> "28 September 2026", independent of the viewer's timezone.
export function formatPostDate(publishedAt: string): string {
  return new Date(`${publishedAt}T00:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
