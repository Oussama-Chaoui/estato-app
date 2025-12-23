import { Id } from "@/common/defs/types";
import useItems, { defaultOptions, UseItemsOptions, UseItemsHook } from "@/common/hooks/useItems";
import { Agent } from "../../defs/types";
import ApiRoutes from "@/common/defs/api-routes";
import useApi, { ApiResponse, FetchApiOptions } from "@/common/hooks/useApi";

export interface CreateOneInput {
  licenseNumber: string;
  experience: number;
  bio: string;
  agencyName: string;
  agencyAddress: string;
  userId: Id;
}

export interface UpdateOneInput {
  licenseNumber: string;
  experience: number;
  bio: string;
  agencyName: string;
  agencyAddress: string;
  userId: Id;
}

export interface ApplyAsAgentInput {
  name: string;
  email?: string;
  phone: string;
}

export interface ApplyAsAgentResponse {
  success: boolean;
  message: string;
}

export interface UseAgentsHook extends UseItemsHook<Agent, CreateOneInput, UpdateOneInput> {
  applyAsAgent: (
    input: ApplyAsAgentInput,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<ApplyAsAgentResponse>>;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

export type UseAgents = (
  opts?: UseItemsOptions
) => UseAgentsHook;

const useAgents: UseAgents = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Agents;
  const useItemsHook = useItems<Agent, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  const fetchApi = useApi();

  const applyAsAgent = async (
    input: ApplyAsAgentInput,
    options?: FetchApiOptions
  ) => {
    return fetchApi<ApplyAsAgentResponse>(apiRoutes.ApplyAsAgent, {
      method: "POST",
      data: input,
      ...options,
    });
  };

  const hook: UseAgentsHook = {
    ...useItemsHook,
    applyAsAgent,
  };

  return hook;
};

export default useAgents;
