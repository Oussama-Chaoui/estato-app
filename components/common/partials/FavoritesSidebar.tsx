"use client";

import React, { useState, useEffect } from "react";
import { Heart, MapPin, BedDouble, Bath, Ruler, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/components/lib/utils/twMerge";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getPriceDisplay } from "@/modules/properties/utils/priceDisplay";
import PropertyRoutes from "@/modules/properties/defs/routes";
import { useTranslation } from "next-i18next";
import { useDirection } from "@/common/contexts/DirectionContext";
import { useTranslatedText } from "@/modules/properties/utils/translations";
import { useFavoritesManager, type FavoriteProperty } from "@/modules/properties/utils/favorites";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface FavoritesSidebarProps {
  trigger: React.ReactNode;
  navigationLinks: Array<{ href: string; label: string }>;
}

const FavoritesSidebar = ({ trigger, navigationLinks }: FavoritesSidebarProps) => {
  const { t } = useTranslation(['favorites', 'common']);
  const { isRTL } = useDirection();
  const getTranslatedText = useTranslatedText();
  const { removeFromFavorites } = useFavoritesManager();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const isRemovingRef = React.useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen && (isRemoving || isRemovingRef.current)) {
      setTimeout(() => {
        setIsOpen(true);
      }, 0);
    }
  }, [isOpen, isRemoving]);

  const memoizedTrigger = React.useMemo(() => trigger, []);

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
      setFavorites(storedFavorites);
    };

    loadFavorites();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favoriteProperties') {
        loadFavorites();
      }
    };

    const handleFavoritesUpdated = (e: CustomEvent) => {
      setFavorites(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdated as EventListener);
    };
  }, []);

  const removeFavorite = (propertyId: string | number) => {
    removeFromFavorites(propertyId);
    
    setTimeout(() => {
      isRemovingRef.current = false;
      setIsRemoving(false);
    }, 500);
  };

  const FavoritePropertyItem = ({ favorite, onRemove }: { favorite: FavoriteProperty; onRemove: (id: string) => void }) => {
    const router = useRouter();


    const handlePropertyClick = () => {
      setIsOpen(false);
      router.push(getPropertyRoute());
    };
    const displayPrice = () => {
      const { prices } = favorite;

      const priceData = getPriceDisplay({
        websiteFocus: favorite.websiteFocus,
        salePrice: prices.salePrice,
        monthlyPrice: prices.monthlyPrice,
        dailyPrice: prices.dailyPrice,
        monthlyPriceEnabled: prices.monthlyPriceEnabled,
        dailyPriceEnabled: prices.dailyPriceEnabled,
        currency: prices.currency,
        t
      });

      return (
        <span>
          {priceData.price}
          {priceData.timeUnit && (
            <span className="text-xs">{priceData.timeUnit}</span>
          )}
        </span>
      );
    };

    const getPropertyRoute = () => {
      switch (favorite.websiteFocus) {
        case 'DAILY_RENT':
          return PropertyRoutes.DailyRent.ReadOne.replace('{id}', favorite.id.toString());
        case 'RENT':
          return PropertyRoutes.MonthlyRent.ReadOne.replace('{id}', favorite.id.toString());
        case 'SELLING':
          return PropertyRoutes.HomeSale.ReadOne.replace('{id}', favorite.id.toString());
        default:
          return PropertyRoutes.DailyRent.ReadOne.replace('{id}', favorite.id.toString());
      }
    };

    return (
      <div className="relative">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div
            className="flex items-start gap-3 flex-1 cursor-pointer"
            onClick={() => {
              handlePropertyClick();
            }}
          >
            <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={favorite.firstImage}
                alt={getTranslatedText(favorite.title)}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-semibold text-gray-900 text-sm line-clamp-1 mb-1",
                isRTL ? "pl-8" : "pr-8"
              )}>
                {getTranslatedText(favorite.title)}
              </h4>

              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{getTranslatedText(favorite.location?.city?.names)}</span>
              </div>

              <div className="flex gap-2 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3 h-3" />
                  <span>{favorite.features?.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3 h-3" />
                  <span>{favorite.features?.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  <span>{favorite.features?.area}{t('common:area_unit')}</span>
                </div>
              </div>

              <div className="text-sm font-semibold text-primary-600">
                {displayPrice()}
              </div>
            </div>
          </div>
        </div>

        <button
          className={cn(
            "absolute top-2 p-1 text-gray-400 hover:text-red-500 transition-colors bg-white/80 rounded-full",
            isRTL ? "left-2" : "right-2"
          )}
          onPointerDownCapture={(e) => {
            e.stopPropagation();
            (e.nativeEvent as PointerEvent).stopImmediatePropagation();
          }}
          onClickCapture={(e) => {
            e.stopPropagation();
            (e.nativeEvent as MouseEvent).stopImmediatePropagation();

            onRemove(String(favorite.id));
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (isRemoving && !open) {
          setTimeout(() => {
            setIsOpen(true);
          }, 0);
          return;
        }

        setIsOpen(open);
      }}
    >
      <SheetTrigger asChild>
        {memoizedTrigger}
      </SheetTrigger>
      <SheetContent 
        side={isRTL ? "left" : "right"}
        isRTL={isRTL} 
        className={cn(
          "w-96 bg-white border-gray-200",
          isRTL ? "border-r pl-4" : "border-l pl-4"
        )}
      >
        <div className="w-full h-full flex flex-col pt-8">
          <div className={cn("mb-8", isRTL ? "text-right" : "text-left")}>
            <h2 className={cn(
              "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", 
              poppins.className
            )}>
              {t('title')}
            </h2>
            <p className="text-gray-500 mt-2">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex-1">
            {favorites.length > 0 ? (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {favorites.map((favorite) => (
                  <FavoritePropertyItem
                    key={favorite.id}
                    favorite={favorite}
                    onRemove={removeFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('no_favorites.title')}</h3>
                  <p className="text-gray-500 mb-6 max-w-sm">{t('no_favorites.description')}</p>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      router.push(navigationLinks[0]?.href || "/");
                    }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {t('no_favorites.browse_button')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FavoritesSidebar; 