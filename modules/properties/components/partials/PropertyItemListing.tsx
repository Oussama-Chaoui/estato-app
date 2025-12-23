"use client";
import { cn } from "@/components/lib/utils/twMerge";
import { Heart, Share, MapPin, Rotate3D, BedDouble, Bath, Ruler, Star, Camera } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PROPERTY_STATUS, type Property } from "@/modules/properties/defs/types";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { getPriceDisplay } from "@/modules/properties/utils/priceDisplay";
import { useFavoritesManager } from "@/modules/properties/utils/favorites";
import { useTranslation } from "next-i18next";
import { getTranslatedAmenityName } from "@/modules/properties/utils/amenities";
import PropertyRoutes from "@/modules/properties/defs/routes";
import { useDirection } from "@/common/contexts/DirectionContext";
import { useTranslatedText } from "@/modules/properties/utils/translations";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface PropertyItemProps {
  property: Property;
  websiteFocus?: WEBSITE_FOCUS;
}

const PropertyItemListing = ({ property, websiteFocus }: PropertyItemProps) => {
  const { t } = useTranslation(['properties', 'amenities', 'common']);
  const { isRTL } = useDirection();
  const [isLiked, setIsLiked] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const { toggleFavorite, isPropertyFavorited } = useFavoritesManager();
  const getTranslatedText = useTranslatedText();

  // Handle like functionality
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(property, websiteFocus);
  };

  // Handle share functionality
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the correct property URL based on website focus
    const getPropertyUrl = () => {
      const baseUrl = window.location.origin;
      switch (websiteFocus) {
        case WEBSITE_FOCUS.DAILY_RENT:
          return `${baseUrl}${PropertyRoutes.DailyRent.ReadOne.replace('{id}', property.id.toString())}`;
        case WEBSITE_FOCUS.RENT:
          return `${baseUrl}${PropertyRoutes.MonthlyRent.ReadOne.replace('{id}', property.id.toString())}`;
        case WEBSITE_FOCUS.SELLING:
          return `${baseUrl}${PropertyRoutes.HomeSale.ReadOne.replace('{id}', property.id.toString())}`;
        default:
          return `${baseUrl}${PropertyRoutes.DailyRent.ReadOne.replace('{id}', property.id.toString())}`;
      }
    };

    const propertyUrl = getPropertyUrl();
    const shareData = {
      title: getTranslatedText(property.title),
      text: `${getTranslatedText(property.title)} - ${getTranslatedText(property.location.city?.names)}`,
      url: propertyUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(propertyUrl);
        // You could show a toast notification here
        console.log('Property link copied to clipboard');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const primaryImage = property.images?.find((img) => img.ordering === 0)?.upload?.url
    ?? property.images?.[0]?.upload?.url
    ?? '/no-image.webp';
  const features = property.features?.[0];
  const amenitiesToShow = property.amenities?.slice(0, 3);

  // Check if property is already liked on component mount and listen for updates
  useEffect(() => {
    const checkIfLiked = () => {
      setIsLiked(isPropertyFavorited(property.id));
    };

    checkIfLiked();

    // Listen for custom favorites update event
    const handleFavoritesUpdated = (e: CustomEvent) => {
      const updatedFavorites = e.detail;
      const isStillFavorited = updatedFavorites.some((fav: any) => fav.id === property.id);
      setIsLiked(isStillFavorited);
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);
    };
  }, [property.id, isPropertyFavorited]);

  const priceData = getPriceDisplay({
    websiteFocus: websiteFocus || WEBSITE_FOCUS.ALL,
    salePrice: property.salePrice,
    monthlyPrice: property.monthlyPrice,
    dailyPrice: property.dailyPrice,
    monthlyPriceEnabled: property.monthlyPriceEnabled,
    dailyPriceEnabled: property.dailyPriceEnabled,
    currency: property.currency || 'MAD',
    t
  });

  return (
    <div
      className={cn(
        "group w-full sm:max-w-[320px] bg-white rounded-xl shadow-lg transition-all duration-200",
        "hover:shadow-xl hover:-translate-y-1 overflow-hidden",
        "border backdrop-blur-sm relative isolate flex flex-col h-full",
        property.featured
          ? "border-2 border-amber-400/40 shadow-xl"
          : "border border-opacity-10 border-white"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Image Section with Parallax Effect */}
      <div className="relative h-[280px] sm:h-[240px] lg:h-[280px] xl:h-[320px] overflow-hidden flex-shrink-0">
        <Image
          src={primaryImage}
          alt={getTranslatedText(property.title)}
          fill
          className={cn(
            "object-cover transition-all duration-700",
            isHover ? "scale-105" : "scale-100",
            "transform-gpu"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          priority
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          {/* Featured Badge */}
          {property.featured && (
            <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg border border-white/50 hover:scale-105 transition-transform duration-200">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          )}

          {property.hasVR && (
            <div className="bg-white/90 backdrop-blur-sm text-primary-500 p-1.5 rounded-full shadow-lg">
              <Rotate3D className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Floating Price Tag */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full shadow-lg">
          <span className="font-bold tracking-wide text-sm">
            {priceData.price}
            {priceData.timeUnit && (
              <span className="text-xs">{priceData.timeUnit}</span>
            )}
          </span>
        </div>

        {/* Photo Count Badge */}
        <div className="absolute bottom-8 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs z-10 flex items-center gap-1">
          <Camera className="w-3 h-3 rtl:transform-none" />
          <span>
            {property.images && property.images.length > 0 ? (
              property.images.length
            ) : (
              '0'
            )}
          </span>
        </div>

        {/* Interactive View Details Button */}
        <button
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2",
            "text-white bg-black/90 backdrop-blur-sm px-6 py-2 rounded-lg",
            "border border-white/20 shadow-xl",
            "transition-all duration-500 transform",
            "hover:scale-105 hover:bg-black/100 hover:shadow-2xl",
            "flex items-center gap-2 font-semibold tracking-wider text-sm",
            isHover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {t('property_item.view_details')}
          <svg className={`w-3 h-3 animate-pulse ${isRTL ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Content Section - Now properly structured to push buttons to bottom */}
      <div className="flex flex-col flex-1 relative">
        {/* Glassmorphism Overlay Effect */}
        <div className="absolute -top-6 left-0 right-0 h-8 bg-gradient-to-b from-white/80 to-white rounded-t-xl backdrop-blur-sm" />

        {/* Main Content Area */}
        <div className="flex-1 pt-2 px-3 sm:px-4 pb-3 bg-white/80 backdrop-blur-sm rounded-t-xl relative z-10">
          <div className="mb-2 sm:mb-3 flex items-center gap-2 text-slate-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500" />
            <span className={cn(poppins.className, "text-xs font-medium tracking-wide")}>
              {getTranslatedText(property.location.city?.names)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <h3
              className={cn(
                poppins.className,
                "text-base sm:text-lg font-bold text-gray-900 transition-colors",
                "group-hover:text-primary-500 line-clamp-1 flex-1"
              )}
            >
              {getTranslatedText(property.title)}
            </h3>
          </div>

          {/* Features */}
          {features && (
            <div className="flex gap-2 sm:gap-3 mb-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <BedDouble className="w-3 h-3 text-primary-500" />
                <span className="font-medium">{features.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Bath className="w-3 h-3 text-primary-500" />
                <span className="font-medium">{features.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Ruler className="w-3 h-3 text-primary-500" />
                <span className="font-medium">{features.area}{t('common:area_unit')}</span>
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenitiesToShow && amenitiesToShow.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4">
              {amenitiesToShow.map(amenity => (
                <div
                  key={amenity.id}
                  className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm px-1.5 sm:px-2 py-1 rounded-full text-xs font-medium"
                >
                  <span>{getTranslatedAmenityName(amenity.name, t)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Bar - Always at bottom */}
        <div className="mt-auto bg-white/90 backdrop-blur-sm border-t border-gray-100 px-3 sm:px-4 py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={handleShare}
              className={cn(
                "flex items-center gap-2 sm:gap-1.5 text-gray-500 transition-all hover:text-primary-500",
                "group/inner relative px-2 py-1 rounded-lg hover:bg-gray-50/50"
              )}
            >
              <Share className="w-5 h-5 sm:w-4 sm:h-4 transition-transform group-hover/inner:scale-110" />
              <span className="text-xs sm:text-xs font-medium">{t('property_item.share')}</span>
            </button>

            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2 sm:gap-1.5 transition-all",
                isLiked ? "text-primary-500" : "text-gray-500 hover:text-primary-400",
                "px-2 py-1 rounded-lg hover:bg-gray-50/50"
              )}
            >
              <Heart
                className={cn("w-5 h-5 sm:w-4 sm:h-4 transition-all", isLiked ? "fill-current animate-heartbeat" : "")}
              />
              <span className="text-xs sm:text-xs font-medium">{t('property_item.like')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none",
        property.featured
          ? "bg-gradient-to-r from-amber-400/10 via-orange-500/8 to-transparent opacity-100"
          : "bg-gradient-to-r from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100"
      )} />

      {/* Sold Overlay */}
      {property.status === PROPERTY_STATUS.SOLD && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-30">
          <div className="text-center transform -rotate-12">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-1.5 rounded-full shadow-xl border-2 border-white/20">
              <span className="text-xs font-semibold tracking-wide">{t('property_item.sold')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyItemListing;