// Star Wars API specific utilities with caching and pagination support
import { ApiCacheService } from "./caching.js";

// SWAPI base URL
const SWAPI_BASE_URL = "https://swapi.dev/api";

// Create an instance of the cache service configured for the SWAPI
const swapiCache = new ApiCacheService(SWAPI_BASE_URL, {
  stdTTL: 1800, // 30 minutes cache lifetime
  checkPeriod: 600, // Check for expired items every 10 minutes
  useClones: false, // Store references to improve memory usage
  maxKeys: 500, // Limit total cache entries to prevent memory leaks
});

/**
 * Fetches data from the Star Wars API with caching
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @param skipCache - Whether to bypass the cache
 * @returns The API response data
 */
export async function fetchWithCache<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  skipCache = false
): Promise<T> {
  return swapiCache.fetchWithCache<T>(endpoint, params, skipCache);
}

/**
 * Fetches all pages of paginated results while preserving the response structure
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @returns A response with all results from all pages combined
 */
export async function fetchAllPages<T extends { results: Array<any>; count: number }>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  // Create a unique cache key for the aggregated results
  const allPagesEndpoint = `all_pages:${endpoint}`;

  // Try to get from cache using the public API instead of accessing private properties
  try {
    // Use the standard fetchWithCache with the special all_pages prefixed endpoint
    const cachedFullResult = await fetchWithCache<T>(allPagesEndpoint, params);
    if (cachedFullResult) {
      console.log(`[Cache Hit] Complete paginated data for ${endpoint}`);
      return cachedFullResult;
    }
  } catch (error) {
    // Cache miss will throw, which is expected, continue with fetching
  }

  console.log(`[Pagination] Fetching all pages for ${endpoint}`);
  const startTime = Date.now();

  // Get the first page to understand the structure and total count
  const firstPage = await fetchWithCache<T>(endpoint, params);

  // If there's only one page or no results, return as is
  if (!firstPage.results || firstPage.count <= firstPage.results.length) {
    return firstPage;
  }

  // Prepare to fetch all remaining pages in parallel
  const totalPages = Math.ceil(firstPage.count / firstPage.results.length);
  console.log(`[Pagination] Found ${totalPages} pages with ${firstPage.count} total items for ${endpoint}`);

  const pageRequests: Promise<T>[] = [];

  // Start fetching from page 2 (we already have page 1)
  for (let page = 2; page <= totalPages; page++) {
    const pageParams = { ...params, page };
    pageRequests.push(fetchWithCache<T>(endpoint, pageParams));
  }

  // Wait for all pages to be fetched
  const additionalPages = await Promise.all(pageRequests);

  // Combine all results
  const allResults = [...firstPage.results, ...additionalPages.flatMap((page) => page.results)];

  // Create a complete result with the same structure as the original
  const result = {
    ...firstPage,
    results: allResults,
    next: null,
    previous: null,
  };
  const duration = Date.now() - startTime;
  console.log(`[Pagination] Completed fetching all ${allResults.length} items in ${duration}ms`);

  // Add helper method in ApiCacheService to store with custom TTL
  // Store in cache using special endpoint to identify full result sets
  try {
    // Here we'll update the cacheUtils.ts to add a proper method for this
    storeInCache(`all_pages:${endpoint}`, result, params, 3600);
  } catch (error) {
    console.error(`[Cache] Failed to store paginated results: ${error}`);
  }

  return result as T;
}

/**
 * Extracts an ID from a SWAPI URL
 * @param url - The full SWAPI URL
 * @returns The extracted ID
 */
export function extractIdFromUrl(url: string): string {
  return swapiCache.extractIdFromUrl(url);
}

/**
 * Gets cache statistics for the SWAPI cache
 */
export function getCacheStats() {
  return swapiCache.getCacheStats();
}

/**
 * Clears the SWAPI cache partially or completely
 * @param endpoint - Specific endpoint to clear (optional)
 */
export function clearCache(endpoint?: string): void {
  swapiCache.clearCache(endpoint);
}

/**
 * Stores data in the cache with a custom TTL
 * @param endpoint - API endpoint path or cache key
 * @param data - The data to store in the cache
 * @param params - Optional query parameters
 * @param ttlSeconds - Custom TTL in seconds (overrides default)
 */
function storeInCache<T>(
  endpoint: string,
  data: T,
  params?: Record<string, string | number>,
  ttlSeconds?: number
): void {
  // Use the public storeWithCustomTtl method from the ApiCacheService
  swapiCache.storeWithCustomTtl(endpoint, data, ttlSeconds);
  console.log(`[Cache] Stored paginated results for ${endpoint} with TTL: ${ttlSeconds || "default"}s`);
}
