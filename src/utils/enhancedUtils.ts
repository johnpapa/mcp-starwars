// Enhanced utility functions with caching and pagination for SWAPI
import axios from "axios";
import NodeCache from "node-cache";

const BASE_URL = "https://swapi.dev/api";

// Configure cache with a 30-minute TTL and periodic cleanup
const apiCache = new NodeCache({
  stdTTL: 1800, // 30 minutes cache lifetime
  checkperiod: 600, // Check for expired items every 10 minutes
  useClones: false, // Store references to improve memory usage
  maxKeys: 500 // Limit total cache entries to prevent memory leaks
});

// Cache statistics for monitoring performance
const cacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0
};

/**
 * Creates a deterministic cache key from endpoint and parameters
 */
function createCacheKey(endpoint: string, params?: Record<string, string | number>): string {
  // Normalize the endpoint to handle both relative and absolute URLs
  const normalizedEndpoint = endpoint.startsWith('http') 
    ? endpoint.replace(BASE_URL, '') 
    : endpoint;
  
  // Create a stable cache key by sorting parameters alphabetically
  const paramString = params 
    ? Object.entries(params)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('&')
    : '';
  
  return `${normalizedEndpoint}|${paramString}`;
}

/**
 * Enhanced fetch function with caching for SWAPI
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @param skipCache - Whether to bypass the cache
 * @returns The API response data
 */
export async function fetchWithCache<T>(
  endpoint: string, 
  params?: Record<string, string | number>,
  skipCache: boolean = false
): Promise<T> {
  const cacheKey = createCacheKey(endpoint, params);
  cacheStats.totalRequests++;
  
  // Try cache first if not explicitly skipping
  if (!skipCache) {
    const cachedData = apiCache.get<T>(cacheKey);
    if (cachedData) {
      cacheStats.hits++;
      console.log(`[Cache Hit] ${endpoint} (Hit Rate: ${(cacheStats.hits/cacheStats.totalRequests*100).toFixed(1)}%)`);
      return cachedData;
    }
  }
  
  cacheStats.misses++;
  console.log(`[Cache Miss] Fetching ${endpoint} from API`);
  
  // Determine the full URL
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  try {
    const startTime = Date.now();
    const response = await axios.get<T>(url, { params });
    const duration = Date.now() - startTime;
    
    console.log(`[API] ${endpoint} fetched in ${duration}ms`);
    
    // Store in cache unless explicitly skipped
    if (!skipCache) {
      apiCache.set(cacheKey, response.data);
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.error(`[Error] Resource not found: ${endpoint}`);
        throw new Error(`Resource not found: ${endpoint}`);
      }
      if (error.response?.status === 429) {
        console.error(`[Rate Limited] API rate limit exceeded for ${endpoint}, retrying in 2s...`);
        // Wait 2 seconds and retry on rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        return fetchWithCache<T>(endpoint, params, skipCache);
      }
      console.error(`[API Error] ${error.message} for ${endpoint}`);
      throw new Error(`API Error: ${error.message}`);
    }
    console.error(`[Unexpected Error] ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Fetches all pages of paginated results while preserving the response structure
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @returns A response with all results from all pages combined
 */
export async function fetchAllPages<T extends { results: Array<any>, count: number }>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  // Create a unique cache key for the aggregated results
  const cacheKey = `all_pages:${createCacheKey(endpoint, params)}`;
  
  // Check if we have a complete cached result
  const cachedFullResult = apiCache.get<T>(cacheKey);
  if (cachedFullResult) {
    console.log(`[Cache Hit] Complete paginated data for ${endpoint}`);
    return cachedFullResult;
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
  const allResults = [
    ...firstPage.results,
    ...additionalPages.flatMap(page => page.results)
  ];
  
  // Create a complete result with the same structure as the original
  const result = {
    ...firstPage,
    results: allResults,
    next: null,
    previous: null
  };
  
  const duration = Date.now() - startTime;
  console.log(`[Pagination] Completed fetching all ${allResults.length} items in ${duration}ms`);
  
  // Cache the complete result
  apiCache.set(cacheKey, result, 3600); // Cache complete sets for longer (1 hour)
  
  return result as T;
}

/**
 * Extracts an ID from a SWAPI URL
 * @param url - The full SWAPI URL
 * @returns The extracted ID
 */
export function extractIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { hits: number; misses: number; hitRate: string; size: number; } {
  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: `${(cacheStats.hits/Math.max(1, cacheStats.totalRequests)*100).toFixed(1)}%`,
    size: apiCache.keys().length
  };
}

/**
 * Clears the cache partially or completely
 * @param endpoint - Specific endpoint to clear (optional)
 */
export function clearCache(endpoint?: string): void {
  if (endpoint) {
    // Clear only entries related to this endpoint
    const keysToDelete = apiCache.keys().filter(key => key.includes(endpoint));
    keysToDelete.forEach(key => apiCache.del(key));
    console.log(`[Cache] Cleared ${keysToDelete.length} entries for ${endpoint}`);
  } else {
    // Clear all entries
    const count = apiCache.keys().length;
    apiCache.flushAll();
    console.log(`[Cache] Cleared all ${count} cached entries`);
  }
}
