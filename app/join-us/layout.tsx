import type { Metadata } from 'next';
import { detectRequestLocale } from '@/common/seo/locale';
import { buildCanonical } from '@/common/seo/url';
import Routes from '@/common/defs/routes';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const canonical = buildCanonical(Routes.Common.JoinUs);

  const titleByLocale = {
    en: 'Join Us',
    fr: 'Rejoignez-nous',
    es: 'Unete a nosotros',
    ar: 'انضم الينا',
  };

  const descriptionByLocale = {
    en: 'Join Yakout immobilier and grow your real estate career in Morocco.',
    fr: 'Rejoignez Yakout immobilier et developpez votre carriere dans limmobilier au Maroc.',
    es: 'Unete a Yakout immobilier y desarrolla tu carrera en el sector inmobiliario en Marruecos.',
    ar: 'انضم الى Yakout immobilier وطوّر مسارك المهني في سوق العقارات بالمغرب.',
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

export default function JoinUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
