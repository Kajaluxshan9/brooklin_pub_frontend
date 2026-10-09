import type { PrimaryCategory } from "../types/api.types";

/**
 * Public URLs use readable category slugs (/menu?category=food) instead of
 * database IDs. Old links that still carry an ID keep working.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_RE.test(value);

export function slugify(name: string): string {
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

/** id → slug, unique per list (duplicates get -2, -3… in sort order). */
export function buildCategorySlugs(categories: PrimaryCategory[] | null | undefined): Map<string, string> {
  const map = new Map<string, string>();
  const used = new Map<string, number>();
  [...(categories || [])]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .forEach((pc) => {
      const base = slugify(pc.name);
      const n = (used.get(base) || 0) + 1;
      used.set(base, n);
      map.set(pc.id, n === 1 ? base : `${base}-${n}`);
    });
  return map;
}

/** Turns a ?category= value (slug or legacy id) into the category id, or null. */
export function resolveCategoryId(
  value: string | null | undefined,
  categories: PrimaryCategory[] | null | undefined,
): string | null {
  if (!value || value === "all" || !categories) return null;
  if (isUuid(value)) return categories.some((c) => c.id === value) ? value : null;
  for (const [id, slug] of buildCategorySlugs(categories)) {
    if (slug === value.toLowerCase()) return id;
  }
  return null;
}
