import useItems, { defaultOptions, UseItems, UseItemsOptions } from "@/common/hooks/useItems";
import { Amenity } from "../../defs/types";
import ApiRoutes from "@/common/defs/api-routes";

export interface CreateOneInput {
  name: string;
  icon: string;
}

export interface UpdateOneInput {
  name: string;
  icon: string;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useAmenities: UseItems<Amenity, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Amenities;
  const useItemsHook = useItems<Amenity, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useAmenities;
