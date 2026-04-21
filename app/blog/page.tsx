import type { Metadata } from "next";
import PostsList from "@/components/pages/blog/PostsList";
import { buildBlogListMetadata } from "@/common/seo/builders/blog";
import { buildCanonical } from "@/common/seo/url";
import { fetchPostsList } from "@/common/seo/fetchers";
import { detectRequestLocale } from "@/common/seo/locale";
import { extractAllowedParams, parsePageNumber } from "@/common/seo/utils/search-params";
import { PARAM_SETS } from "@/common/seo/utils/search-params";
import { generateBlogJsonLd } from "@/common/seo/utils/jsonld-helpers";
import JsonLd from "@/common/seo/jsonld/components";
import Routes from "@/common/defs/routes";

export const generateMetadata = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const qs = extractAllowedParams(searchParams, [...PARAM_SETS.BLOG]);
  const page = parsePageNumber(qs);
  const filters = {
    search: qs.get('search') || undefined,
    category: qs.get('category') || undefined,
  };

  const result = await fetchPostsList(page, 6, locale, filters);

  const metadata = buildBlogListMetadata({
    locale,
    filters,
    total: result?.meta?.totalItems ?? result?.meta?.total ?? null,
  });

  const canonical = buildCanonical(Routes.Posts.ReadAll);
  const hasActiveFilters = Boolean(filters.search || (filters.category && filters.category !== 'all'));

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      title: metadata.title,
      description: metadata.description,
      card: 'summary_large_image',
    },
    ...(hasActiveFilters
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
    alternates: {
      canonical,
    },
  };
};

export default async function BlogPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const locale = detectRequestLocale();
  const qs = extractAllowedParams(searchParams, [...PARAM_SETS.BLOG]);
  const page = parsePageNumber(qs);
  const filters = {
    search: qs.get('search') || undefined,
    category: qs.get('category') || undefined,
  };

  const result = await fetchPostsList(page, 6, locale, filters);

  const { breadcrumbJsonLd, breadcrumbId } = generateBlogJsonLd(locale);

  const initialData = result && result.meta ? {
    items: result.items,
    meta: {
      currentPage: result.meta.currentPage,
      lastPage: result.meta.lastPage,
      totalItems: result.meta.totalItems ?? result.meta.total ?? 0,
    },
    page,
    pageSize: 6,
  } : undefined;

  return (
    <>
      <JsonLd id={breadcrumbId} data={breadcrumbJsonLd} />
      <PostsList initialData={initialData} initialFilters={filters} />
    </>
  );
}
