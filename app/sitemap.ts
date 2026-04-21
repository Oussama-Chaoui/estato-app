import type { MetadataRoute } from 'next';
import Routes from '@/common/defs/routes';
import { getBaseUrl } from '@/common/seo/config';

type ApiMeta = {
  currentPage?: number;
  lastPage?: number;
  totalItems?: number;
  total?: number;
};

type ApiListResponse<T> = {
  success?: boolean;
  data?: {
    items?: T[];
    meta?: ApiMeta;
  };
};

type SitemapPost = {
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
};

type SitemapProperty = {
  id?: number | string;
  updatedAt?: string;
  createdAt?: string;
  status?: string;
  salePrice?: number | string | null;
  monthlyPriceEnabled?: boolean | number;
  dailyPriceEnabled?: boolean | number;
};

const MAX_PAGES = 20;
const PAGE_SIZE = 200;

const asDate = (value?: string): Date => {
  return value ? new Date(value) : new Date();
};

const isTruthy = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'yes'].includes(value.toLowerCase());
  }

  return false;
};

const toNumber = (value: unknown): number => {
  const castedValue = Number(value);
  return Number.isFinite(castedValue) ? castedValue : 0;
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json() as T;
  } catch {
    return null;
  }
};

const fetchAllPages = async <T>(buildUrl: (page: number) => string): Promise<T[]> => {
  const allItems: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const payload = await fetchJson<ApiListResponse<T>>(buildUrl(page));
    const currentItems = payload?.data?.items || [];

    if (currentItems.length === 0) {
      break;
    }

    allItems.push(...currentItems);

    const lastPage = Number(payload?.data?.meta?.lastPage || 1);
    if (page >= lastPage) {
      break;
    }
  }

  return allItems;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  const addEntry = (
    path: string,
    lastModified: Date,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: number
  ) => {
    const normalizedPath = path.startsWith('http') ? path : `${baseUrl}${path}`;
    if (entries.has(normalizedPath)) {
      return;
    }

    entries.set(normalizedPath, {
      url: normalizedPath,
      lastModified,
      changeFrequency,
      priority,
    });
  };

  addEntry(Routes.Common.Home, new Date(), 'daily', 1);
  addEntry(Routes.Properties.HomeSale.ReadAll, new Date(), 'daily', 0.95);
  addEntry(Routes.Properties.MonthlyRent.ReadAll, new Date(), 'daily', 0.9);
  addEntry(Routes.Properties.DailyRent.ReadAll, new Date(), 'daily', 0.9);
  addEntry(Routes.Posts.ReadAll, new Date(), 'daily', 0.85);
  addEntry(Routes.Common.About, new Date(), 'monthly', 0.6);
  addEntry(Routes.Common.Contact, new Date(), 'monthly', 0.7);
  addEntry(Routes.Common.JoinUs, new Date(), 'monthly', 0.55);
  addEntry(Routes.Common.FAQ, new Date(), 'monthly', 0.5);
  addEntry(Routes.Common.PrivacyPolicy, new Date(), 'yearly', 0.3);
  addEntry(Routes.Common.TermsOfService, new Date(), 'yearly', 0.3);

  if (!apiUrl) {
    return Array.from(entries.values());
  }

  const publishedFilter = encodeURIComponent(JSON.stringify({
    items: [
      {
        columnField: 'status',
        value: 'PUBLISHED',
        operatorValue: 'equals',
      },
    ],
    linkOperator: 'and',
  }));

  const [posts, properties] = await Promise.all([
    fetchAllPages<SitemapPost>((page) => `${apiUrl}/posts?page=${page}&per_page=${PAGE_SIZE}&filter=${publishedFilter}`),
    fetchAllPages<SitemapProperty>((page) => `${apiUrl}/properties?page=${page}&per_page=${PAGE_SIZE}`),
  ]);

  for (const post of posts) {
    if (!post.slug) {
      continue;
    }

    addEntry(
      Routes.Posts.ReadOne.replace('{slug}', post.slug),
      asDate(post.updatedAt || post.createdAt),
      'weekly',
      0.75
    );
  }

  for (const property of properties) {
    if (!property.id) {
      continue;
    }

    const propertyId = String(property.id);
    const lastModified = asDate(property.updatedAt || property.createdAt);

    if (isTruthy(property.dailyPriceEnabled)) {
      addEntry(
        Routes.Properties.DailyRent.ReadOne.replace('{id}', propertyId),
        lastModified,
        'daily',
        0.8
      );
    }

    if (isTruthy(property.monthlyPriceEnabled)) {
      addEntry(
        Routes.Properties.MonthlyRent.ReadOne.replace('{id}', propertyId),
        lastModified,
        'daily',
        0.78
      );
    }

    if (property.status === 'FOR_SALE' || toNumber(property.salePrice) > 0) {
      addEntry(
        Routes.Properties.HomeSale.ReadOne.replace('{id}', propertyId),
        lastModified,
        'daily',
        0.8
      );
    }
  }

  return Array.from(entries.values());
}
