import { headers } from 'next/headers';

export async function fetchProperty(id: string, locale?: string) {
  const h = headers();
  const acceptLanguage = locale || h.get('accept-language') || 'fr';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`, {
    headers: { 'Accept-Language': acceptLanguage.split(',')[0] },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.item ?? data?.item ?? null;
}

export interface ListingFilterInputs {
  location?: string;
  checkIn?: string; // ISO
  checkOut?: string; // ISO
  availableFrom?: string; // ISO
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  floors?: number;
  amenities?: string[];
  furnishingStatus?: string;
  websiteFocus?: string;
}

export async function fetchListings(filters: ListingFilterInputs, page?: number, pageSize?: number, locale?: string) {
  const h = headers();
  const acceptLanguage = locale || h.get('accept-language') || 'fr';
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));
  if (pageSize) params.set('per_page', String(pageSize));
  const qs = params.toString();
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/properties/search/filters${qs ? `?${qs}` : ''}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': acceptLanguage.split(',')[0],
    },
    body: JSON.stringify(filters),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const items = data?.data?.items ?? [];
  const meta = data?.data?.meta ?? null;
  return { items, meta };
}

export async function fetchPostsList(page?: number, pageSize?: number, locale?: string, filters?: { search?: string; category?: string }) {
  const h = headers();
  const acceptLanguage = locale || h.get('accept-language') || 'fr';
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));
  if (pageSize) params.set('per_page', String(pageSize));
  if (filters?.search) params.set('search', filters.search);
  if (filters?.category && filters.category !== 'all') params.set('category', filters.category);
  const qs = params.toString();
  const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/posts${qs ? `?${qs}` : ''}`;

  const res = await fetch(endpoint, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': acceptLanguage.split(',')[0],
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const items = data?.data?.items ?? data?.items ?? [];
  const meta = data?.data?.meta ?? data?.meta ?? null;
  return { items, meta };
}

export async function fetchPostBySlug(slug: string, locale?: string) {
  const h = headers();
  const acceptLanguage = locale || h.get('accept-language') || 'fr';
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': acceptLanguage.split(',')[0],
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.item ?? data?.item ?? null;
}


