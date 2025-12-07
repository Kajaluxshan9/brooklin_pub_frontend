/**
 * Custom Hooks Barrel Export
 * Provides a single import point for all custom hooks
 */

// API and data fetching hooks
export {
  useApi,
  useApiWithCache,
  getCachedData,
  setCachedData,
  clearCache,
  invalidateCache,
  isCacheStale,
  type UseApiState,
  type UseApiOptions,
} from "./useApi";

// Specials visibility hook
export {
  useVisibleSpecials,
  isSpecialVisible,
  isDailySpecial,
  isOtherSpecial,
  type VisibleSpecialsResult,
} from "./useVisibleSpecials";
