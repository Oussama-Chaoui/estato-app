import { SupportedLocale } from '@/common/seo/config';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';

// Server-side translation helper for JSON-LD
// This avoids the need for useTranslation in server components
export function getServerTranslation(locale: SupportedLocale) {
  const translations = {
    // Breadcrumb translations
    breadcrumbs: {
      home: {
        en: 'Home',
        fr: 'Accueil',
        es: 'Inicio',
        ar: 'الرئيسية',
      },
      daily_rentals: {
        en: 'Daily Rentals',
        fr: 'Locations journalières',
        es: 'Alquileres diarios',
        ar: 'إيجارات يومية',
      },
      monthly_rentals: {
        en: 'Monthly Rentals',
        fr: 'Locations mensuelles',
        es: 'Alquileres mensuales',
        ar: 'إيجارات شهرية',
      },
      home_sales: {
        en: 'Sales',
        fr: 'Ventes',
        es: 'Ventas',
        ar: 'المبيعات',
      },
      blog: {
        en: 'Blog',
        fr: 'Blog',
        es: 'Blog',
        ar: 'المدونة',
      },
      property: {
        en: 'Property',
        fr: 'Propriété',
        es: 'Propiedad',
        ar: 'العقار',
      },
      article: {
        en: 'Article',
        fr: 'Article',
        es: 'Artículo',
        ar: 'المقال',
      },
    },

    // Organization translations
    organization: {
      name: {
        en: 'Yakout immobilier',
        fr: 'Yakout immobilier',
        es: 'Yakout immobilier',
        ar: 'Yakout immobilier',
      },
      description: {
        en: 'Your premier destination for real estate in Morocco. Find daily rentals, monthly rentals, and properties for sale.',
        fr: 'Votre destination de premier plan pour l\'immobilier au Maroc. Trouvez des locations journalières, mensuelles et des propriétés à vendre.',
        es: 'Su destino principal para bienes raíces en Marruecos. Encuentre alquileres diarios, mensuales y propiedades en venta.',
        ar: 'وجهتك الرئيسية للعقارات في المغرب. ابحث عن إيجارات يومية وشهرية وعقارات للبيع.',
      },
    },
  };

  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
        if (!value) return key; // Fallback to key if translation not found
      }

      // Prefer French by default, then English, then the key
      return value?.[locale] || value?.fr || value?.en || key;
    }
  };
}

// Helper function to get breadcrumb names based on website focus
export function getBreadcrumbNameKey(websiteFocus: WEBSITE_FOCUS): string {
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      return 'breadcrumbs.daily_rentals';
    case WEBSITE_FOCUS.RENT:
      return 'breadcrumbs.monthly_rentals';
    case WEBSITE_FOCUS.SELLING:
      return 'breadcrumbs.home_sales';
    default:
      return 'breadcrumbs.home_sales';
  }
}
