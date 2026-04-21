import { SUPPORTED_LOCALES, getBaseUrl } from './config';

const toAbsoluteUrl = (pathname: string): string => {
  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${baseUrl}${normalizedPath}`;
};

export function buildCanonical(
  pathname: string,
  searchParams?: URLSearchParams | null,
  allowlistParams: string[] = []
): string {
  let targetPath = pathname;

  if (searchParams && allowlistParams.length > 0) {
    const filteredSearchParams = new URLSearchParams();

    for (const key of allowlistParams) {
      const value = searchParams.get(key);
      if (value !== null) {
        filteredSearchParams.set(key, value);
      }
    }

    const queryString = filteredSearchParams.toString();
    targetPath = queryString ? `${pathname}?${queryString}` : pathname;
  }

  return toAbsoluteUrl(targetPath);
}

export function buildAlternates(pathname: string): Record<string, string> {
  const canonical = buildCanonical(pathname);
  const alternateMap: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    alternateMap[locale] = canonical;
  }

  return alternateMap;
}
