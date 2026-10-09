import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Writes dist/sitemap.xml after every build, including one URL per active menu
 * category (readable slugs, same as the site's nav). If the API is unreachable
 * the sitemap is still written with the static pages, so a build never fails.
 */

const SITE = "https://brooklinpub.com";

const STATIC_PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/menu", changefreq: "weekly", priority: "0.9" },
  { path: "/special/daily", changefreq: "daily", priority: "0.8" },
  { path: "/special/other", changefreq: "weekly", priority: "0.6" },
  { path: "/events", changefreq: "daily", priority: "0.8" },
  { path: "/gift-cards", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contactus", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.2" },
  { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.2" },
];

// Keep in sync with src/lib/categorySlug.ts
function slugify(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

interface Category {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

async function fetchCategorySlugs(apiBase: string | undefined): Promise<string[]> {
  if (!apiBase) return [];
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, "")}/menu/primary-categories`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const cats = ((await res.json()) as Category[])
      .filter((c) => c && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
    const used = new Map<string, number>();
    return cats.map((c) => {
      const base = slugify(c.name);
      const n = (used.get(base) || 0) + 1;
      used.set(base, n);
      return n === 1 ? base : `${base}-${n}`;
    });
  } catch {
    return [];
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sitemapPlugin(apiBase: string | undefined): Plugin {
  let outDir = "dist";
  return {
    name: "brooklin-sitemap",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const slugs = await fetchCategorySlugs(apiBase);
      const today = new Date().toISOString().slice(0, 10);
      const urls = [
        ...STATIC_PAGES,
        ...slugs.map((s) => ({ path: `/menu?category=${encodeURIComponent(s)}`, changefreq: "weekly", priority: "0.7" })),
      ];
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${esc(SITE + u.path)}</loc>\n    <lastmod>${today}</lastmod>\n` +
              `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
          )
          .join("\n") +
        `\n</urlset>\n`;
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
      console.log(`sitemap.xml: ${urls.length} URLs (${slugs.length} menu categories)`);
    },
  };
}
