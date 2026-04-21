import type { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { detectRequestLocale } from '@/common/seo/locale';
import { buildCanonical } from '@/common/seo/url';
import Routes from '@/common/defs/routes';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const canonical = buildCanonical(Routes.Common.PrivacyPolicy);

  const titleByLocale = {
    en: 'Privacy Policy',
    fr: 'Politique de confidentialite',
    es: 'Politica de privacidad',
    ar: 'سياسة الخصوصية',
  };

  const descriptionByLocale = {
    en: 'Read how Yakout immobilier collects, uses, and protects your personal data.',
    fr: 'Consultez la maniere dont Yakout immobilier collecte, utilise et protege vos donnees personnelles.',
    es: 'Descubre como Yakout immobilier recopila, usa y protege tus datos personales.',
    ar: 'اطلع على كيفية جمع Yakout immobilier لبياناتك الشخصية واستخدامها وحمايتها.',
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

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
