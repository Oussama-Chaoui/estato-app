import { SUPPORTED_LOCALES, SupportedLocale, getBaseUrl } from './config';

export function buildCanonical(pathname: string, searchParams?: URLSearchParams | null, allowlistParams: string[] = []): string {
  let url = pathname;
  if (searchParams && allowlistParams.length > 0) {
    const filtered = new URLSearchParams();
    for (const key of allowlistParams) {
      const value = searchParams.get(key);
      if (value !== null) filtered.set(key, value);
    }
    const qs = filtered.toString();
    url = qs ? `${pathname}?${qs}` : pathname;
  }
  const base = getBaseUrl();
  return `${base}${url}`;
}

export function buildAlternates(pathname: string): Record<string, string> {
  const base = getBaseUrl();
  const map: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    map[locale] = `${base}/${locale}${pathname}`.replace(/\/+/, '/');
  }
  return map;
}


