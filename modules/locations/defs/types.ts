import { CrudObject } from "@/common/defs/types";

export interface Location extends CrudObject {
  cityId: number;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  latitude: number;
  longitude: number;
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
}
