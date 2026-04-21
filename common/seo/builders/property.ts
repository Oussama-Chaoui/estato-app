import { getBaseUrl, SITE_NAME, type SupportedLocale } from '@/common/seo/config';
import { metaClamp } from '@/common/seo/format';
import Routes from '@/common/defs/routes';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';
import { getLocalizedValue, stripHtml } from '@/common/utils/localized-text';

const FOCUS_SUFFIX: Record<SupportedLocale, Record<WEBSITE_FOCUS, string>> = {
  en: {
    [WEBSITE_FOCUS.SELLING]: 'For Sale',
    [WEBSITE_FOCUS.RENT]: 'For Rent',
    [WEBSITE_FOCUS.DAILY_RENT]: 'Daily Rent',
    [WEBSITE_FOCUS.ALL]: 'Properties',
  },
  fr: {
    [WEBSITE_FOCUS.SELLING]: 'A vendre',
    [WEBSITE_FOCUS.RENT]: 'A louer',
    [WEBSITE_FOCUS.DAILY_RENT]: 'Location journaliere',
    [WEBSITE_FOCUS.ALL]: 'Proprietes',
  },
  es: {
    [WEBSITE_FOCUS.SELLING]: 'En venta',
    [WEBSITE_FOCUS.RENT]: 'En alquiler',
    [WEBSITE_FOCUS.DAILY_RENT]: 'Alquiler diario',
    [WEBSITE_FOCUS.ALL]: 'Propiedades',
  },
  ar: {
    [WEBSITE_FOCUS.SELLING]: 'للبيع',
    [WEBSITE_FOCUS.RENT]: 'للايجار',
    [WEBSITE_FOCUS.DAILY_RENT]: 'ايجار يومي',
    [WEBSITE_FOCUS.ALL]: 'العقارات',
  },
};

const DEFAULT_DESCRIPTION: Record<SupportedLocale, string> = {
  en: 'Property details and media from Yakout immobilier.',
  fr: 'Details et medias de la propriete sur Yakout immobilier.',
  es: 'Detalles y contenido multimedia de la propiedad en Yakout immobilier.',
  ar: 'تفاصيل العقار والوسائط على Yakout immobilier.',
};

const toAbsoluteUrl = (pathOrUrl: string): string => {
  if (pathOrUrl.startsWith('http')) {
    return pathOrUrl;
  }

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${baseUrl}${normalizedPath}`;
};

export function buildPropertyMetadata(property: any, kind: WEBSITE_FOCUS, locale: SupportedLocale) {
  const localizedTitle = getLocalizedValue(property?.title, locale);
  const suffix = (FOCUS_SUFFIX[locale] || FOCUS_SUFFIX.fr)[kind] || SITE_NAME;

  const title = localizedTitle
    ? `${localizedTitle} | ${suffix}`
    : SITE_NAME;

  const descriptionSource = getLocalizedValue(property?.description, locale)
    || DEFAULT_DESCRIPTION[locale]
    || DEFAULT_DESCRIPTION.fr;

  const description = metaClamp(stripHtml(descriptionSource), 160)
    || DEFAULT_DESCRIPTION[locale]
    || DEFAULT_DESCRIPTION.fr;

  const firstImage = property?.images?.[0]?.upload?.url as string | undefined;
  const ogImage = firstImage ? toAbsoluteUrl(firstImage) : undefined;

  const pathTemplate = kind === WEBSITE_FOCUS.SELLING
    ? Routes.Properties.HomeSale.ReadOne
    : kind === WEBSITE_FOCUS.RENT
      ? Routes.Properties.MonthlyRent.ReadOne
      : Routes.Properties.DailyRent.ReadOne;

  const path = property?.id
    ? pathTemplate.replace('{id}', String(property.id))
    : undefined;

  const absoluteUrl = path ? toAbsoluteUrl(path) : undefined;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    path,
  };
}
