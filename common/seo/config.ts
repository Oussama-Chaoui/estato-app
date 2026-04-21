export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const SITE_NAME = 'Yakout immobilier';

export const DEFAULT_TITLE = SITE_NAME;
export const DEFAULT_DESCRIPTION = 'Find your perfect property in Morocco with Yakout immobilier.';

export const DEFAULT_OG_IMAGE = '/hero.jpg';
export const DEFAULT_TWITTER_IMAGE = '/hero.jpg';

const PROD_FALLBACK_SITE_URL = 'https://www.yakout-immo.com';

const normalizeOrigin = (value: string): string | null => {
  try {
    const parsed = new URL(value.trim());
    return parsed.origin;
  } catch {
    return null;
  }
};

export function getBaseUrl(): string {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicitSiteUrl) {
    const parsedUrl = normalizeOrigin(explicitSiteUrl);
    if (parsedUrl) {
      return parsedUrl;
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const prefixed = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    const parsedUrl = normalizeOrigin(prefixed);
    if (parsedUrl) {
      return parsedUrl;
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return PROD_FALLBACK_SITE_URL;
  }

  return 'http://localhost:3000';
}

export const SEO_BRAND = {
  siteName: SITE_NAME,
  twitterHandle: '@yakoutimmo',
  facebookAppId: undefined as string | undefined,
};
