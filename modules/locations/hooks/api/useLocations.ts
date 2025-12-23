import ApiRoutes from "@/common/defs/api-routes";
import useItems, { defaultOptions, UseItems, UseItemsOptions } from "@/common/hooks/useItems";
import { Location } from "../../defs/types";

export interface CreateOneInput {
  cityId: number;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  latitude: number;
  longitude: number;
}

export interface UpdateOneInput {
  cityId: number;
  streetAddress: {
    en?: string;
    fr: string;
    es?: string;
    ar: string;
  };
  latitude: number;
  longitude: number;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useLocations: UseItems<Location, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Locations;
  const useItemsHook = useItems<Location, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useLocations;
