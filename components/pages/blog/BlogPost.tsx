'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import usePosts from '@/modules/posts/hooks/api/usePosts';
import { Post } from '@/modules/posts/defs/types';
import { Calendar, User, Tag, Clock, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Routes from '@/common/defs/routes';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import useUtils from '@/common/hooks/useUtils';

interface BlogPostProps {
  initialPost?: Post | null;
}

const BlogPost = ({ initialPost }: BlogPostProps) => {
  const params = useParams();
  const slug = params.slug as string;
  const { readOneBySlug } = usePosts();
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(['blog']);
  const { getDateFnsLocale } = useUtils();

  // Format date with proper locale
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy', { locale: getDateFnsLocale() });
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const processHtmlContent = (htmlContent: string) => {
    // This is a simple HTML processor - you might want to use a proper HTML parser
    return htmlContent;
  };

  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || '',
          text: post?.excerpt || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
        alert(t('blog:article.link_copied'));
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  useEffect(() => {
    if (initialPost) {
      // Skip fetch; already hydrated from server
      return;
    }
    fetchPost();
  }, [slug, initialPost]);

  const fetchPost = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const response = await readOneBySlug(slug);
      console.log('Blog post response:', response);

      if (response.success && response.data?.item) {
        setPost(response.data.item);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('blog:article.not_found.title')}</h1>
          <p className="text-gray-600 mb-6">{t('blog:article.not_found.description')}</p>
          <Link
            href={Routes.Posts.ReadAll}
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('blog:article.not_found.back_button')}
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(post.content || '');

  return (
    <div className="min-h-screen bg-gray-50 mt-[75px]">
      {/* Article Content */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category: { id: number; name: string }) => (
                  <span
                    key={category.id}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors cursor-default"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-gray-600 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{post.publishedAt ? formatDate(post.publishedAt) : 'N/A'}</span>
              </div>

              {post.agent?.user?.name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.agent.user.name}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readTime} {t('blog:posts.min_read')}</span>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={shareArticle}
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              {t('blog:article.share_article')}
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8">
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: processHtmlContent(post.content || '')
            }}
            className="text-gray-800 leading-relaxed"
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('blog:article.tags')}</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: { id: number; name: string }) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author info */}
        {post.agent?.user && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{post.agent.user.name}</h3>
                <p className="text-gray-600">{post.agent.agencyName}</p>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogPost;
