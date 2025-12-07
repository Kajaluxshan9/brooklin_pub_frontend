/**
 * Custom hooks for data fetching with loading, error states, and smart caching
 * Features:
 * - Automatic caching with configurable duration
 * - Background revalidation on window focus
 * - Stale-while-revalidate pattern
 * - Request deduplication
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { API_CONFIG } from "../config/constants";

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isValidating: boolean;
  refetch: () => Promise<void>;
}

export interface UseApiOptions {
  /** Whether to revalidate on window focus (default: true) */
  revalidateOnFocus?: boolean;
  /** Whether to revalidate on reconnect (default: true) */
  revalidateOnReconnect?: boolean;
  /** Custom cache duration in milliseconds */
  cacheDuration?: number;
  /** Custom stale time in milliseconds */
  staleTime?: number;
}

/**
 * Basic API fetching hook without caching
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // isValidating is always false for the basic useApi hook (no background revalidation)
  const isValidating = false;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, isValidating, refetch: fetchData };
}

// =============================================================================
// CACHE MANAGEMENT
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  isStale: boolean;
}

const cache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Get cached data if available and not expired
 */
export function getCachedData<T>(
  key: string,
  cacheDuration: number = API_CONFIG.CACHE_DURATION
): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return cached.data as T;
  }
  return null;
}

/**
 * Check if cached data is stale (past stale time but not expired)
 */
export function isCacheStale(
  key: string,
  staleTime: number = API_CONFIG.STALE_TIME
): boolean {
  const cached = cache.get(key);
  if (!cached) return true;
  return Date.now() - cached.timestamp > staleTime;
}

/**
 * Set data in cache
 */
export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now(), isStale: false });
}

/**
 * Clear cache - either a specific key or all cache
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Invalidate cache (mark as stale without removing)
 */
export function invalidateCache(key: string): void {
  const cached = cache.get(key);
  if (cached) {
    cached.isStale = true;
  }
}

// =============================================================================
// ENHANCED HOOK WITH CACHING
// =============================================================================

/**
 * Enhanced API hook with caching, revalidation, and request deduplication
 */
export function useApiWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = [],
  options: UseApiOptions = {}
): UseApiState<T> {
  const {
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    cacheDuration = API_CONFIG.CACHE_DURATION,
    staleTime = API_CONFIG.STALE_TIME,
  } = options;

  const [data, setData] = useState<T | null>(() => getCachedData<T>(key, cacheDuration));
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const mountedRef = useRef(true);

  /**
   * Fetch data with request deduplication
   */
  const fetchData = useCallback(
    async (isBackground = false) => {
      // Check for pending request to dedupe
      const pending = pendingRequests.get(key);
      if (pending) {
        try {
          const result = (await pending) as T;
          if (mountedRef.current) {
            setData(result);
            setLoading(false);
            setIsValidating(false);
          }
          return;
        } catch {
          // Let it continue to make a new request
        }
      }

      try {
        if (isBackground) {
          setIsValidating(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Create and store the promise
        const promise = fetchFn();
        pendingRequests.set(key, promise);

        const result = await promise;

        if (mountedRef.current) {
          setData(result);
          setCachedData(key, result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : "An error occurred");
          console.error("API Error:", err);
        }
      } finally {
        pendingRequests.delete(key);
        if (mountedRef.current) {
          setLoading(false);
          setIsValidating(false);
        }
      }
    },
    [key, fetchFn]
  );

  /**
   * Revalidate if data is stale
   */
  const revalidateIfStale = useCallback(() => {
    if (isCacheStale(key, staleTime)) {
      fetchData(true);
    }
  }, [key, staleTime, fetchData]);

  // Initial fetch or use cache
  useEffect(() => {
    const cached = getCachedData<T>(key, cacheDuration);
    if (cached) {
      setData(cached);
      setLoading(false);
      // Background revalidate if stale
      if (isCacheStale(key, staleTime)) {
        fetchData(true);
      }
    } else {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...dependencies]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      revalidateIfStale();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [revalidateOnFocus, revalidateIfStale]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      revalidateIfStale();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [revalidateOnReconnect, revalidateIfStale]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    isValidating,
    refetch: () => fetchData(false),
  };
}
