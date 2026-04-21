import { SUPPORTED_LOCALES, type SupportedLocale } from '@/common/seo/config';

export interface LocalizedText {
  en?: string | null;
  fr?: string | null;
  es?: string | null;
  ar?: string | null;
}

export type LocalizedValue = LocalizedText | string | null | undefined;

const DEFAULT_LOCALE: SupportedLocale = 'fr';

export const normalizeLocaleCode = (locale?: string | null): SupportedLocale => {
  const shortCode = (locale || '').split(',')[0]?.trim().slice(0, 2).toLowerCase();

  if (!shortCode) {
    return DEFAULT_LOCALE;
  }

  for (const supportedLocale of SUPPORTED_LOCALES) {
    if (supportedLocale === shortCode) {
      return supportedLocale;
    }
  }

  return DEFAULT_LOCALE;
};

const normalizeText = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
};

export const getLocalizedValue = (
  value: LocalizedValue,
  locale?: string | null,
  fallback = ''
): string => {
  if (typeof value === 'string') {
    return normalizeText(value) || fallback;
  }

  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const normalizedLocale = normalizeLocaleCode(locale);
  const fallbackOrder: SupportedLocale[] = [normalizedLocale, 'fr', 'en', 'ar', 'es'];
  const uniqueOrder = fallbackOrder.filter((item, index) => fallbackOrder.indexOf(item) === index);

  for (const localeKey of uniqueOrder) {
    const translatedValue = normalizeText(value[localeKey]);
    if (translatedValue) {
      return translatedValue;
    }
  }

  return fallback;
};

export const stripHtml = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  return normalizeText(value.replace(/<[^>]*>/g, ' '));
};

export const estimateReadTime = (value?: string | null, wordsPerMinute = 200): number => {
  const plainText = stripHtml(value);
  if (!plainText) {
    return 0;
  }

  const wordsCount = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordsCount / wordsPerMinute));
};
