import { CrudObject, Id } from "@/common/defs/types";
import { Agent } from "@/modules/agents/defs/types";
import { Amenity } from "@/modules/amenities/defs/types";
import { Location } from "@/modules/locations/defs/types";
import { Upload } from "@/modules/uploads/defs/types";
import { Client } from "@/modules/users/defs/types";

export interface CreateOneInput {
  title: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  description: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  monthlyPrice: number;
  salePrice: number;
  dailyPrice: number;
  dailyPriceEnabled: boolean;
  currency: string;
  monthlyPriceEnabled: boolean;
  type: string;
  locationId?: Id;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  yearBuilt: number;
  hasVR: boolean;
  agentIds: Id[];
  amenityIds: Id[];
  furnishingStatus: FURNISHING_STATUS;
  images: {
    imageId: Id;
    caption: string;
    ordering: number;
    /** client-only preview URL – server will ignore */
    preview?: string;
  }[];
  features: {
    id: Id;
    bedrooms: number;
    bathrooms: number;
    area: number;
    garages: number;
    floors: number;
  };
  location: {
    id: Id;
    cityId: number;
    streetAddress: {
      en?: string;
      fr: string;
      es?: string;
      ar: string;
    };
    latitude: number;
    longitude: number;
  };
}

export interface UpdateOneInput {
  title: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  description: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  monthlyPrice: number;
  salePrice: number;
  dailyPrice: number;
  dailyPriceEnabled: boolean;
  currency: string;
  monthlyPriceEnabled: boolean;
  type: string;
  locationId: Id;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  yearBuilt: number;
  hasVR: boolean;
  agentIds: Id[];
  amenityIds: Id[];
  furnishingStatus: FURNISHING_STATUS;
  images: {
    imageId: Id;
    caption: string;
    ordering: number;
  }[];
}

export enum PROPERTY_STATUS {
  FOR_SALE = 'FOR_SALE',
  FOR_RENT = 'FOR_RENT',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}

export enum PROPERTY_TYPE {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  STUDIO = 'STUDIO',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
  OFFICE = 'OFFICE',
  GARAGE = 'GARAGE',
  MANSION = 'MANSION',
}

export enum FURNISHING_STATUS {
  FURNISHED = 'FURNISHED',
  UNFURNISHED = 'UNFURNISHED',
  SEMI_FURNISHED = 'SEMI_FURNISHED',
}

export interface Feature extends CrudObject {
  id: Id;
  propertyId: Id;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  floors: number;
  area: number;
}

export interface Description extends CrudObject {
  id: Id;
  propertyId: Id;
  content: string;
  ordering: number;
}

export interface Rental extends CrudObject {
  propertyId: Id;
  clientId: Id;
  agentId: Id;
  startDate: Date;
  endDate: Date;
  price: number;
  renter?: Client;
  agent?: Agent;
  details?: string;
}

export interface PropertyImage {
  propertyId: Id;
  imageId: Id;
  ordering: number;
  caption: string | null;
  upload: Upload
}

export interface Property extends CrudObject {
  title: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  description: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  salePrice: number;
  monthlyPrice: number;
  dailyPrice: number;
  dailyPriceEnabled: boolean;
  monthlyPriceEnabled: boolean;
  currency: string;
  type: PROPERTY_TYPE;
  status: PROPERTY_STATUS;
  locationId: Id;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  yearBuilt: number;
  hasVR: boolean;
  featured?: boolean;
  furnishingStatus: FURNISHING_STATUS;
  features: Feature;
  amenities: Amenity[];
  agents: Agent[];
  location: Location;
  descriptions: Description[];
  images: PropertyImage[];
  rental?: Rental[];
}
