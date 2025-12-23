import { getBaseUrl, SupportedLocale } from '@/common/seo/config';
import Routes from '@/common/defs/routes';
import { BreadcrumbItem } from './builders';
import { getServerTranslation, getBreadcrumbNameKey } from './server-translations';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';

// Helper function to build property breadcrumbs with server-side translations
export function buildPropertyBreadcrumbs(
  websiteFocus: WEBSITE_FOCUS,
  propertyId: string,
  propertyTitle: string,
  locale: SupportedLocale
): BreadcrumbItem[] {
  const baseUrl = getBaseUrl();
  const { t } = getServerTranslation(locale);

  let listingRoute: string;
  let detailRoute: string;

  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      listingRoute = Routes.Properties.DailyRent.ReadAll;
      detailRoute = Routes.Properties.DailyRent.ReadOne.replace('{id}', propertyId);
      break;
    case WEBSITE_FOCUS.RENT:
      listingRoute = Routes.Properties.MonthlyRent.ReadAll;
      detailRoute = Routes.Properties.MonthlyRent.ReadOne.replace('{id}', propertyId);
      break;
    case WEBSITE_FOCUS.SELLING:
      listingRoute = Routes.Properties.HomeSale.ReadAll;
      detailRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', propertyId);
      break;
    default:
      listingRoute = Routes.Properties.HomeSale.ReadAll;
      detailRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', propertyId);
  }

  return [
    {
      name: t('breadcrumbs.home'),
      url: `${baseUrl}${Routes.Common.Home}`,
    },
    {
      name: t(getBreadcrumbNameKey(websiteFocus)),
      url: `${baseUrl}${listingRoute}`,
    },
    {
      name: propertyTitle || t('breadcrumbs.property'),
      url: `${baseUrl}${detailRoute}`,
    },
  ];
}

// Helper function to build blog breadcrumbs with server-side translations
export function buildBlogBreadcrumbs(
  slug: string,
  postTitle: string,
  locale: SupportedLocale
): BreadcrumbItem[] {
  const baseUrl = getBaseUrl();
  const { t } = getServerTranslation(locale);

  return [
    {
      name: t('breadcrumbs.home'),
      url: `${baseUrl}${Routes.Common.Home}`,
    },
    {
      name: t('breadcrumbs.blog'),
      url: `${baseUrl}${Routes.Posts.ReadAll}`,
    },
    {
      name: postTitle || t('breadcrumbs.article'),
      url: `${baseUrl}${Routes.Posts.ReadOne.replace('{slug}', slug)}`,
    },
  ];
}
