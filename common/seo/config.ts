export const SUPPORTED_LOCALES = ['en', 'fr', 'es', 'ar'] as const;

export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const SITE_NAME = 'Yakout immobilier';

export const DEFAULT_TITLE = SITE_NAME;
export const DEFAULT_DESCRIPTION = 'Find your perfect property – houses, apartments, and villas for sale and rent.';

export const DEFAULT_OG_IMAGE = '/hero.jpg';
export const DEFAULT_TWITTER_IMAGE = '/hero.jpg';

export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    try {
      const u = new URL(envUrl);
      return u.origin;
    } catch {}
  }
  // Fallback for dev
  return 'http://localhost:3000';
}

export const SEO_BRAND = {
  siteName: SITE_NAME,
  twitterHandle: '@yourbrand',
  facebookAppId: undefined as string | undefined,
};


