/**
 * Utilities for handling page data fetching and processing
 */

import { detectRequestLocale } from "@/common/seo/locale";
import { extractAllowedParams, parsePageNumber, buildFiltersFromParams, PARAM_SETS } from "./search-params";
import { fetchListings, fetchPostsList } from "@/common/seo/fetchers";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

/**
 * Common page data fetching for listing pages
 */
export async function fetchListingPageData(
  searchParams: { [key: string]: string | string[] | undefined },
  websiteFocus: string,
  pageSize = 12
) {
  const locale = detectRequestLocale();
  let allowedParams: string[] = [...PARAM_SETS.LISTING];
  
  // Custom params for different focuses
  if (websiteFocus === WEBSITE_FOCUS.SELLING) {
    allowedParams = [...PARAM_SETS.LISTING_SALE];
  } else if (websiteFocus === WEBSITE_FOCUS.RENT) {
    allowedParams = ["location", "propertyType", "availableFrom", "furnishingStatus", "page"];
  }
  
  const qs = extractAllowedParams(searchParams, allowedParams);
  const page = parsePageNumber(qs);
  const filters = buildFiltersFromParams(qs, websiteFocus);
  
  const result = await fetchListings(filters as any, page, pageSize, locale);
  
  return {
    locale,
    qs,
    page,
    filters,
    result,
    initialData: result && result.meta ? {
      items: result.items,
      meta: {
        currentPage: result.meta.currentPage,
        lastPage: result.meta.lastPage,
        totalItems: result.meta.total,
      },
      page,
      pageSize,
    } : undefined,
  };
}

/**
 * Common page data fetching for blog pages
 */
export async function fetchBlogPageData(
  searchParams: { [key: string]: string | string[] | undefined },
  pageSize = 12
) {
  const locale = detectRequestLocale();
  const qs = extractAllowedParams(searchParams, [...PARAM_SETS.BLOG]);
  const page = parsePageNumber(qs);
  
  const filters = {
    search: qs.get('search') || undefined,
    category: qs.get('category') || undefined,
  };
  
  const result = await fetchPostsList(page, pageSize, locale, filters);
  
  return {
    locale,
    qs,
    page,
    filters,
    result,
    initialData: result && result.meta ? {
      items: result.items,
      meta: {
        currentPage: result.meta.currentPage,
        lastPage: result.meta.lastPage,
        totalItems: result.meta.total,
      },
      page,
      pageSize,
    } : undefined,
  };
}
