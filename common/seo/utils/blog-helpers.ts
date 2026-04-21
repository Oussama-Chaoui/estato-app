/**
 * Utilities for blog-specific page data and JSON-LD
 */

import { detectRequestLocale, normalizeLocale } from "@/common/seo/locale";
import { fetchPostBySlug } from "@/common/seo/fetchers";
import { buildBlogPostJsonLd, buildBreadcrumbJsonLd } from "@/common/seo/jsonld/builders";
import { buildBlogBreadcrumbs } from "@/common/seo/jsonld/helpers";
import { getLocalizedValue } from "@/common/utils/localized-text";

/**
 * Fetch blog post data for a page
 */
export async function fetchBlogPostPageData(slug: string) {
  const locale = detectRequestLocale();
  const post = await fetchPostBySlug(slug, locale);
  
  return {
    locale,
    post,
  };
}

/**
 * Generate blog post JSON-LD
 */
export function generateBlogPostJsonLd(post: any, slug: string, locale: string) {
  const normalizedLocale = normalizeLocale(locale);
  const blogPostJsonLd = post ? buildBlogPostJsonLd(post, normalizedLocale) : null;

  const postTitle = getLocalizedValue(post?.title, normalizedLocale);
  const breadcrumbItems = buildBlogBreadcrumbs(slug, postTitle, normalizedLocale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return {
    blogPostJsonLd,
    breadcrumbJsonLd,
    blogPostId: `ld-blog-${slug}`,
    breadcrumbId: `ld-breadcrumb-blog-${slug}`,
  };
}
