import ApiRoutes from "@/common/defs/api-routes";
import useItems, { defaultOptions, UseItems, UseItemsOptions } from "@/common/hooks/useItems";

export interface CreateOneInput {
  region: string;
  city: string;
  laltitude: number;
  longitude: number;
}

export interface UpdateOneInput {
  region: string;
  city: string;
  laltitude: number;
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
