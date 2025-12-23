import { getBaseUrl, SITE_NAME } from "@/common/seo/config";
import { pickLocalizedText } from "@/common/seo/locale";
import Routes from "@/common/defs/routes";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

import { SupportedLocale } from '@/common/seo/config';

export function buildPropertyMetadata(property: any, kind: WEBSITE_FOCUS, locale: SupportedLocale) {
  const titleText = property ? pickLocalizedText(property.title, locale) : '';
  const descText = property ? pickLocalizedText(property.description, locale) : '';
  // Localize the suffix based on locale
  const getLocalizedSuffix = (kind: WEBSITE_FOCUS, locale: SupportedLocale): string => {
    switch (kind) {
      case WEBSITE_FOCUS.SELLING:
        return locale === 'fr' ? 'À vendre' :
          locale === 'es' ? 'En venta' :
            locale === 'ar' ? 'للبيع' : 'For Sale';
      case WEBSITE_FOCUS.RENT:
        return locale === 'fr' ? 'À louer' :
          locale === 'es' ? 'En alquiler' :
            locale === 'ar' ? 'للإيجار' : 'For Rent';
      case WEBSITE_FOCUS.DAILY_RENT:
        return locale === 'fr' ? 'Location journalière' :
          locale === 'es' ? 'Alquiler diario' :
            locale === 'ar' ? 'إيجار يومي' : 'Daily Rent';
      default:
        return 'Property';
    }
  };

  const suffix = getLocalizedSuffix(kind, locale);

  const title = titleText ? `${titleText} | ${suffix}` : `${SITE_NAME}`;

  // Localize description fallback
  const getLocalizedDescription = (locale: SupportedLocale): string => {
    return locale === 'fr' ? 'Détails de la propriété' :
      locale === 'es' ? 'Detalles de la propiedad' :
        locale === 'ar' ? 'تفاصيل العقار' : 'Property details';
  };

  const description = descText || getLocalizedDescription(locale);

  const firstImage = property?.images?.[0]?.upload?.url as string | undefined;
  const base = getBaseUrl();
  const ogImage = firstImage ? (firstImage.startsWith('http') ? firstImage : `${base}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`) : undefined;

  const pathTemplate = kind === WEBSITE_FOCUS.SELLING
    ? Routes.Properties.HomeSale.ReadOne
    : kind === WEBSITE_FOCUS.RENT
      ? Routes.Properties.MonthlyRent.ReadOne
      : Routes.Properties.DailyRent.ReadOne;

  const path = property?.id ? pathTemplate.replace('{id}', String(property.id)) : undefined;

  return {
    title,
    description,
    openGraph: ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : undefined,
    twitter: ogImage ? { images: [ogImage] } : undefined,
    path,
  };
}


