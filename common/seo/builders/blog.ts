import { SupportedLocale } from '@/common/seo/config';
import { getBaseUrl } from '@/common/seo/config';
import Routes from '@/common/defs/routes';

export function buildBlogListMetadata(opts: {
  locale: SupportedLocale;
  filters?: { search?: string | null; category?: string | null };
  total?: number | null;
}) {
  const { locale, filters, total } = opts;

  const baseTitle = (() => {
    switch (locale) {
      case 'fr': return 'Conseils Immobiliers';
      case 'es': return 'Consejos Inmobiliarios';
      case 'ar': return 'أخبار ونصائح العقارات';
      default: return 'Real Estate Insights';
    }
  })();

  const suffix = filters?.search ? ` - ${filters.search}` : 
                 filters?.category && filters.category !== 'all' ? ` - ${filters.category}` : '';

  const title = `${baseTitle}${suffix}`;

  const description = (() => {
    if (locale === 'fr') return 'Découvrez des conseils d\'experts, les tendances du marché et des astuces exclusives pour le marché immobilier marocain.';
    if (locale === 'es') return 'Descubre consejos de expertos, tendencias del mercado y trucos exclusivos para el mercado inmobiliario marroquí.';
    if (locale === 'ar') return 'اكتشف أحدث النصائح والتوجهات السوقية في مجال العقارات المغربي.';
    return 'Discover expert advice, market trends, and insider tips for Morocco\'s real estate market.';
  })();

  const descWithCount = typeof total === 'number' ? `${description} (${total} articles).` : description;

  return { title, description: descWithCount };
}

export function buildBlogPostMetadata(post: any, locale: SupportedLocale) {
  const title = post?.metaTitle || post?.title || 'Blog Post';
  const description = post?.metaDescription || post?.excerpt || 'Read this article on our blog.';

  // Get featured image
  const firstImage = post?.image?.url as string | undefined;
  const base = getBaseUrl();
  const ogImage = firstImage ? (firstImage.startsWith('http') ? firstImage : `${base}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`) : undefined;

  // Build canonical path
  const path = post?.slug ? Routes.Posts.ReadOne.replace('{slug}', post.slug) : undefined;

  // Calculate reading time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const readTime = post?.content ? calculateReadTime(post.content) : undefined;

  // Add reading time to description if available
  const descriptionWithReadTime = readTime 
    ? `${description} (${readTime} min read).`
    : description;

  return {
    title,
    description: descriptionWithReadTime,
    openGraph: ogImage ? { 
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: 'article',
      publishedTime: post?.publishedAt,
      authors: post?.agent?.user?.name ? [post.agent.user.name] : undefined,
      section: post?.categories?.[0]?.name,
      tags: post?.tags?.map((tag: any) => tag.name),
    } : undefined,
    twitter: ogImage ? { 
      images: [ogImage],
      card: 'summary_large_image',
    } : undefined,
    path,
    article: {
      publishedTime: post?.publishedAt,
      authors: post?.agent?.user?.name ? [post.agent.user.name] : undefined,
      section: post?.categories?.[0]?.name,
      tags: post?.tags?.map((tag: any) => tag.name),
    },
  };
}
