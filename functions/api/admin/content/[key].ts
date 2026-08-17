/**
 * GET/PUT a single content file, addressed by a hardcoded key -> path
 * lookup (CONTENT_MAP). The GitHub PAT this Function holds has write
 * access to the whole repo, not just content/*.json — this lookup table,
 * which never accepts a client-supplied path, is the actual security
 * boundary. Do not change that.
 */
import type { PagesFunction } from "@cloudflare/workers-types";
import { z } from "zod";
import { checkAdminAuth, unauthorized, type AdminEnv } from "../_auth";
import { getFile, putFile, GitHubConflictError, GitHubAuthError } from "../_github";
import {
  CONTENT_SCHEMAS,
  type ContentKey,
  MenuFileSchema,
  MenuMetaFileSchema,
  SpecialsFileSchema,
  HomeHeroFileSchema,
} from "../../../../lib/content/schemas";

const CONTENT_PATHS: Record<ContentKey, string> = {
  menu: "content/menu.json",
  "menu-meta": "content/menu-meta.json",
  specials: "content/specials.json",
  restaurant: "content/restaurant.json",
  reviews: "content/reviews.json",
  copy: "content/copy.json",
  "home-hero": "content/home-hero.json",
  "home-showcase": "content/home-showcase.json",
};

function isContentKey(key: string): key is ContentKey {
  return Object.prototype.hasOwnProperty.call(CONTENT_PATHS, key);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function crossReferenceIssues(
  env: AdminEnv,
  key: ContentKey,
  data: z.infer<(typeof CONTENT_SCHEMAS)[ContentKey]>,
): Promise<string[]> {
  if (key !== "menu-meta" && key !== "specials" && key !== "home-hero") return [];

  const menuFile = await getFile(env, CONTENT_PATHS.menu);
  if (!menuFile) return [];
  const menuParsed = MenuFileSchema.safeParse(JSON.parse(menuFile.content));
  if (!menuParsed.success) return [];
  const sectionIds = new Set(menuParsed.data.sections.map((s) => s.id));
  const itemIds = new Set(menuParsed.data.sections.flatMap((s) => s.items.map((i) => i.id)));

  const issues: string[] = [];
  if (key === "menu-meta") {
    const menuMeta = data as z.infer<typeof MenuMetaFileSchema>;
    for (const sectionId of Object.keys(menuMeta.navLabels)) {
      if (!sectionIds.has(sectionId)) {
        issues.push(`navLabels: unknown menu section id "${sectionId}"`);
      }
    }
    for (const spotlight of menuMeta.spotlights) {
      if (spotlight.href && spotlight.href.startsWith("#")) {
        const sectionId = spotlight.href.slice(1);
        if (!sectionIds.has(sectionId)) {
          issues.push(`spotlights: "${spotlight.id}" links to unknown section "#${sectionId}"`);
        }
      }
    }
  }

  if (key === "specials") {
    const specials = data as z.infer<typeof SpecialsFileSchema>;
    for (const id of specials.featuredSpecialIds) {
      if (!itemIds.has(id)) {
        issues.push(`featuredSpecialIds: unknown menu item id "${id}"`);
      }
    }
  }

  if (key === "home-hero") {
    const homeHero = data as z.infer<typeof HomeHeroFileSchema>;
    for (const slide of homeHero.slides) {
      if (!itemIds.has(slide.menuItemId)) {
        issues.push(`slides: "${slide.id}" references unknown menu item id "${slide.menuItemId}"`);
      }
    }
  }

  return issues;
}

export const onRequestGet: PagesFunction<AdminEnv, "key"> = async ({ request, env, params }) => {
  if (!(await checkAdminAuth(request, env))) return unauthorized();

  const key = params.key;
  if (typeof key !== "string" || !isContentKey(key)) {
    return json({ ok: false, error: "unknown_key" }, 404);
  }

  try {
    const file = await getFile(env, CONTENT_PATHS[key]);
    if (!file) return json({ ok: true, data: null, sha: null });
    return json({ ok: true, data: JSON.parse(file.content), sha: file.sha });
  } catch (err) {
    if (err instanceof GitHubAuthError) {
      return json({ ok: false, error: "github_auth" }, 502);
    }
    return json({ ok: false, error: "github_error" }, 502);
  }
};

export const onRequestPut: PagesFunction<AdminEnv, "key"> = async ({ request, env, params }) => {
  if (!(await checkAdminAuth(request, env))) return unauthorized();

  const key = params.key;
  if (typeof key !== "string" || !isContentKey(key)) {
    return json({ ok: false, error: "unknown_key" }, 404);
  }

  if (request.headers.get("Content-Type") !== "application/json") {
    return json({ ok: false, error: "invalid_content_type" }, 400);
  }

  let body: { data: unknown; sha: string | null; message?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const schema = CONTENT_SCHEMAS[key];
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) {
    return json({ ok: false, error: "validation", issues: parsed.error.issues }, 422);
  }

  const crossIssues = await crossReferenceIssues(env, key, parsed.data);
  if (crossIssues.length > 0) {
    return json({ ok: false, error: "cross_reference", issues: crossIssues }, 422);
  }

  try {
    const result = await putFile(
      env,
      CONTENT_PATHS[key],
      JSON.stringify(parsed.data, null, 2) + "\n",
      body.sha,
      body.message || `Update ${key} via admin`,
    );
    return json({ ok: true, sha: result.sha, commitUrl: result.commitUrl });
  } catch (err) {
    if (err instanceof GitHubConflictError) {
      return json({ ok: false, error: "conflict" }, 409);
    }
    if (err instanceof GitHubAuthError) {
      return json({ ok: false, error: "github_auth" }, 502);
    }
    return json({ ok: false, error: "github_error" }, 502);
  }
};
