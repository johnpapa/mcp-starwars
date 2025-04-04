import axios from "axios";

const BASE_URL = "https://swapi.dev/api";

/**
 * Fetches data from the SWAPI API
 * @param endpoint - API endpoint path
 * @param params - Optional query parameters
 * @returns The API response data
 */
export async function fetchFromSwapi<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const response = await axios.get<T>(url, { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`Resource not found: ${endpoint}`);
      }
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  }
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
 * Gets all pages of results for paginated endpoints
 * @param endpoint - The API endpoint
 * @param params - Optional query parameters
 * @returns All results combined from all pages
 */
export async function getAllPages<T>(endpoint: string, params?: Record<string, string | number>): Promise<T[]> {
  let allResults: T[] = [];
  let nextUrl: string | null = `${BASE_URL}${endpoint}`;

  while (nextUrl) {
    // If it's not the first request, fetch using the full nextUrl
    const isFirstRequest: boolean = nextUrl.startsWith(BASE_URL);

    // Determine the URL to fetch based on whether it's the first request
    const fetchUrl: string = isFirstRequest ? nextUrl.substring(BASE_URL.length) : nextUrl;

    // Only use params for the first request
    const fetchParams: Record<string, string | number> | undefined = isFirstRequest ? params : undefined;

    // Fetch the response with appropriate typing
    type PaginatedResponse = {
      next: string | null;
      results: T[];
    };

    const response: PaginatedResponse = await fetchFromSwapi<PaginatedResponse>(fetchUrl, fetchParams);

    allResults = [...allResults, ...response.results];
    nextUrl = response.next;
  }

  return allResults;
}
