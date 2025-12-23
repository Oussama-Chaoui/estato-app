/**
 * Utilities for generating JSON-LD for pages
 */

import { buildListingItemListJsonLd, buildBreadcrumbJsonLd } from "@/common/seo/jsonld/builders";
import { getServerTranslation, getBreadcrumbNameKey } from "@/common/seo/jsonld/server-translations";
import { normalizeLocale } from "@/common/seo/locale";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import AppRoutes from "@/common/defs/routes";

/**
 * Generate listing page JSON-LD (ItemList + Breadcrumbs)
 */
export function generateListingJsonLd(
  items: any[],
  websiteFocus: WEBSITE_FOCUS,
  page: number,
  locale: string
) {
  const itemListJsonLd = buildListingItemListJsonLd(items, websiteFocus);
  const normalizedLocale = normalizeLocale(locale);
  const { t } = getServerTranslation(normalizedLocale);
  
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumbs.home'), url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/` },
    { 
      name: t(getBreadcrumbNameKey(websiteFocus)), 
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${getListingRoute(websiteFocus)}` 
    },
  ]);

  return {
    itemListJsonLd,
    breadcrumbJsonLd,
    itemListId: `ld-itemlist-${getFocusKey(websiteFocus)}-${page}`,
    breadcrumbId: `ld-breadcrumb-${getFocusKey(websiteFocus)}-${page}`,
  };
}

/**
 * Generate blog page JSON-LD (Breadcrumbs)
 */
export function generateBlogJsonLd(locale: string) {
  const normalizedLocale = normalizeLocale(locale);
  const { t } = getServerTranslation(normalizedLocale);
  
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t('breadcrumbs.home'), url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/` },
    { name: t('breadcrumbs.blog'), url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${AppRoutes.Posts.ReadAll}` },
  ]);

  return {
    breadcrumbJsonLd,
    breadcrumbId: 'ld-breadcrumb-blog',
  };
}

/**
 * Get the route for a website focus
 */
function getListingRoute(websiteFocus: WEBSITE_FOCUS): string {
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      return AppRoutes.Properties.DailyRent.ReadAll;
    case WEBSITE_FOCUS.RENT:
      return AppRoutes.Properties.MonthlyRent.ReadAll;
    case WEBSITE_FOCUS.SELLING:
      return AppRoutes.Properties.HomeSale.ReadAll;
    default:
      return AppRoutes.Properties.HomeSale.ReadAll;
  }
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
