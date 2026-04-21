import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import { detectRequestLocale } from '@/common/seo/locale';
import { buildCanonical } from '@/common/seo/url';
import Routes from '@/common/defs/routes';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const canonical = buildCanonical(Routes.Common.Contact);

  const titleByLocale = {
    en: 'Contact Yakout immobilier',
    fr: 'Contacter Yakout immobilier',
    es: 'Contacto Yakout immobilier',
    ar: 'اتصل ب Yakout immobilier',
  };

  const descriptionByLocale = {
    en: 'Get in touch with Yakout immobilier for property sales, rentals, and real estate support in Morocco.',
    fr: 'Contactez Yakout immobilier pour la vente, la location et laccompagnement immobilier au Maroc.',
    es: 'Contacta con Yakout immobilier para ventas, alquileres y acompanamiento inmobiliario en Marruecos.',
    ar: 'تواصل مع Yakout immobilier بخصوص البيع والايجار وخدمات العقارات في المغرب.',
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
      type: 'website',
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

const ContactPage = () => {
  return <ContactClient />;
};

export default ContactPage;
