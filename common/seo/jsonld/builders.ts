import { SupportedLocale } from '@/common/seo/config';
import { getBaseUrl, SITE_NAME } from '@/common/seo/config';
import { formatPrice } from '@/common/seo/format';
import Routes from '@/common/defs/routes';
import { getServerTranslation } from './server-translations';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';

export interface JsonLdProperty {
  '@context': 'https://schema.org';
  '@type': 'RealEstate';
  name: string;
  description: string;
  url: string;
  image: string[];
  address: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    addressCountry: string;
    postalCode?: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    validFrom?: string;
    validThrough?: string;
    category: string;
  };
  floorSize?: {
    '@type': 'QuantitativeValue';
    value: number;
    unitCode: string;
  };
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  amenityFeature?: Array<{
    '@type': 'LocationFeatureSpecification';
    name: string;
    value: boolean;
  }>;
  additionalProperty?: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string | number;
  }>;
  datePosted?: string;
  validFrom?: string;
  validThrough?: string;
}

export interface JsonLdBlogPost {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  url: string;
  image: string[];
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  articleSection?: string;
  keywords?: string[];
  wordCount?: number;
  timeRequired?: string;
  inLanguage?: string;
}

export interface JsonLdOrganization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': 'PostalAddress';
    addressCountry: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    email?: string;
    contactType: string;
  };
  sameAs?: string[];
}

export interface JsonLdBreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface JsonLdWebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

export interface JsonLdItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    url: string;
    name?: string;
    image?: string;
  }>;
}

