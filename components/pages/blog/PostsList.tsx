'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import usePosts from '@/modules/posts/hooks/api/usePosts';
import { Post } from '@/modules/posts/defs/types';
import { POST_STATUS } from '@/modules/posts/defs/types';
import { GridLinkOperator, GridFilterItem } from '@/common/hooks/useItems';
import useEmblaCarousel from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';
import BlogHero from './BlogHero';
import CategoryFilter from './CategoryFilter';
import PostsGrid from './PostsGrid';
import Footer from '@/components/common/layout/footer';
import Pagination from '@/components/ui/pagination';

interface PostsListProps {
  initialData?: {
    items: Post[];
    meta: {
      currentPage: number;
      lastPage: number;
      totalItems: number;
    };
    page: number;
    pageSize: number;
  };
}

const PostsList = ({ initialData }: PostsListProps) => {
  const { t } = useTranslation(['blog']);
  const { readAll, items: posts, paginationMeta } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(!!initialData);
  const [isSearching, setIsSearching] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(initialData?.page ?? 1);
  const [pageSize] = useState(initialData?.pageSize ?? 6);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const combinedFilter = useMemo(() => {
    const filterItems: GridFilterItem[] = [
      {
        columnField: 'status',
        value: POST_STATUS.PUBLISHED,
        operatorValue: 'equals',
      }
    ];

    if (searchTerm.trim()) {
      filterItems.push({
        columnField: 'title',
        value: searchTerm.trim(),
        operatorValue: 'contains',
      });
    }

    if (selectedCategory !== 'all') {
      filterItems.push({
        columnField: 'categories.slug',
        value: selectedCategory,
        operatorValue: 'equals',
      });
    }

    return {
      items: filterItems,
      linkOperator: GridLinkOperator.And,
    };
  }, [searchTerm, selectedCategory]);

  // Check if there's an active search or filter
  const hasSearchOrFilter = useMemo(() => {
    return searchTerm.trim() !== '' || selectedCategory !== 'all';
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (initialData) {
      // Skip initial fetch; already hydrated from server
      return;
    }
    setIsSearching(true);
    readAll(currentPage, pageSize, undefined, combinedFilter);
  }, [currentPage, pageSize, combinedFilter, initialData]);

  useEffect(() => {
    if (posts) {
      setIsLoaded(true);
      setIsSearching(false);
    }
  }, [posts]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);

  const categories = useMemo(() => {
    const currentPosts = posts || initialData?.items || [];
    if (!currentPosts || currentPosts.length === 0) {
      return [{ slug: 'all', name: t('blog:filters.all_articles') }];
    }

    const allCategories = currentPosts.flatMap(post => post.categories || []);
    const uniqueCategories = allCategories.filter((category, index, self) =>
      index === self.findIndex(c => c.slug === category.slug)
    );

    return [
      { slug: 'all', name: t('blog:filters.all_articles') },
      ...uniqueCategories.map(category => ({
        slug: category.slug,
        name: category.name
      }))
    ];
  }, [posts, initialData?.items, t]);

  const PostsGridLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-video bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-6">
            {/* Meta info skeleton */}
            <div className="flex items-center gap-4 mb-3">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            
            {/* Excerpt skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
            
            {/* Tags skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            
            {/* Read more skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Hero Section - Always visible */}
      <BlogHero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter - Show when loaded and either has posts or a specific filter is applied */}
        {isLoaded && (posts && posts.length > 0 || selectedCategory !== 'all') && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            emblaRef={emblaRef}
            scrollPrev={scrollPrev}
            scrollNext={scrollNext}
          />
        )}

        {/* Articles Grid or Loader */}
        {isSearching || !isLoaded ? (
          <PostsGridLoader />
        ) : (
          <PostsGrid 
            posts={posts || initialData?.items || []} 
            onClearFilters={handleClearFilters}
            hasSearchOrFilter={hasSearchOrFilter}
          />
        )}

        {/* Pagination - Only show when loaded, not searching, and there are posts */}
        {((paginationMeta || initialData?.meta) && isLoaded && !isSearching && ((posts && posts.length > 0) || (initialData?.items && initialData.items.length > 0))) && (
          <div className="mt-12">
            <Pagination
              currentPage={paginationMeta?.currentPage ?? initialData?.meta?.currentPage ?? 1}
              totalPages={paginationMeta?.lastPage ?? initialData?.meta?.lastPage ?? 1}
              onPageChange={handlePageChange}
              className="py-4"
            />
          </div>
        )}
      </div>

      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PostsList;
