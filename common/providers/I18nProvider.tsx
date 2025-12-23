'use client';

import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getUserLanguage } from '@/common/components/lib/utils/language';

// Import translation files
import enCommon from '../../public/locales/en/common.json';
import enTopbar from '../../public/locales/en/topbar.json';
import enLanding from '../../public/locales/en/landing.json';
import enFooter from '../../public/locales/en/footer.json';
import enProperties from '../../public/locales/en/properties.json';
import enAmenities from '../../public/locales/en/amenities.json';
import enFavorites from '../../public/locales/en/favorites.json';
import enBlog from '../../public/locales/en/blog.json';
import enJoinUs from '../../public/locales/en/join-us.json'
import frCommon from '../../public/locales/fr/common.json';
import frTopbar from '../../public/locales/fr/topbar.json';
import frLanding from '../../public/locales/fr/landing.json';
import frFooter from '../../public/locales/fr/footer.json';
import frProperties from '../../public/locales/fr/properties.json';
import frAmenities from '../../public/locales/fr/amenities.json';
import frFavorites from '../../public/locales/fr/favorites.json';
import frBlog from '../../public/locales/fr/blog.json';
import frJoinUs from '../../public/locales/fr/join-us.json'
import esCommon from '../../public/locales/es/common.json';
import esTopbar from '../../public/locales/es/topbar.json';
import esLanding from '../../public/locales/es/landing.json';
import esFooter from '../../public/locales/es/footer.json';
import esProperties from '../../public/locales/es/properties.json';
import esAmenities from '../../public/locales/es/amenities.json';
import esFavorites from '../../public/locales/es/favorites.json';
import esBlog from '../../public/locales/es/blog.json';
import esJoinUs from '../../public/locales/es/join-us.json'
import arCommon from '../../public/locales/ar/common.json';
import arTopbar from '../../public/locales/ar/topbar.json';
import arLanding from '../../public/locales/ar/landing.json';
import arFooter from '../../public/locales/ar/footer.json';
import arProperties from '../../public/locales/ar/properties.json';
import arAmenities from '../../public/locales/ar/amenities.json';
import arFavorites from '../../public/locales/ar/favorites.json';
import arBlog from '../../public/locales/ar/blog.json';
import arJoinUs from '../../public/locales/ar/join-us.json'
import enAbout from '../../public/locales/en/about.json';
import frAbout from '../../public/locales/fr/about.json';
import esAbout from '../../public/locales/es/about.json';
import arAbout from '../../public/locales/ar/about.json';
import enContact from '../../public/locales/en/contact.json';
import frContact from '../../public/locales/fr/contact.json';
import esContact from '../../public/locales/es/contact.json';
import arContact from '../../public/locales/ar/contact.json';
import enPrivacy from '../../public/locales/en/privacy.json';
import frPrivacy from '../../public/locales/fr/privacy.json';
import esPrivacy from '../../public/locales/es/privacy.json';
import arPrivacy from '../../public/locales/ar/privacy.json';
import enTerms from '../../public/locales/en/terms.json';
import frTerms from '../../public/locales/fr/terms.json';
import esTerms from '../../public/locales/es/terms.json';
import arTerms from '../../public/locales/ar/terms.json';
import enFaq from '../../public/locales/en/faq.json';
import frFaq from '../../public/locales/fr/faq.json';
import esFaq from '../../public/locales/es/faq.json';
import arFaq from '../../public/locales/ar/faq.json';


interface I18nContextType {
  currentLocale: string;
  changeLocale: (locale: string) => void;
  isI18nLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: string;
}

export const I18nProvider = ({ children, initialLocale }: I18nProviderProps) => {
  const [i18nInstance, setI18nInstance] = useState<any>(null);
  const [currentLocale, setCurrentLocale] = useState(initialLocale || 'fr');
  const [isI18nLoading, setIsI18nLoading] = useState(true);

  const changeLocale = async (locale: string) => {
    if (i18nInstance) {
      await i18nInstance.changeLanguage(locale);
      setCurrentLocale(locale);
    }
  };

  // Set initial locale from localStorage after mount
  useEffect(() => {
    const storedLanguage = getUserLanguage();
    if (storedLanguage !== currentLocale) {
      setCurrentLocale(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const initI18n = async () => {
      const instance = createInstance();

      await instance
        .use(initReactI18next)
        .init({
          lng: currentLocale,
          fallbackLng: 'fr',
          ns: ['common', 'topbar', 'landing', 'footer', 'properties', 'amenities', 'favorites', 'blog', 'joinUs', 'about', 'contact', 'privacy', 'terms', 'faq'],
          defaultNS: 'common',
          debug: process.env.NODE_ENV === 'development',
          interpolation: {
            escapeValue: false,
          },
          resources: {
            en: {
              common: enCommon,
              topbar: enTopbar,
              landing: enLanding,
              footer: enFooter,
              properties: enProperties,
              amenities: enAmenities,
              favorites: enFavorites,
              blog: enBlog,
              joinUs: enJoinUs,
              about: enAbout,
              contact: enContact,
              privacy: enPrivacy,
              terms: enTerms,
              faq: enFaq,
            },
            fr: {
              common: frCommon,
              topbar: frTopbar,
              landing: frLanding,
              footer: frFooter,
              properties: frProperties,
              amenities: frAmenities,
              favorites: frFavorites,
              blog: frBlog,
              joinUs: frJoinUs,
              about: frAbout,
              contact: frContact,
              privacy: frPrivacy,
              terms: frTerms,
              faq: frFaq,
            },
            es: {
              common: esCommon,
              topbar: esTopbar,
              landing: esLanding,
              footer: esFooter,
              properties: esProperties,
              amenities: esAmenities,
              favorites: esFavorites,
              blog: esBlog,
              joinUs: esJoinUs,
              about: esAbout,
              contact: esContact,
              privacy: esPrivacy,
              terms: esTerms,
              faq: esFaq,
            },
            ar: {
              common: arCommon,
              topbar: arTopbar,
              landing: arLanding,
              footer: arFooter,
              properties: arProperties,
              amenities: arAmenities,
              favorites: arFavorites,
              blog: arBlog,
              joinUs: arJoinUs,
              about: arAbout,
              contact: arContact,
              privacy: arPrivacy,
              terms: arTerms,
              faq: arFaq,
            },
          },
        });

      setI18nInstance(instance);
      setIsI18nLoading(false);
    };

    initI18n();
  }, [currentLocale]);

  return (
    <I18nContext.Provider value={{ currentLocale, changeLocale, isI18nLoading }}>
      {i18nInstance && (
        <I18nextProvider i18n={i18nInstance}>
          {children}
        </I18nextProvider>
      )}
    </I18nContext.Provider>
  );
};
