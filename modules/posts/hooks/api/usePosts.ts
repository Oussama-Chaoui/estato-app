import ApiRoutes from '@/common/defs/api-routes';
import { Post, POST_STATUS } from '@/modules/posts/defs/types';
import useItems, { UseItems, UseItemsOptions, defaultOptions, UseItemsHook, ItemResponse } from '@/common/hooks/useItems';
import { Id } from '@/common/defs/types';
import useApi, { FetchApiOptions } from '@/common/hooks/useApi';

export interface CreateOneInput {
  agent_id: Id;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: POST_STATUS;
  published_at?: string;
  image_id: Id;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateOneInput {
  agent_id: Id;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: POST_STATUS;
  published_at?: string;
  image_id: Id;
  meta_title?: string;
  meta_description?: string;
}

export type UpsertOneInput = CreateOneInput | UpdateOneInput;

export interface UsePostsHook extends UseItemsHook<Post, CreateOneInput, UpdateOneInput> {
  readOneBySlug: (slug: string, options?: FetchApiOptions) => Promise<ItemResponse<Post>>;
}

export type UsePosts = (opts?: UseItemsOptions) => UsePostsHook;

const usePosts: UsePosts = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Posts;
  const useItemsHook = useItems<Post, CreateOneInput, UpdateOneInput>(apiRoutes, opts);
  const fetchApi = useApi();

  const readOneBySlug = async (slug: string, options?: FetchApiOptions) => {
    const response = await fetchApi<{ item: Post }>(
      apiRoutes.ReadOneBySlug.replace('{slug}', slug),
      options
    );

    return response;
  };

  const hook: UsePostsHook = {
    ...useItemsHook,
    readOneBySlug,
  };

  return hook;
};

export default usePosts;



