export interface Special {
  id: string;
  title: string;
  desc: string;
  bg?: string;
  popupImg?: string;
  // Either use `status: 'new'` to mark a new special, or keep `active` for older code.
  status?: string;
  active?: boolean; // legacy flag
  category?: 'daily' | 'chef'; // category for tracking
}

// Example specials list — in a real app this could come from an API or CMS
// Start empty — specials are added when components mount and call addSpecial()
const specials: Special[] = [];

export function getLatestSpecial(): Special | null {
  if (specials.length === 0) return null;
  // Prefer the most recent special with status 'new'
  for (let i = specials.length - 1; i >= 0; i--) {
    if (specials[i].status === "new") return specials[i];
  }
  return specials[specials.length - 1] || null;
}

export function hasNewSpecial(): boolean {
  // Return true if any special currently has status === 'new'
  return specials.some((s) => s.status === "new");
}

export function getNewSpecialsCount(): number {
  // Count specials with status === 'new'
  return specials.filter((s) => s.status === "new").length;
}

export function getNewSpecialsByCategory(category: 'daily' | 'chef'): Special[] {
  // Get all new specials for a specific category
  return specials.filter((s) => s.status === "new" && s.category === category);
}

export function getNewSpecialsCountByCategory(category: 'daily' | 'chef'): number {
  // Count new specials for a specific category
  return specials.filter((s) => s.status === "new" && s.category === category).length;
}

export function getLatestSpecialByCategory(category: 'daily' | 'chef'): Special | null {
  // Get the most recent new special for a category
  const items = getNewSpecialsByCategory(category);
  return items.length > 0 ? items[items.length - 1] : null;
}


export function addSpecial(s: Special) {
  // dedupe by id — replace existing or push new
  const idx = specials.findIndex((x) => x.id === s.id);
  if (idx === -1) {
    specials.push(s);
  } else {
    specials[idx] = s;
  }

  // Notify listeners on the client that specials changed
  if (typeof window !== "undefined" && (window as any).dispatchEvent) {
    try {
      window.dispatchEvent(new CustomEvent("specials-updated"));
    } catch (err) {
      // ignore if dispatch fails
    }
  }
}

// Load initial specials by importing the existing special component modules
// which export their local `cards` arrays. This avoids creating any new files
// and ensures Home can show notifications immediately on first visit.
export async function loadInitialSpecials(): Promise<void> {
  try {
    let daily: any[] = [];
    let chef: any[] = [];

    // Try importing component modules that now export their `cards` arrays.
    try {
      const dailyComp = await import("../components/special/SpecialDisplay");
      daily = dailyComp.exportedDailySpecials || [];
    } catch (e) {
      daily = [];
    }

    try {
      const chefComp = await import("../components/special/ChefSpecialDisplay");
      chef = chefComp.exportedChefSpecials || [];
    } catch (e) {
      chef = [];
    }

    // Register items with the same id pattern used in the component registration
    daily.forEach((d: any, idx: number) => {
      addSpecial({
        id: d.id ?? `special-${idx}`,
        title: d.title,
        desc: d.desc,
        bg: d.bg,
        popupImg: d.popupImg,
        status: d.status ?? "new",
        category: "daily",
      });
    });

    chef.forEach((c: any, idx: number) => {
      addSpecial({
        id: c.id ?? `chef-${idx}`,
        title: c.title,
        desc: c.desc,
        bg: c.bg,
        popupImg: c.popupImg,
        status: c.status ?? "new",
        category: "chef",
      });
    });
  } catch (err) {
    // ignore loader errors — registration is optional
  }
}

export default {
  getLatestSpecial,
  hasNewSpecial,
  getNewSpecialsCount,
  getNewSpecialsByCategory,
  getNewSpecialsCountByCategory,
  getLatestSpecialByCategory,
  addSpecial,
};
