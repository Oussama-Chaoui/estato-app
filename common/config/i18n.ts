import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const initI18next = async (locale: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: locale,
      fallbackLng: 'fr',
      ns: ['common', 'topbar', 'landing', 'footer', 'properties', 'amenities', 'favorites', 'blog', 'joinUs'],
      defaultNS: 'common',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          common: require('../../public/locales/en/common.json'),
          topbar: require('../../public/locales/en/topbar.json'),
          landing: require('../../public/locales/en/landing.json'),
          footer: require('../../public/locales/en/footer.json'),
          properties: require('../../public/locales/en/properties.json'),
          amenities: require('../../public/locales/en/amenities.json'),
          favorites: require('../../public/locales/en/favorites.json'),
          blog: require('../../public/locales/en/blog.json'),
          joinUs: require('../../public/locales/en/join-us.json'),
        },
        fr: {
          common: require('../../public/locales/fr/common.json'),
          topbar: require('../../public/locales/fr/topbar.json'),
          landing: require('../../public/locales/fr/landing.json'),
          footer: require('../../public/locales/fr/footer.json'),
          properties: require('../../public/locales/fr/properties.json'),
          amenities: require('../../public/locales/fr/amenities.json'),
          favorites: require('../../public/locales/fr/favorites.json'),
          blog: require('../../public/locales/fr/blog.json'),
          joinUs: require('../../public/locales/fr/join-us.json'),
        },
        es: {
          common: require('../../public/locales/es/common.json'),
          topbar: require('../../public/locales/es/topbar.json'),
          landing: require('../../public/locales/es/landing.json'),
          footer: require('../../public/locales/es/footer.json'),
          properties: require('../../public/locales/es/properties.json'),
          amenities: require('../../public/locales/es/amenities.json'),
          favorites: require('../../public/locales/es/favorites.json'),
          blog: require('../../public/locales/es/blog.json'),
          joinUs: require('../../public/locales/es/join-us.json'),
        },
        ar: {
          common: require('../../public/locales/ar/common.json'),
          topbar: require('../../public/locales/ar/topbar.json'),
          landing: require('../../public/locales/ar/landing.json'),
          footer: require('../../public/locales/ar/footer.json'),
          properties: require('../../public/locales/ar/properties.json'),
          amenities: require('../../public/locales/ar/amenities.json'),
          favorites: require('../../public/locales/ar/favorites.json'),
          blog: require('../../public/locales/ar/blog.json'),
          joinUs: require('../../public/locales/ar/join-us.json'),
        },
      },
    });
  return i18nInstance;
};

export default initI18next;
