import { WEBSITE_FOCUS } from '../defs/types';

export interface WebsiteFocusContent {
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  searchPlaceholder: string;
  filterLabel: string;
}

export const getWebsiteFocusContent = (focus: WEBSITE_FOCUS | null): WebsiteFocusContent => {
  if (!focus) {
    return getDefaultContent();
  }

  switch (focus) {
    case WEBSITE_FOCUS.DAILY_RENT:
      return {
        tagline: "Vacation Rentals",
        title: "Book Your Perfect",
        subtitle: "Getaway Today",
        description: "Discover amazing vacation rentals for your next adventure. Book instantly and enjoy your stay.",
        ctaText: "Book Now",
        searchPlaceholder: "Where do you want to stay?",
        filterLabel: "Check-in/Check-out dates"
      };
    case WEBSITE_FOCUS.RENT:
      return {
        tagline: "Rental Properties",
        title: "Find Your Perfect",
        subtitle: "Rental Home",
        description: "Browse our selection of quality rental properties. Find your ideal home with flexible lease terms.",
        ctaText: "Browse Rentals",
        searchPlaceholder: "Where do you want to live?",
        filterLabel: "Move-in date"
      };
    case WEBSITE_FOCUS.SELLING:
      return {
        tagline: "Properties for Sale",
        title: "Find Your Dream",
        subtitle: "Home Today",
        description: "Explore our exclusive listings of properties for sale. Find your perfect home with expert guidance.",
        ctaText: "View Properties",
        searchPlaceholder: "Where do you want to buy?",
        filterLabel: "Price range"
      };
    case WEBSITE_FOCUS.ALL:
    default:
      return getDefaultContent();
  }
};

const getDefaultContent = (): WebsiteFocusContent => {
  return {
    tagline: "Featured Property",
    title: "Find Your Dream",
    subtitle: "Home Today",
    description: "Explore our exclusive listings to discover the perfect property for you and your family.",
    ctaText: "View Listings",
    searchPlaceholder: "Where do you want to go?",
    filterLabel: "Property type"
  };
}; 