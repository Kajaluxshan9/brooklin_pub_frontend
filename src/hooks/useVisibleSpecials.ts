import { useMemo } from "react";
import { useApiWithCache } from "./useApi";
import { specialsService } from "../services/specials.service";
import type { Special } from "../types/api.types";
import { SPECIAL_TYPES } from "../config/constants";

/**
 * Check if a special is currently visible based on display dates and active status
 */
export const isSpecialVisible = (special: Special): boolean => {
  if (!special.isActive) return false;

  const now = new Date();

  // For specials with display date range (game_time, seasonal, chef)
  if (special.displayStartDate && special.displayEndDate) {
    const startDate = new Date(special.displayStartDate);
    const endDate = new Date(special.displayEndDate);
    return now >= startDate && now <= endDate;
  }

  // For daily specials, always visible if active
  if (special.type === SPECIAL_TYPES.DAILY) {
    return true;
  }

  // If no display dates but active, show it
  return true;
};

/**
 * Check if a special is a "daily" type (includes daily, day_time, and late_night)
 */
export const isDailySpecial = (special: Special): boolean => {
  return (
    special.type === SPECIAL_TYPES.DAILY ||
    special.type === SPECIAL_TYPES.DAY_TIME ||
    special.specialCategory === SPECIAL_TYPES.LATE_NIGHT
  );
};

/**
 * Check if a special is an "other" type (game_time, chef, seasonal, etc.)
 */
export const isOtherSpecial = (special: Special): boolean => {
  return !isDailySpecial(special);
};

export interface VisibleSpecialsResult {
  /** All visible specials (within display date range and active) */
  visibleSpecials: Special[];
  /** Daily specials (daily, day_time, late_night) */
  dailySpecials: Special[];
  /** Other specials (game_time, chef, seasonal, etc.) */
  otherSpecials: Special[];
  /** Whether there are any daily specials */
  hasDailySpecials: boolean;
  /** Whether there are any other specials */
  hasOtherSpecials: boolean;
  /** Navigation categories for the specials dropdown */
  specialCategories: { label: string; path: string; id: string }[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch function */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and filtering visible specials
 * Encapsulates the specials visibility logic for reuse across components
 */
export function useVisibleSpecials(): VisibleSpecialsResult {
  const {
    data: specialsData,
    loading,
    error,
    refetch,
  } = useApiWithCache<Special[]>("active-specials", () =>
    specialsService.getActiveSpecials()
  );

  // Filter specials that are currently visible
  const visibleSpecials = useMemo(() => {
    if (!specialsData) return [];
    return specialsData.filter(isSpecialVisible);
  }, [specialsData]);

  // Separate into daily and other specials
  const dailySpecials = useMemo(
    () => visibleSpecials.filter(isDailySpecial),
    [visibleSpecials]
  );

  const otherSpecials = useMemo(
    () => visibleSpecials.filter(isOtherSpecial),
    [visibleSpecials]
  );

  const hasDailySpecials = dailySpecials.length > 0;
  const hasOtherSpecials = otherSpecials.length > 0;

  // Build navigation categories
  const specialCategories = useMemo(() => {
    const categories: { label: string; path: string; id: string }[] = [];

    if (hasDailySpecials) {
      categories.push({
        label: "Daily Specials",
        path: "/special/daily",
        id: "daily",
      });
    }

    if (hasOtherSpecials) {
      categories.push({
        label: "Other Specials",
        path: "/special/other",
        id: "other",
      });
    }

    return categories;
  }, [hasDailySpecials, hasOtherSpecials]);

  return {
    visibleSpecials,
    dailySpecials,
    otherSpecials,
    hasDailySpecials,
    hasOtherSpecials,
    specialCategories,
    loading,
    error,
    refetch,
  };
}

export default useVisibleSpecials;
