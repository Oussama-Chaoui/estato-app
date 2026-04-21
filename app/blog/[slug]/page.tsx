import type { Metadata } from "next";
import BlogPost from "@/components/pages/blog/BlogPost";
import { buildBlogPostMetadata } from "@/common/seo/builders/blog";
import { buildCanonical } from "@/common/seo/url";
import { fetchPostBySlug } from "@/common/seo/fetchers";
import { detectRequestLocale } from "@/common/seo/locale";
import { generateBlogPostJsonLd } from "@/common/seo/utils/blog-helpers";
import JsonLd from "@/common/seo/jsonld/components";
import Routes from "@/common/defs/routes";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
  const locale = detectRequestLocale();
  const post = await fetchPostBySlug(params.slug, locale);
  const metadata = buildBlogPostMetadata(post, locale);
  
  if (!post) {
    return {
      title: metadata.notFound.title,
      description: metadata.notFound.description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = buildCanonical(Routes.Posts.ReadOne.replace('{slug}', params.slug));

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
    alternates: {
      canonical,
    },
    other: {
      'article:published_time': metadata.article?.publishedTime,
      'article:author': metadata.article?.authors?.[0],
      'article:section': metadata.article?.section,
      ...(metadata.article?.tags && { 'article:tag': metadata.article.tags.join(', ') }),
    },
  };
};

export const revalidate = 300;

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const locale = detectRequestLocale();
  const post = await fetchPostBySlug(params.slug, locale);

  if (!post) {
    notFound();
  }

  const { blogPostJsonLd, breadcrumbJsonLd, blogPostId, breadcrumbId } = generateBlogPostJsonLd(
    post,
    params.slug,
    locale
  );

  return (
    <>
      {blogPostJsonLd && <JsonLd id={blogPostId} data={blogPostJsonLd} />}
      <JsonLd id={breadcrumbId} data={breadcrumbJsonLd} />
      <BlogPost initialPost={post} />
    </>
  );
}
