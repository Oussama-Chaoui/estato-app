"use client";
import { cn } from "@/components/lib/utils/twMerge";

const PropertyItemSkeleton = () => {
  return (
    <div className={cn(
      "group w-full sm:max-w-[320px] bg-white rounded-xl shadow-lg overflow-hidden",
      "border border-gray-100", // Simplified border
      "relative isolate flex flex-col h-full"
    )}>
      {/* Image Section Skeleton */}
      <div className="relative h-[280px] sm:h-[240px] lg:h-[280px] xl:h-[320px] overflow-hidden flex-shrink-0">
        <div className="w-full h-full bg-gray-100 animate-pulse" /> {/* Lighter background */}
        
        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
        
        {/* View Details Button Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 space-y-3">
        {/* Price Skeleton */}
        <div className="flex items-center justify-between">
          <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Location Skeleton */}
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Features Skeleton */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Amenities Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="p-4 pt-0">
        <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

export default PropertyItemSkeleton;
