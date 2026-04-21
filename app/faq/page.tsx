import type { Metadata } from 'next';
import FAQClient from './FAQClient';
import { detectRequestLocale } from '@/common/seo/locale';
import { buildCanonical } from '@/common/seo/url';
import Routes from '@/common/defs/routes';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const canonical = buildCanonical(Routes.Common.FAQ);

  const titleByLocale = {
    en: 'Frequently Asked Questions',
    fr: 'Questions frequentes',
    es: 'Preguntas frecuentes',
    ar: 'الاسئلة الشائعة',
  };

  const descriptionByLocale = {
    en: 'Find answers to common questions about Yakout immobilier, property search, and platform usage.',
    fr: 'Retrouvez les reponses aux questions frequentes sur Yakout immobilier, la recherche de biens et lutilisation de la plateforme.',
    es: 'Encuentra respuestas a preguntas comunes sobre Yakout immobilier, busqueda de propiedades y uso de la plataforma.',
    ar: 'اعثر على اجابات للاسئلة الشائعة حول Yakout immobilier والبحث عن العقارات واستخدام المنصة.',
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

export default function FAQPage() {
  return <FAQClient />;
}
