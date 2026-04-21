import { getBaseUrl, type SupportedLocale } from '@/common/seo/config';
import { metaClamp } from '@/common/seo/format';
import Routes from '@/common/defs/routes';
import { estimateReadTime, getLocalizedValue, stripHtml } from '@/common/utils/localized-text';

const LISTING_COPY: Record<SupportedLocale, { title: string; description: string }> = {
  en: {
    title: 'Real Estate Insights',
    description: "Discover expert advice, market trends, and practical tips for Morocco's real estate market.",
  },
  fr: {
    title: 'Conseils Immobiliers',
    description: "Decouvrez des conseils d'experts, les tendances du marche et des astuces pratiques pour l'immobilier marocain.",
  },
  es: {
    title: 'Consejos Inmobiliarios',
    description: 'Descubre consejos de expertos, tendencias del mercado y recomendaciones practicas para el sector inmobiliario en Marruecos.',
  },
  ar: {
    title: 'اخبار ونصائح العقارات',
    description: 'اكتشف نصائح الخبراء واتجاهات السوق واهم التوصيات العملية في سوق العقارات المغربي.',
  },
};

const POST_COPY: Record<SupportedLocale, { title: string; description: string; notFoundTitle: string; notFoundDescription: string }> = {
  en: {
    title: 'Blog Post',
    description: 'Read this article on Yakout immobilier.',
    notFoundTitle: 'Article Not Found',
    notFoundDescription: "The article you're looking for does not exist or is no longer available.",
  },
  fr: {
    title: 'Article de Blog',
    description: 'Consultez cet article sur Yakout immobilier.',
    notFoundTitle: 'Article introuvable',
    notFoundDescription: "L'article recherche est introuvable ou n'est plus disponible.",
  },
  es: {
    title: 'Articulo del Blog',
    description: 'Lee este articulo en Yakout immobilier.',
    notFoundTitle: 'Articulo no encontrado',
    notFoundDescription: 'El articulo que buscas no existe o ya no esta disponible.',
  },
  ar: {
    title: 'مقال مدونة',
    description: 'اقرا هذا المقال على Yakout immobilier.',
    notFoundTitle: 'المقال غير موجود',
    notFoundDescription: 'المقال الذي تبحث عنه غير موجود او لم يعد متاحا.',
  },
};

const buildAbsolutePath = (path: string): string => {
  const baseUrl = getBaseUrl().replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

const toMetaDescription = (value: string, fallback: string): string => {
  const cleaned = stripHtml(value) || fallback;
  return metaClamp(cleaned, 160) || fallback;
};

export function buildBlogListMetadata(opts: {
  locale: SupportedLocale;
  filters?: { search?: string | null; category?: string | null };
  total?: number | null;
}) {
  const { locale, filters, total } = opts;
  const copy = LISTING_COPY[locale] || LISTING_COPY.fr;

  const filterSuffix = filters?.search
    ? ` - ${filters.search.trim()}`
    : filters?.category && filters.category !== 'all'
      ? ` - ${filters.category.trim()}`
      : '';

  const title = `${copy.title}${filterSuffix}`;
  const description = typeof total === 'number'
    ? `${copy.description} (${total} articles).`
    : copy.description;

  return {
    title,
    description: toMetaDescription(description, copy.description),
  };
}

export function buildBlogPostMetadata(post: any, locale: SupportedLocale) {
  const copy = POST_COPY[locale] || POST_COPY.fr;

  const title = getLocalizedValue(post?.metaTitle, locale)
    || getLocalizedValue(post?.title, locale)
    || copy.title;

  const localizedContent = getLocalizedValue(post?.content, locale);
  const rawDescription = getLocalizedValue(post?.metaDescription, locale)
    || getLocalizedValue(post?.excerpt, locale)
    || stripHtml(localizedContent)
    || copy.description;

  const readTime = estimateReadTime(localizedContent);
  const section = getLocalizedValue(post?.categories?.[0]?.name, locale);
  const tags = (post?.tags || [])
    .map((tag: any) => getLocalizedValue(tag?.name, locale))
    .filter(Boolean);

  const baseDescription = toMetaDescription(rawDescription, copy.description);
  const description = readTime > 0
    ? toMetaDescription(`${baseDescription} (${readTime} min read).`, baseDescription)
    : baseDescription;

  const path = post?.slug
    ? Routes.Posts.ReadOne.replace('{slug}', post.slug)
    : undefined;
  const absoluteUrl = path ? buildAbsolutePath(path) : undefined;

  const imageUrl: string | undefined = post?.image?.url;
  const ogImage = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : buildAbsolutePath(imageUrl))
    : undefined;

  const openGraph: any = {
    type: 'article',
    title,
    description,
    ...(absoluteUrl ? { url: absoluteUrl } : {}),
    ...(post?.publishedAt ? { publishedTime: post.publishedAt } : {}),
    ...(post?.updatedAt ? { modifiedTime: post.updatedAt } : {}),
    ...(post?.agent?.user?.name ? { authors: [post.agent.user.name] } : {}),
    ...(section ? { section } : {}),
    ...(tags.length > 0 ? { tags } : {}),
    ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
  };

  const twitter: any = {
    card: 'summary_large_image',
    title,
    description,
    ...(ogImage ? { images: [ogImage] } : {}),
  };

  return {
    title,
    description,
    openGraph,
    twitter,
    path,
    article: {
      publishedTime: post?.publishedAt,
      authors: post?.agent?.user?.name ? [post.agent.user.name] : undefined,
      section: section || undefined,
      tags,
    },
    notFound: {
      title: copy.notFoundTitle,
      description: copy.notFoundDescription,
    },
  };
}
