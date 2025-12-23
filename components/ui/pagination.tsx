import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './button';
import { useDirection } from '@/common/contexts/DirectionContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const { isRTL } = useDirection();
  const getVisiblePages = () => {
    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1; // Reduced from 2 to 1 for more compact display
    const range = [];
    const rangeWithDots = [];

    // Get the range of pages around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add the range of pages around current page
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Go to First Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="p-2"
        title="Go to first page"
      >
        <ChevronsLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>

      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2"
        title="Previous page"
      >
        <ChevronLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`min-w-[40px] ${currentPage === page
                  ? 'cursor-default pointer-events-none bg-primary-500 text-white border-primary-500 hover:bg-primary-500 hover:text-white'
                  : ''
                  }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2"
        title="Next page"
      >
        <ChevronRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>

      {/* Go to Last Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="p-2"
        title="Go to last page"
      >
        <ChevronsRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
};

export default Pagination;
