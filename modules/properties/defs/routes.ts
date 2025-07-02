import { CrudAppRoutes } from "@/common/defs/types";

const prefix = '/listing';
const Routes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
};

export default Routes;
