import { CrudApiRoutes } from '@/common/defs/types';

const prefix = '/posts';
const ApiRoutes: CrudApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadOneBySlug: prefix + '/slug/{slug}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;



