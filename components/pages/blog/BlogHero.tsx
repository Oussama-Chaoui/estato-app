'use client';

import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BlogHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const BlogHero = ({ searchTerm, onSearchChange }: BlogHeroProps) => {
  const { t } = useTranslation(['blog']);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center pt-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            {t('blog:hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            {t('blog:hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative animate-fade-in-delay-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('blog:hero.search_placeholder')}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-500 shadow-xl bg-white/95 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default BlogHero;
