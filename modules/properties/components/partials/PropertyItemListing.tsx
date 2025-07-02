"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Heart, Share, MapPin, Rotate3D, BedDouble, Bath, Ruler } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Property } from "@/modules/properties/defs/types";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyItemProps {
  property: Property;
}

const PropertyItemListing = ({ property }: PropertyItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [activePriceIndex, setActivePriceIndex] = useState(0);
  const primaryImage = property.images?.find((img) => img.ordering === 0)?.upload?.url
    ?? property.images?.[0]?.upload?.url
    ?? '/no-image.webp';
  const features = property.features?.[0];
  const amenitiesToShow = property.amenities?.slice(0, 3);

  // Price configuration
  const currency = property.currency || 'MAD';
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });

  const availablePrices = [
    ...(property.status === 'for_sale' ? [{
      value: Number(property.salePrice),
      label: 'For Sale',
      type: 'sale'
    }] : []),
    ...(property.monthlyPriceEnabled ? [{
      value: Number(property.monthlyPrice),
      label: 'Monthly Rent',
      type: 'rent'
    }] : []),
    ...(property.dailyPriceEnabled ? [{
      value: Number(property.dailyPrice),
      label: 'Daily Rate',
      type: 'rent'
    }] : [])
  ];



  useEffect(() => {
    if (availablePrices.length > 1) {
      const timer = setInterval(() => {
        setActivePriceIndex((prev) => (prev + 1) % availablePrices.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [availablePrices.length]);

  const getRibbonStatusColor = (status: string) => {
    switch (status) {
      case 'sold': return 'bg-red-600';
      case 'rented': return 'bg-primarySite';
      default: return 'bg-green-600'; 
    }
  };

  return (
    <div className={cn(
      "group w-[340px] bg-white rounded-xl shadow-lg transition-all duration-300",
      "hover:shadow-xl hover:-translate-y-1 overflow-hidden",
      "border border-opacity-5 border-gray-100 backdrop-blur-xs",
      "relative isolate"
    )}>

      <div className="absolute top-[-10px] left-[-10px] w-[100px] overflow-hidden h-[100px] z-20">
        <div className={cn(
          "absolute left-[-34px] top-[22px] w-[140px]",
          "transform -rotate-45",
          "text-center text-xs font-semibold text-white",
          "shadow-md py-1.5",
          getRibbonStatusColor(property.status))
        }>
          {{
            sold: 'Sold',
            rented: 'Rented',
            for_sale: 'Available',
            for_rent: 'Available'
          }[property.status] || 'Available'}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={primaryImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu"
          sizes="(max-width: 640px) 100vw, 340px"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {property.hasVR && (
            <div className="bg-white/90 text-primarySite p-1 rounded-full shadow-sm">
              <Rotate3D className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Fixed Price Display */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
          {property.images && property.images.length > 0 ? (
            <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
              {property.images.length} photo{property.images.length > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-500 px-2 py-1 rounded text-xs">
              No photos
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 bg-white/90 backdrop-blur-xs">
        <div className="mb-4">
          <div className="mb-3 flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-primarySite" />
            <span className={cn(poppins.className, "text-xs font-medium tracking-wide")}>
              {property.location.city}
            </span>
          </div>

          <h3 className={cn(
            poppins.className,
            "text-xl font-bold text-gray-900 mb-2 line-clamp-1"
          )}>
            {property.title}
          </h3>

          {/* Features */}
          {features && (
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <BedDouble className="w-4 h-4 text-primarySite" />
                {features.bedrooms}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Bath className="w-4 h-4 text-primarySite" />
                {features.bathrooms}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Ruler className="w-4 h-4 text-primarySite" />
                {features.area}m²
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenitiesToShow && amenitiesToShow.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {amenitiesToShow.map(amenity => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs"
                >
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Bar */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <button
            className={cn(
              "text-sm bg-primarySite text-white px-5 py-2.5 rounded-lg",
              "hover:bg-primarySite/90 transition-colors font-medium"
            )}
          >
            View Details
          </button>

          <div className="flex items-center gap-3">
            <button
              aria-label="Share property"
              className="text-gray-500 hover:text-primarySite transition-colors"
            >
              <Share className="w-4 h-4" />
            </button>
            <button
              aria-label="Like property"
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "text-gray-500 hover:text-primarySite transition-colors",
                isLiked && "text-primarySite"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyItemListing;