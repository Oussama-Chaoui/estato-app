'use client';

import { Calendar, Clock, User, Tag, ChevronRight, Search, BookOpen } from 'lucide-react';
import { Post } from '@/modules/posts/defs/types';
import Link from 'next/link';
import Routes from '@/common/defs/routes';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import useUtils from '@/common/hooks/useUtils';

interface PostsGridProps {
  posts: Post[];
  onClearFilters?: () => void;
  hasSearchOrFilter?: boolean;
}

const PostsGrid = ({ posts, onClearFilters, hasSearchOrFilter = false }: PostsGridProps) => {
  const { t } = useTranslation(['blog']);
  const { getDateFnsLocale } = useUtils();

  // Format date with proper locale
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy', { locale: getDateFnsLocale() });
  };

  if (posts.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={Routes.Posts.ReadOne.replace('{slug}', post.slug)}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up block h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <article className="flex flex-col h-full">
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={post.image?.url || '/placeholder-image.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category badge */}
                {post.categories.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.categories[0].name}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Meta info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{post.agent?.user?.name || t('blog:posts.unknown_author')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>5 {t('blog:posts.min_read')}</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-6 line-clamp-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.slice(0, 3).map((tag: { id: number; name: string }) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium"
                    >
                      <Tag className="h-3 w-3" />
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Additional spacing */}
                <div className="flex-grow"></div>

                {/* Read more button */}
                <div className="group/btn flex items-center gap-2 text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors duration-300 mt-auto">
                  {t('blog:posts.read_more')}
                  <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    );
  }

  // Show different messages based on whether there's an active search/filter
  if (hasSearchOrFilter) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Search className="h-16 w-16 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('blog:posts.no_articles_found')}</h3>
        <p className="text-gray-600 mb-6">{t('blog:posts.no_articles_description')}</p>
        <button
          onClick={onClearFilters}
          className="bg-primary-500 text-white px-6 py-3 rounded-full hover:bg-primary-600 transition-colors duration-300"
        >
          {t('blog:filters.clear_filters')}
        </button>
      </div>
    );
  }

  // Show message when no articles are available in the system
  return (
    <div className="text-center py-16">
      <div className="mb-6">
        <BookOpen className="h-20 w-20 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{t('blog:posts.no_articles_available')}</h3>
      <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
        {t('blog:posts.no_articles_available_description')}
      </p>
    </div>
  );
};

export default PostsGrid;