export function buildPropertyJsonLd(
  property: any,
  locale: SupportedLocale,
  websiteFocus: WEBSITE_FOCUS
): JsonLdProperty {
  const baseUrl = getBaseUrl();

  // Get the correct route based on website focus
  let propertyRoute: string;
  switch (websiteFocus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      propertyRoute = Routes.Properties.DailyRent.ReadOne.replace('{id}', property.id);
      break;
    case WEBSITE_FOCUS.RENT:
      propertyRoute = Routes.Properties.MonthlyRent.ReadOne.replace('{id}', property.id);
      break;
    case WEBSITE_FOCUS.SELLING:
      propertyRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', property.id);
      break;
    default:
      propertyRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', property.id);
  }

  const propertyUrl = `${baseUrl}${propertyRoute}`;

  // Build images array
  const images = property.images?.map((img: any) =>
    img.url?.startsWith('http') ? img.url : `${baseUrl}${img.url}`
  ) || [];

  // Build address
  const address = {
    '@type': 'PostalAddress' as const,
    addressLocality: property.location?.city || 'Unknown',
    addressCountry: 'MA', // Morocco
    ...(property.location?.address && { streetAddress: property.location.address }),
    ...(property.location?.region && { addressRegion: property.location.region }),
    ...(property.location?.postalCode && { postalCode: property.location.postalCode }),
  };

  // Build geo coordinates if available
  const geo = property.location?.latitude && property.location?.longitude ? {
    '@type': 'GeoCoordinates' as const,
    latitude: property.location.latitude,
    longitude: property.location.longitude,
  } : undefined;

  // Build offers
  const price = formatPrice(property.price, property.currency);
  const availability = websiteFocus === WEBSITE_FOCUS.DAILY_RENT ? 'https://schema.org/InStock' : 'https://schema.org/InStock';

  const offers = {
    '@type': 'Offer' as const,
    price: property.price?.toString() || '0',
    priceCurrency: property.currency || 'MAD',
    availability,
    category: websiteFocus,
    ...(property.availableFrom && { validFrom: property.availableFrom }),
    ...(property.availableUntil && { validThrough: property.availableUntil }),
  };

  // Build floor size
  const floorSize = property.surfaceArea ? {
    '@type': 'QuantitativeValue' as const,
    value: property.surfaceArea,
    unitCode: 'MTK',
  } : undefined;

  // Build amenity features
  const amenityFeature = property.amenities?.map((amenity: any) => ({
    '@type': 'LocationFeatureSpecification' as const,
    name: amenity.name,
    value: true,
  })) || [];

  // Build additional properties
  const additionalProperty = [];
  if (property.numberOfRooms) additionalProperty.push({
    '@type': 'PropertyValue' as const,
    name: 'Number of Rooms',
    value: property.numberOfRooms,
  });
  if (property.numberOfBedrooms) additionalProperty.push({
    '@type': 'PropertyValue' as const,
    name: 'Number of Bedrooms',
    value: property.numberOfBedrooms,
  });
  if (property.numberOfBathrooms) additionalProperty.push({
    '@type': 'PropertyValue' as const,
    name: 'Number of Bathrooms',
    value: property.numberOfBathrooms,
  });
  if (property.furnishingStatus) additionalProperty.push({
    '@type': 'PropertyValue' as const,
    name: 'Furnishing Status',
    value: property.furnishingStatus,
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstate',
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: images,
    address,
    ...(geo && { geo }),
    offers,
    ...(floorSize && { floorSize }),
    numberOfRooms: property.numberOfRooms,
    numberOfBedrooms: property.numberOfBedrooms,
    numberOfBathrooms: property.numberOfBathrooms,
    amenityFeature,
    additionalProperty,
    datePosted: property.createdAt,
    validFrom: property.availableFrom,
    validThrough: property.availableUntil,
  };
}

export function buildBlogPostJsonLd(
  post: any,
  locale: SupportedLocale
): JsonLdBlogPost {
  const baseUrl = getBaseUrl();
  const postUrl = `${baseUrl}${Routes.Posts.ReadOne.replace('{slug}', post.slug)}`;

  // Build images array
  const images = post.image?.url ? [
    post.image.url.startsWith('http') ? post.image.url : `${baseUrl}${post.image.url}`
  ] : [];

  // Calculate word count and reading time
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

  // Build keywords from categories and tags
  const keywords = [
    ...(post.categories?.map((cat: any) => cat.name) || []),
    ...(post.tags?.map((tag: any) => tag.name) || []),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.description,
    url: postUrl,
    image: images,
    author: {
      '@type': 'Person',
      name: post.agent?.user?.name || 'Unknown Author',
      ...(post.agent?.website && { url: post.agent.website }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: post.categories?.[0]?.name,
    keywords,
    wordCount,
    timeRequired: `PT${readingTime}M`,
    inLanguage: locale,
  };
}

export function buildOrganizationJsonLd(locale: SupportedLocale): JsonLdOrganization {
  const baseUrl = getBaseUrl();
  const { t } = getServerTranslation(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('organization.name'),
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: t('organization.description'),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@yourplatform.com',
      telephone: '+212-XXX-XXXXXX',
    },
    sameAs: [
      // Add social media URLs here
    ],
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdBreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildWebSiteJsonLd(locale: SupportedLocale): JsonLdWebSite {
  const baseUrl = getBaseUrl();
  const { t } = getServerTranslation(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('organization.name'),
    url: baseUrl,
    description: t('organization.description'),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}${Routes.Properties.HomeSale.ReadAll}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: t('organization.name'),
      url: baseUrl,
    },
  };
}

// Build ItemList JSON-LD for listing pages
export function buildListingItemListJsonLd(
  items: any[] | null | undefined,
  focus: WEBSITE_FOCUS
): JsonLdItemList | null {
  if (!items || items.length === 0) return null;
  const baseUrl = getBaseUrl();

  const toDetailRoute = (id: string | number) => {
    switch (focus) {
      case WEBSITE_FOCUS.DAILY_RENT:
        return Routes.Properties.DailyRent.ReadOne.replace('{id}', String(id));
      case WEBSITE_FOCUS.RENT:
        return Routes.Properties.MonthlyRent.ReadOne.replace('{id}', String(id));
      case WEBSITE_FOCUS.SELLING:
      default:
        return Routes.Properties.HomeSale.ReadOne.replace('{id}', String(id));
    }
  };

  const itemListElement = items.map((it: any, idx: number) => ({
    '@type': 'ListItem' as const,
    position: idx + 1,
    url: `${baseUrl}${toDetailRoute(it.id)}`,
    name: it?.title?.fr || it?.title?.en || it?.title?.es || it?.title?.ar || undefined,
    image: it?.images?.[0]?.upload?.url
      ? (it.images[0].upload.url.startsWith('http') ? it.images[0].upload.url : `${baseUrl}${it.images[0].upload.url}`)
      : undefined,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
  };
}
