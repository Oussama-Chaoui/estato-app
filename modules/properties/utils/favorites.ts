import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";
import { Property } from "@/modules/properties/defs/types";

export interface FavoriteProperty {
  id: string | number;
  title: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  firstImage: string;
  websiteFocus: WEBSITE_FOCUS;
  prices: {
    salePrice: number;
    monthlyPrice: number;
    dailyPrice: number;
    monthlyPriceEnabled: boolean;
    dailyPriceEnabled: boolean;
    currency?: string;
  };
  location: {
    city?: {
      id: number;
      regionId: number;
      names: {
        en?: string;
        fr: string;
        es?: string;
        ar: string;
      };
      slug: string;
      region?: {
        id: number;
        names: {
          en?: string;
          fr: string;
          es?: string;
          ar: string;
        };
        slug: string;
      };
    };
    region?: {
      id: number;
      names: {
        en?: string;
        fr: string;
        es?: string;
        ar: string;
      };
      slug: string;
    };
  };
  features?: {
    id: string | number;
    propertyId: string | number;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    floors: number;
    area: number;
  };
  status: string;
  type: string;
}

export const useFavoritesManager = () => {
  const getFavorites = (): FavoriteProperty[] => {
    return JSON.parse(localStorage.getItem('favoriteProperties') || '[]');
  };

  const isPropertyFavorited = (propertyId: string | number): boolean => {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.id === propertyId);
  };

  const addToFavorites = (property: Property, websiteFocus?: WEBSITE_FOCUS) => {
    const favoriteProperty: FavoriteProperty = {
      id: property.id,
      title: property.title,
      firstImage: property.images?.find((img) => img.ordering === 0)?.upload?.url
        ?? property.images?.[0]?.upload?.url
        ?? '/no-image.webp',
      websiteFocus: websiteFocus || WEBSITE_FOCUS.ALL,
      prices: {
        salePrice: property.salePrice,
        monthlyPrice: property.monthlyPrice,
        dailyPrice: property.dailyPrice,
        monthlyPriceEnabled: property.monthlyPriceEnabled,
        dailyPriceEnabled: property.dailyPriceEnabled,
        currency: property.currency
      },
      location: {
        city: property.location.city || undefined,
        region: property.location.region || undefined
      },
      features: property.features,
      status: property.status,
      type: property.type
    };

    const existingFavorites = getFavorites();
    const isAlreadyFavorited = existingFavorites.some((fav) => fav.id === property.id);

    if (!isAlreadyFavorited) {
      const updatedFavorites = [...existingFavorites, favoriteProperty];
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: updatedFavorites }));
      return true;
    }
    return false;
  };

  const removeFromFavorites = (propertyId: string | number) => {
    const existingFavorites = getFavorites();
    const updatedFavorites = existingFavorites.filter((fav) => fav.id !== propertyId);
    localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: updatedFavorites }));
    return true;
  };

  const toggleFavorite = (property: Property, websiteFocus?: WEBSITE_FOCUS) => {
    const isFavorited = isPropertyFavorited(property.id);
    if (isFavorited) {
      return removeFromFavorites(property.id);
    } else {
      return addToFavorites(property, websiteFocus);
    }
  };

  return {
    getFavorites,
    isPropertyFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
  };
}; 