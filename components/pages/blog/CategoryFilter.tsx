'use client';

import { Filter, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { EmblaViewportRefType } from 'embla-carousel-react';
import { useTranslation } from 'react-i18next';

interface Category {
  slug: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  emblaRef: EmblaViewportRefType;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  emblaRef,
  scrollPrev,
  scrollNext
}: CategoryFilterProps) => {
  const { t } = useTranslation(['blog']);

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">{t('blog:filters.title')}</h3>
      </div>

      {/* Categories Carousel */}
      <div className="relative px-12">
        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-all backdrop-blur-sm shadow-lg border border-gray-200 bg-white/90 hover:bg-white hover:shadow-xl -ml-2"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 transition-all backdrop-blur-sm shadow-lg border border-gray-200 bg-white/90 hover:bg-white hover:shadow-xl -mr-2"
        >
          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
        </button>

        {/* Carousel Container */}
        <div className="embla overflow-hidden px-0" ref={emblaRef}>
          <div className="embla__container flex gap-3 py-2">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="embla__slide flex-shrink-0"
              >
                <button
                  onClick={() => onCategoryChange(category.slug)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${selectedCategory === category.slug
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-600 shadow-sm'
                    }`}
                >
                  {category.slug === 'all' ? t('blog:filters.all_articles') : category.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
