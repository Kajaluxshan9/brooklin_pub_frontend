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
// Pre-populate with initial specials so they show on page load
const specials: Special[] = [
  { id: 'special-0', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-1', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-2', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-3', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-4', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-5', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-6', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-7', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'special-8', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'daily' },
  { id: 'chef-0', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-1', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-2', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-3', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-4', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-5', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-6', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-7', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-8', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
  { id: 'chef-9', title: 'Appetizers', desc: 'Start your meal with crispy seafood bites.', status: 'new', category: 'chef' },
];

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

export default {
  getLatestSpecial,
  hasNewSpecial,
  getNewSpecialsCount,
  getNewSpecialsByCategory,
  getNewSpecialsCountByCategory,
  getLatestSpecialByCategory,
  addSpecial,
};
