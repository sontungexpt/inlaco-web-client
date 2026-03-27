import { MediaAsset } from "./shared/media.api";

export enum PostType {
  NEWS = "NEWS",
  RECRUITMENT = "RECRUITMENT",
  COURSE = "COURSE",
}

export interface PostResponse {
  id: string;
  type: PostType;
  title: string;
  content: string;
  description?: string;
  company?: string;
  updatedDate: string;
  active: boolean;
  image?: MediaAsset;
  attachments?: any[];
  authorId?: string;
}
