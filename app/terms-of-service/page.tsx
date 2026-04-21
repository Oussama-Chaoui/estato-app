import type { Metadata } from 'next';
import TermsOfServiceClient from './TermsOfServiceClient';
import { detectRequestLocale } from '@/common/seo/locale';
import { buildCanonical } from '@/common/seo/url';
import Routes from '@/common/defs/routes';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const canonical = buildCanonical(Routes.Common.TermsOfService);

  const titleByLocale = {
    en: 'Terms of Service',
    fr: 'Conditions dutilisation',
    es: 'Terminos de servicio',
    ar: 'شروط الاستخدام',
  };

  const descriptionByLocale = {
    en: 'Read the terms and conditions for using Yakout immobilier platform and services.',
    fr: 'Consultez les conditions dutilisation de la plateforme et des services Yakout immobilier.',
    es: 'Consulta los terminos y condiciones de uso de la plataforma y los servicios de Yakout immobilier.',
    ar: 'اقرا شروط واحكام استخدام منصة وخدمات Yakout immobilier.',
  };

  const title = titleByLocale[locale] || titleByLocale.fr;
  const description = descriptionByLocale[locale] || descriptionByLocale.fr;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
    alternates: {
      canonical,
    },
  };
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
