import { Asset } from "./shared/asset.api";

export enum PostType {
  NEWS = "NEWS",
  RECRUITMENT = "RECRUITMENT",
  COURSE = "COURSE",
}

export interface Post {
  id: string;
  type: PostType;
  title: string;
  content: string;
  description?: string;
  company?: string;
  updatedAt: string;
  image?: Asset;
  attachments?: any[];
  authorId?: string;
}

export interface RecruitmentPost extends Post {
  position: string;
  expectedSalary: string;
  active: boolean;
  workLocation: string;
  recruitmentStartDate: string; //iso
  recruitmentEndDate: string; //iso
  type: PostType.RECRUITMENT;
}

export interface NewPost {
  type: PostType;
  title: string;
  content: string;
  description?: string;
  company?: string;
  image?: Asset;
  attachments?: any[];
}

export interface NewRecruitmentPost extends NewPost {
  position: string;
  expectedSalary: string;
  workLocation: string;
  recruitmentStartDate: string; //iso
  recruitmentEndDate: string; //iso
  type: PostType.RECRUITMENT;
}
