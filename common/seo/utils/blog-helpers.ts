/**
 * Utilities for blog-specific page data and JSON-LD
 */

import { detectRequestLocale, normalizeLocale } from "@/common/seo/locale";
import { fetchPostBySlug } from "@/common/seo/fetchers";
import { buildBlogPostJsonLd, buildBreadcrumbJsonLd } from "@/common/seo/jsonld/builders";
import { buildBlogBreadcrumbs } from "@/common/seo/jsonld/helpers";

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
  const blogPostJsonLd = buildBlogPostJsonLd(post, normalizedLocale);
  
  const breadcrumbItems = buildBlogBreadcrumbs(slug, post?.title || '', normalizedLocale);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return {
    blogPostJsonLd,
    breadcrumbJsonLd,
    blogPostId: `ld-blog-${slug}`,
    breadcrumbId: `ld-breadcrumb-blog-${slug}`,
  };
}
