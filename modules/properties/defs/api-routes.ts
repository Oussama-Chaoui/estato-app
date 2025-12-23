import { CrudApiRoutes } from "@/common/defs/types";

const prefix = '/properties';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  Availability : prefix + '/availability/{id}',
  SearchByFilters: prefix + '/search/filters',
};

export default ApiRoutes;
