// Generic caching utilities that can be used with any API
import axios, { AxiosError } from "axios";
import NodeCache from "node-cache";

/**
 * Configuration options for creating a cache instance
 */
export interface CacheOptions {
  /** TTL in seconds for standard cache items */
  stdTTL?: number;
  /** How often to check for expired items (seconds) */
  checkPeriod?: number;
  /** Whether to clone objects on get/set operations */
  useClones?: boolean;
  /** Maximum number of keys in cache */
  maxKeys?: number;
}

/**
 * Cache statistics for monitoring performance
 */
export interface CacheStats {
  /** Number of cache hits */
  hits: number;
  /** Number of cache misses */
  misses: number;
  /** Total requests processed */
  totalRequests: number;
  /** Hit rate as percentage string */
  hitRate: string;
  /** Number of keys in cache */
  size: number;
}

/**
 * A generic caching service for API responses
 */
export class ApiCacheService {
  private cache: NodeCache;
  private baseUrl: string;
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
  };

  /**
   * A map of custom TTL values for specific endpoints
   * @private
   */
  private customTtls: Map<string, number> = new Map();

  /**
   * Creates a new instance of the API cache service
   * @param baseUrl - Base URL for the API
   * @param options - Cache configuration options
   */
  constructor(baseUrl: string, options: CacheOptions = {}) {
    this.baseUrl = baseUrl;
    this.cache = new NodeCache({
      stdTTL: options.stdTTL ?? 1800, // Default: 30 minutes
      checkperiod: options.checkPeriod ?? 600, // Default: 10 minutes
      useClones: options.useClones ?? false, // Default: don't clone for memory efficiency
      maxKeys: options.maxKeys ?? 500, // Default: limit to 500 entries
    });
  }

  /**
   * Creates a deterministic cache key from endpoint and parameters
   * @param endpoint - API endpoint path
   * @param params - Optional query parameters
   * @returns A unique cache key
   */
  createCacheKey(endpoint: string, params?: Record<string, string | number>): string {
    // Normalize the endpoint to handle both relative and absolute URLs
    const normalizedEndpoint = endpoint.startsWith("http") ? endpoint.replace(this.baseUrl, "") : endpoint;

    // Create a stable cache key by sorting parameters alphabetically
    const paramString = params
      ? Object.entries(params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join("&")
      : "";

    return `${normalizedEndpoint}|${paramString}`;
  }

  /**
   * Fetches data from an API with caching
   * @param endpoint - API endpoint path
   * @param params - Optional query parameters
   * @param skipCache - Whether to bypass the cache
   * @param retryOptions - Options for retry behavior on rate limiting
   * @returns The API response data
   */
  async fetchWithCache<T>(
    endpoint: string,
    params?: Record<string, string | number>,
    skipCache = false,
    retryOptions = { maxRetries: 3, delay: 2000 }
  ): Promise<T> {
    const cacheKey = this.createCacheKey(endpoint, params);
    this.stats.totalRequests++;

    // Try cache first if not explicitly skipping
    if (!skipCache) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) {
        this.stats.hits++;
        console.log(
          `[Cache Hit] ${endpoint} (Hit Rate: ${((this.stats.hits / this.stats.totalRequests) * 100).toFixed(1)}%)`
        );
        return cachedData;
      }
    }

    this.stats.misses++;
    console.log(`[Cache Miss] Fetching ${endpoint} from API`);

    // Determine the full URL
    const url = endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      const startTime = Date.now();
      const response = await axios.get<T>(url, { params });
      const duration = Date.now() - startTime;

      console.log(`[API] ${endpoint} fetched in ${duration}ms`);

      // Store in cache unless explicitly skipped
      if (!skipCache) {
        this.cache.set(cacheKey, response.data);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 404) {
          console.error(`[Error] Resource not found: ${endpoint}`);
          throw new Error(`Resource not found: ${endpoint}`);
        }

        if (axiosError.response?.status === 429) {
          console.error(
            `[Rate Limited] API rate limit exceeded for ${endpoint}, retrying in ${retryOptions.delay}ms...`
          );
          // Wait and retry on rate limiting
          await new Promise((resolve) => setTimeout(resolve, retryOptions.delay));
          return this.fetchWithCache<T>(endpoint, params, skipCache, {
            ...retryOptions,
            maxRetries: retryOptions.maxRetries - 1,
          });
        }

        console.error(`[API Error] ${axiosError.message} for ${endpoint}`);
        throw new Error(`API Error: ${axiosError.message}`);
      }

      console.error(`[Unexpected Error] ${error instanceof Error ? error.message : String(error)}`);
      throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Gets statistics about the cache usage
   */
  getCacheStats(): CacheStats {
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      totalRequests: this.stats.totalRequests,
      hitRate: `${((this.stats.hits / Math.max(1, this.stats.totalRequests)) * 100).toFixed(1)}%`,
      size: this.cache.keys().length,
    };
  }

  /**
   * Clears the cache partially or completely
   * @param pattern - Optional pattern to match keys to clear
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear only entries related to this pattern
      const keysToDelete = this.cache.keys().filter((key) => key.includes(pattern));
      keysToDelete.forEach((key) => this.cache.del(key));
      console.log(`[Cache] Cleared ${keysToDelete.length} entries matching pattern: ${pattern}`);
    } else {
      // Clear all entries
      const count = this.cache.keys().length;
      this.cache.flushAll();
      console.log(`[Cache] Cleared all ${count} cached entries`);
    }
  }

  /**
   * Utility function to extract an ID from the last segment of a URL
   * @param url - The full URL
   * @returns The extracted ID
   */
  extractIdFromUrl(url: string): string {
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }

  /**
   * Stores a value in the cache with a custom TTL
   * @param key - The cache key or endpoint
   * @param value - The value to store
   * @param ttl - Time to live in seconds
   */
  storeWithCustomTtl<T>(key: string, value: T, ttl: number = 0): void {
    const cacheKey = key.startsWith("http") ? this.createCacheKey(key) : key;
    this.cache.set(cacheKey, value, ttl);
    console.log(`[Cache] Stored "${key}" with TTL: ${ttl || "default"}s`);
  }
}
