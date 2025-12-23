/**
 * Utilities for handling search parameters consistently across pages
 */

/**
 * Extract allowlisted parameters from searchParams
 */
export function extractAllowedParams(
  searchParams: { [key: string]: string | string[] | undefined },
  allowedKeys: string[]
): URLSearchParams {
  const qs = new URLSearchParams();
  for (const key of allowedKeys) {
    const value = searchParams[key];
    if (typeof value === 'string') {
      qs.set(key, value);
    }
  }
  return qs;
}

/**
 * Common parameter sets for different page types
 */
export const PARAM_SETS = {
  LISTING: ["location", "propertyType", "checkIn", "checkOut", "page"],
  LISTING_SALE: ["location", "propertyType", "priceMin", "priceMax", "page"],
  BLOG: ["search", "category", "page"],
} as const;

/**
 * Parse page number from search params with default
 */
export function parsePageNumber(qs: URLSearchParams, defaultPage = 1): number {
  return parseInt(qs.get('page') || String(defaultPage), 10);
}

/**
 * Build filters object from URLSearchParams
 */
export function buildFiltersFromParams(
  qs: URLSearchParams,
  websiteFocus: string,
  extraFilters: Record<string, string | undefined> = {}
) {
  return {
    location: qs.get('location') || undefined,
    propertyType: qs.get('propertyType') || undefined,
    checkIn: qs.get('checkIn') || undefined,
    checkOut: qs.get('checkOut') || undefined,
    priceMin: qs.get('priceMin') || undefined,
    priceMax: qs.get('priceMax') || undefined,
    websiteFocus,
    ...extraFilters,
  };
}
