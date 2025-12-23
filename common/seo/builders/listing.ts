import { SupportedLocale } from '@/common/seo/config';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';

export function buildListingMetadata(opts: {
  locale: SupportedLocale;
  focus: WEBSITE_FOCUS;
  filters: { location?: string | null; propertyType?: string | null };
  total?: number | null;
}) {
  const { locale, focus, filters, total } = opts;

  const baseTitle = (() => {
    switch (focus) {
      case WEBSITE_FOCUS.SELLING:
        return locale === 'fr' ? 'Maisons à vendre' :
               locale === 'es' ? 'Casas en venta' :
               locale === 'ar' ? 'عقارات للبيع' : 'Homes for Sale';
      case WEBSITE_FOCUS.RENT:
        return locale === 'fr' ? 'Locations mensuelles' :
               locale === 'es' ? 'Alquileres mensuales' :
               locale === 'ar' ? 'إيجارات شهرية' : 'Monthly Rentals';
      case WEBSITE_FOCUS.DAILY_RENT:
        return locale === 'fr' ? 'Locations journalières' :
               locale === 'es' ? 'Alquileres por día' :
               locale === 'ar' ? 'إيجارات يومية' : 'Daily Rentals';
      default:
        return 'Properties';
    }
  })();

  const suffix = filters.location ? ` - ${filters.location}` : (filters.propertyType ? ` - ${filters.propertyType}` : '');
  const title = `${baseTitle}${suffix}`;

  const description = (() => {
    if (locale === 'fr') return 'Parcourez nos propriétés avec vos filtres appliqués.';
    if (locale === 'es') return 'Explora nuestras propiedades con tus filtros aplicados.';
    if (locale === 'ar') return 'استكشف العقارات مع عوامل التصفية المطبقة.';
    return 'Browse properties with your selected filters applied.';
  })();

  // Optionally reflect counts
  const descWithCount = typeof total === 'number' ? `${description} (${total} results).` : description;

  return { title, description: descWithCount };
}


