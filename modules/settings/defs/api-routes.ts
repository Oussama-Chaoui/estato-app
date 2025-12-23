import { CrudApiRoutes } from "@/common/defs/types";

const prefix = '/settings';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  GetWebsiteFocus: prefix + '/website-focus',
};

export default ApiRoutes; 