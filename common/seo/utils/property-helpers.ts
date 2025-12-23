/**
 * Utilities for property-specific page data and JSON-LD
 */

import { detectRequestLocale } from "@/common/seo/locale";
import { fetchProperty } from "@/common/seo/fetchers";
import { buildPropertyJsonLd, buildBreadcrumbJsonLd } from "@/common/seo/jsonld/builders";
import { buildPropertyBreadcrumbs } from "@/common/seo/jsonld/helpers";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

/**
 * Fetch property data for a page
 */
export async function fetchPropertyPageData(id: string) {
  const locale = detectRequestLocale();
  const property = await fetchProperty(id, locale);
  
  return {
    locale,
    property,
  };
}

/**
 * Generate property JSON-LD
 */
export function generatePropertyJsonLd(
  property: any,
  id: string,
  websiteFocus: WEBSITE_FOCUS,
  locale: 'en' | 'fr' | 'es' | 'ar'
) {
  const propertyJsonLd = property ? buildPropertyJsonLd(property, locale, websiteFocus) : null;
  
  const breadcrumbItems = buildPropertyBreadcrumbs(
    websiteFocus,
    id,
    property?.title || '',
    locale
  );
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  const focusKey = getFocusKey(websiteFocus);

  return {
    propertyJsonLd,
    breadcrumbJsonLd,
    propertyId: `ld-property-${focusKey}-${id}`,
    breadcrumbId: `ld-breadcrumb-${focusKey}-${id}`,
  };
}

/**
 * Get a clean key for website focus
 */
function getFocusKey(websiteFocus: WEBSITE_FOCUS): string {
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      return 'daily';
    case WEBSITE_FOCUS.RENT:
      return 'monthly';
    case WEBSITE_FOCUS.SELLING:
      return 'sale';
    default:
      return 'sale';
  }
}
