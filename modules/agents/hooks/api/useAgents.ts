import { Id } from "@/common/defs/types";
import useItems, { defaultOptions, UseItems, UseItemsOptions } from "@/common/hooks/useItems";
import { Agent } from "../../defs/types";
import ApiRoutes from "@/common/defs/api-routes";

export interface CreateOneInput {
  licenseNumber: string;
  experience: number;
  bio: string;
  photoId: Id;
  agencyName: string;
  agencyAddress: string;
  userId: Id;
}

export interface UpdateOneInput {
  licenseNumber: string;
  experience: number;
  bio: string;
  photoId: Id;
  agencyName: string;
  agencyAddress: string;
  userId: Id;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useAgents: UseItems<Agent, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Agents;
  const useItemsHook = useItems<Agent, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useAgents;
