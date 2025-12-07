/**
 * Application Constants
 * Centralized configuration for external URLs, API settings, and app-wide constants
 */

// =============================================================================
// EXTERNAL URLS
// =============================================================================

export const EXTERNAL_URLS = {
  /** EastServe online ordering platform URL */
  ORDER_ONLINE:
    "https://www.eastserve.ca/ordering/restaurant/menu?company_uid=f0d6a7d8-6663-43c6-af55-0d11a9773920&restaurant_uid=29e4ef84-c523-4a58-9e4b-6546d6637312&facebook=true",

  /** Social media links */
  SOCIAL: {
    FACEBOOK: "https://www.facebook.com/brooklinpubandgrill",
    INSTAGRAM: "https://www.instagram.com/brooklinpub",
    TWITTER: "https://twitter.com/brooklinpub",
  },

  /** Google Maps embed/directions */
  GOOGLE_MAPS: "https://maps.google.com/?q=Brooklin+Pub+and+Grill",
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  /** Cache duration in milliseconds (5 minutes) */
  CACHE_DURATION: 5 * 60 * 1000,

  /** Stale time before background revalidation (2 minutes) */
  STALE_TIME: 2 * 60 * 1000,

  /** Request timeout in milliseconds */
  REQUEST_TIMEOUT: 30000,

  /** Number of retry attempts for failed requests */
  RETRY_ATTEMPTS: 3,

  /** Delay between retries in milliseconds */
  RETRY_DELAY: 1000,
} as const;

// =============================================================================
// UI CONFIGURATION
// =============================================================================

export const UI_CONFIG = {
  /** Animation durations in milliseconds */
  ANIMATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 400,
  },

  /** Dropdown hover delay before closing */
  DROPDOWN_CLOSE_DELAY: 200,

  /** Debounce delay for search inputs */
  SEARCH_DEBOUNCE: 300,

  /** Number of items per page for pagination */
  ITEMS_PER_PAGE: 12,
} as const;

// =============================================================================
// NAVIGATION LABELS
// =============================================================================

export const NAV_LABELS = {
  HOME: "Home",
  ABOUT: "About Us",
  EVENTS: "Events",
  MENU: "Menu",
  SPECIAL: "Special",
  CONTACT: "Contact Us",
  DAILY_SPECIALS: "Daily Specials",
  OTHER_SPECIALS: "Other Specials",
} as const;

// =============================================================================
// SPECIAL TYPES
// =============================================================================

export const SPECIAL_TYPES = {
  DAILY: "daily",
  DAY_TIME: "day_time",
  LATE_NIGHT: "late_night",
  GAME_TIME: "game_time",
  CHEF: "chef",
  SEASONAL: "seasonal",
} as const;

export type SpecialType = (typeof SPECIAL_TYPES)[keyof typeof SPECIAL_TYPES];
