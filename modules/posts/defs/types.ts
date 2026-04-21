import { CrudObject, Id } from '@/common/defs/types';
import type { LocalizedText } from '@/common/utils/localized-text';

interface PostAgentUser {
  name?: string;
}

interface PostAgent {
  user?: PostAgentUser;
  website?: string;
  agencyName?: string;
}

interface PostTag {
  id: Id;
  name: LocalizedText | string;
  slug?: string;
}

interface PostCategory {
  id: Id;
  name: LocalizedText | string;
  slug: string;
}

interface PostImage {
  id: Id;
  url: string;
}

export interface Post extends CrudObject {
  agentId: Id;
  title: LocalizedText | string;
  slug: string;
  excerpt?: LocalizedText | string | null;
  content: LocalizedText | string;
  status: POST_STATUS;
  publishedAt?: string | null;
  imageId: Id;
  metaTitle?: LocalizedText | string | null;
  metaDescription?: LocalizedText | string | null;
  categories: PostCategory[];
  tags: PostTag[];
  image?: PostImage;
  agent?: PostAgent;
}

export enum POST_STATUS {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}
