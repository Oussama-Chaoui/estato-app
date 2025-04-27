"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Heart, Share, MapPin, Rotate3D } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import type { Property } from "@/modules/properties/defs/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyItemProps {
  property: Property;
  onInquire?: () => void;
}

const PropertyItemListing = ({ property, onInquire }: PropertyItemProps) => {
  const [isHover, setIsHover] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: property.currency || 'USD',
    maximumFractionDigits: 0
  }).format(property.salePrice);

  // Get primary image URL or placeholder
  const primaryImage = property.images?.[0]?.upload?.url || '/placeholder.jpg';
  const locationText = property.location.city;

  return (
    <div
      className={cn(
        "group w-[340px] bg-white rounded-xl shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 overflow-hidden",
        "border border-opacity-5 border-gray-100 backdrop-blur-xs",
        "relative isolate"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Image Section with Subtle Parallax */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHover ? "scale-103" : "scale-100",
            "transform-gpu"
          )}
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        {/* VR Icon */}
        {property.hasVR && (
          <div className="absolute top-3 left-3 bg-white/90 text-primarySite p-1 rounded-full shadow-sm">
            <Rotate3D className="w-6 h-6" />
          </div>
        )}

        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-primarySite/95 text-white px-3 py-1.5 rounded-lg shadow-sm">
          <span className="font-medium tracking-wide text-sm">{formattedPrice}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 bg-white/90 backdrop-blur-xs">
        <div className="mb-3 flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-primarySite" />
          <span className={cn(poppins.className, "text-xs font-medium tracking-wide")}>
            {locationText}
          </span>
        </div>

        <h3
          className={cn(
            poppins.className,
            "text-xl font-bold text-gray-900 mb-1.5 transition-colors",
            "group-hover:text-primarySite line-clamp-1"
          )}
        >
          {property.title}
        </h3>

        <p
          className={cn(
            poppins.className,
            "text-gray-600 text-sm leading-snug mb-4 line-clamp-2"
          )}
        >
          {property.description}
        </p>

        {/* Interaction Bar */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <button
            onClick={onInquire}
            className={cn(
              "text-sm bg-primarySite text-white px-5 py-2.5 rounded-lg",
              "hover:bg-primarySite/90 transition-colors",
              "flex items-center gap-2 font-medium"
            )}
          >
            View Details
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <button
              className={cn(
                "text-gray-500 hover:text-primarySite transition-colors",
                "flex items-center gap-1.5 text-xs font-medium"
              )}
            >
              <Share className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "text-gray-500 hover:text-primarySite transition-colors",
                "flex items-center gap-1.5 text-xs font-medium",
                isLiked && "text-primarySite"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-br from-primarySite/5 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default PropertyItemListing;