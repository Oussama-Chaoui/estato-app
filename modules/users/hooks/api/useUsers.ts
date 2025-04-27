import useItems, { defaultOptions, UseItems, UseItemsOptions } from "@/common/hooks/useItems";
import { ROLE } from "@/modules/permissions/defs/types";
import { User } from "../../defs/types";
import ApiRoutes from "@/common/defs/api-routes";

export interface CreateOneInput {
  email: string;
  password: string;
  role: ROLE;
}

export interface UpdateOneInput {
  email: string;
  password?: string;
  role: ROLE;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

const useUsers: UseItems<User, CreateOneInput, UpdateOneInput> = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Users;
  const useItemsHook = useItems<User, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  return useItemsHook;
};

export default useUsers;
