/**
 * Specials Utilities
 *
 * This module provides client-side utilities for managing special offers.
 * NOTE: Primary specials data comes from the API via useVisibleSpecials hook.
 * This module is for client-side state management and event dispatching.
 *
 * @deprecated Consider using useVisibleSpecials hook from hooks/useVisibleSpecials.ts
 * for reactive specials data from the backend.
 */

export interface Special {
  id: string;
  title: string;
  desc: string;
  bg?: string;
  popupImg?: string;
  status?: "new" | "active" | "expired";
  active?: boolean;
  category?: "daily" | "chef" | "other";
}

// Module-level storage for client-side specials
// NOTE: This is not reactive - components won't re-render when this changes
// Use the "specials-updated" event to listen for changes
const specials: Special[] = [];

// =============================================================================
// QUERY FUNCTIONS
// =============================================================================

/**
 * Get the most recent special, preferring those with status 'new'
 */
export function getLatestSpecial(): Special | null {
  if (specials.length === 0) return null;

  // Prefer the most recent special with status 'new'
  for (let i = specials.length - 1; i >= 0; i--) {
    if (specials[i].status === "new") return specials[i];
  }

  return specials[specials.length - 1] || null;
}

/**
 * Check if any special has status 'new'
 */
export function hasNewSpecial(): boolean {
  return specials.some((s) => s.status === "new");
}

/**
 * Count specials with status 'new'
 */
export function getNewSpecialsCount(): number {
  return specials.filter((s) => s.status === "new").length;
}

/**
 * Get all new specials for a specific category
 */
export function getNewSpecialsByCategory(
  category: "daily" | "chef" | "other"
): Special[] {
  return specials.filter((s) => s.status === "new" && s.category === category);
}

/**
 * Count new specials for a specific category
 */
export function getNewSpecialsCountByCategory(
  category: "daily" | "chef" | "other"
): number {
  return getNewSpecialsByCategory(category).length;
}

/**
 * Get the most recent new special for a category
 */
export function getLatestSpecialByCategory(
  category: "daily" | "chef" | "other"
): Special | null {
  const items = getNewSpecialsByCategory(category);
  return items.length > 0 ? items[items.length - 1] : null;
}

// =============================================================================
// MUTATION FUNCTIONS
// =============================================================================

/**
 * Add or update a special in the client-side store
 * Dispatches a 'specials-updated' event for listeners
 */
export function addSpecial(special: Special): void {
  const idx = specials.findIndex((x) => x.id === special.id);

  if (idx === -1) {
    specials.push(special);
  } else {
    specials[idx] = special;
  }

  // Notify listeners that specials changed
  dispatchSpecialsEvent();
}

/**
 * Remove a special by ID
 */
export function removeSpecial(id: string): boolean {
  const idx = specials.findIndex((x) => x.id === id);
  if (idx !== -1) {
    specials.splice(idx, 1);
    dispatchSpecialsEvent();
    return true;
  }
  return false;
}

/**
 * Clear all specials
 */
export function clearSpecials(): void {
  specials.length = 0;
  dispatchSpecialsEvent();
}

/**
 * Mark a special as viewed (change status from 'new' to 'active')
 */
export function markSpecialAsViewed(id: string): void {
  const special = specials.find((s) => s.id === id);
  if (special && special.status === "new") {
    special.status = "active";
    dispatchSpecialsEvent();
  }
}

// =============================================================================
// EVENT DISPATCHING
// =============================================================================

/**
 * Dispatch a custom event to notify listeners of specials changes
 */
function dispatchSpecialsEvent(): void {
  if (typeof window !== "undefined" && window.dispatchEvent) {
    try {
      window.dispatchEvent(
        new CustomEvent("specials-updated", {
          detail: { count: specials.length },
        })
      );
    } catch {
      // Ignore if dispatch fails (SSR or restricted environment)
    }
  }
}

/**
 * Subscribe to specials updates
 * @param callback - Function to call when specials are updated
 * @returns Cleanup function to remove the listener
 */
export function onSpecialsUpdate(
  callback: (event: CustomEvent) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = callback as EventListener;
  window.addEventListener("specials-updated", handler);

  return () => {
    window.removeEventListener("specials-updated", handler);
  };
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  getLatestSpecial,
  hasNewSpecial,
  getNewSpecialsCount,
  getNewSpecialsByCategory,
  getNewSpecialsCountByCategory,
  getLatestSpecialByCategory,
  addSpecial,
  removeSpecial,
  clearSpecials,
  markSpecialAsViewed,
  onSpecialsUpdate,
};
