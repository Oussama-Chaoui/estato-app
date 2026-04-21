import { SupportedLocale } from '@/common/seo/config';
import { getBaseUrl, SITE_NAME } from '@/common/seo/config';
import Routes from '@/common/defs/routes';
import { getServerTranslation } from './server-translations';
import { WEBSITE_FOCUS } from '@/modules/settings/defs/types';
import { estimateReadTime, getLocalizedValue, stripHtml } from '@/common/utils/localized-text';

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
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    email?: string;
    contactType: string;
  };
  areaServed?: {
    '@type': 'Country';
    name: string;
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
      propertyRoute = Routes.Properties.DailyRent.ReadOne.replace('{id}', String(property.id));
      break;
    case WEBSITE_FOCUS.RENT:
      propertyRoute = Routes.Properties.MonthlyRent.ReadOne.replace('{id}', String(property.id));
      break;
    case WEBSITE_FOCUS.SELLING:
      propertyRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', String(property.id));
      break;
    default:
      propertyRoute = Routes.Properties.HomeSale.ReadOne.replace('{id}', String(property.id));
  }

  const propertyUrl = `${baseUrl}${propertyRoute}`;

  // Build images array
  const images = (property.images || [])
    .map((img: any) => img?.upload?.url || img?.url)
    .filter(Boolean)
    .map((url: string) => (url.startsWith('http') ? url : `${baseUrl}${url}`));

  // Build address
  const localizedStreetAddress = getLocalizedValue(property.location?.streetAddress, locale);
  const localizedCity = getLocalizedValue(property.location?.city?.names, locale, 'Unknown');
  const localizedRegion = getLocalizedValue(property.location?.city?.region?.names, locale);

  const address = {
    '@type': 'PostalAddress' as const,
    addressLocality: localizedCity,
    addressCountry: 'Morocco',
    ...(localizedStreetAddress && { streetAddress: localizedStreetAddress }),
    ...(localizedRegion && { addressRegion: localizedRegion }),
    ...(property.location?.postalCode && { postalCode: property.location.postalCode }),
  };

  // Build geo coordinates if available
  const geo = property.location?.latitude && property.location?.longitude ? {
    '@type': 'GeoCoordinates' as const,
    latitude: property.location.latitude,
    longitude: property.location.longitude,
  } : undefined;

  // Build offers
  const availability = websiteFocus === WEBSITE_FOCUS.DAILY_RENT ? 'https://schema.org/InStock' : 'https://schema.org/InStock';
  const resolvedPrice = websiteFocus === WEBSITE_FOCUS.DAILY_RENT
    ? property.dailyPrice
    : websiteFocus === WEBSITE_FOCUS.RENT
      ? property.monthlyPrice
      : (property.salePrice ?? property.price);

  const offers = {
    '@type': 'Offer' as const,
    price: String(resolvedPrice ?? 0),
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
    name: getLocalizedValue(amenity.name, locale),
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
    name: getLocalizedValue(property.title, locale) || SITE_NAME,
    description: stripHtml(getLocalizedValue(property.description, locale)),
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
  const localizedTitle = getLocalizedValue(post.title, locale, 'Blog Post');
  const localizedExcerpt = getLocalizedValue(post.excerpt, locale);
  const localizedContent = getLocalizedValue(post.content, locale);

  // Build images array
  const images = post.image?.url ? [
    post.image.url.startsWith('http') ? post.image.url : `${baseUrl}${post.image.url}`
  ] : [];

  // Calculate word count and reading time
  const plainContent = stripHtml(localizedContent);
  const wordCount = plainContent ? plainContent.split(/\s+/).length : 0;
  const readingTime = estimateReadTime(localizedContent); // 200 words per minute

  // Build keywords from categories and tags
  const keywords = [
    ...(post.categories?.map((cat: any) => getLocalizedValue(cat.name, locale)).filter(Boolean) || []),
    ...(post.tags?.map((tag: any) => getLocalizedValue(tag.name, locale)).filter(Boolean) || []),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: localizedTitle,
    description: localizedExcerpt || stripHtml(localizedContent),
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
    datePublished: post.publishedAt || post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    articleSection: getLocalizedValue(post.categories?.[0]?.name, locale),
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
      streetAddress: 'Al Yakout Immobiliere, Av. Ibn Rochd',
      addressLocality: 'Martil',
      addressRegion: 'Tangier-Tetouan-Al Hoceima',
      postalCode: '93150',
      addressCountry: 'Morocco',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@yakout-immo.com',
      telephone: '+212716657380',
    },
    sameAs: [
      'https://www.instagram.com/yakout.immobilier/',
      'https://www.facebook.com/AlYakoutImmobilier',
      'https://www.linkedin.com/company/yakout-real-estate/',
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
  focus: WEBSITE_FOCUS,
  locale: SupportedLocale
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
    name: getLocalizedValue(it?.title, locale) || undefined,
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
