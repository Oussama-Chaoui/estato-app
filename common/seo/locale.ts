import { headers } from 'next/headers';
import { SUPPORTED_LOCALES, type SupportedLocale } from './config';

// Server-side translation interface for SEO
export interface MultilingualText {
  en?: string;
  fr?: string;
  es?: string;
  ar?: string;
}

export function normalizeLocale(input?: string | null): SupportedLocale {
  const lower = (input || '').split(',')[0]?.trim().slice(0, 2).toLowerCase();
  const fallback: SupportedLocale = 'fr';
  if (!lower) return fallback;
  for (const loc of SUPPORTED_LOCALES) {
    if (loc === lower) return loc;
  }
  return fallback;
}

export function detectRequestLocale(): SupportedLocale {
  const h = headers();

  // Check for URL-based locale (if you have /en/, /fr/ etc in URLs)
  const pathname = h.get('x-pathname') || h.get('x-url') || '';
  const urlLocale = pathname.split('/')[1];
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale as SupportedLocale)) {
    return urlLocale as SupportedLocale;
  }

  // Check for Google search language preference (hl parameter)
  const referer = h.get('referer') || '';
  const hlMatch = referer.match(/[?&]hl=([^&]+)/);
  if (hlMatch) {
    const googleLocale = hlMatch[1].split('-')[0]; // Extract language from en-US, fr-FR etc
    if (SUPPORTED_LOCALES.includes(googleLocale as SupportedLocale)) {
      return googleLocale as SupportedLocale;
    }
  }

  // Fallback to Accept-Language header
  const acceptLang = h.get('accept-language');
  return normalizeLocale(acceptLang);
}

/**
 * Server-side translation function for SEO
 * @param text - The multilingual text object or string
 * @param locale - The current locale
 * @param fallback - Fallback text if the requested locale is not available
 * @returns The translated text
 */
export function pickLocalizedText(
  text: MultilingualText | string | null | undefined,
  locale: SupportedLocale,
  fallback?: string
): string {
  // If text is a string, return it directly (backward compatibility)
  if (typeof text === 'string') {
    return text;
  }

  // If text is null or undefined, return fallback or empty string
  if (!text) {
    return fallback || '';
  }

  // Try to get the text for the requested locale
  const translatedText = text[locale];

  // If the requested locale is available, return it
  if (translatedText) {
    return translatedText;
  }

  // Fallback order: en -> fr -> ar -> es -> fallback -> empty string
  const fallbackOrder: SupportedLocale[] = ['en', 'fr', 'ar', 'es'];

  for (const fallbackLocale of fallbackOrder) {
    const fallbackText = text[fallbackLocale];
    if (fallbackText) {
      return fallbackText;
    }
  }

  return fallback || '';
}


