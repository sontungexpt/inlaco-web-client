import {
  NewPost,
  NewRecruitmentPost,
  Post,
  PostType,
  RecruitmentPost,
} from "@/types/api/post.api";
import { datetimeToISO } from "@/utils/converter";
import { FormValues } from "./schema";

export const mapPostToFormValues = (
  currentFormValues: FormValues,
  post: Post,
) => {
  if (!post) return currentFormValues;

  const base = {
    type: post.type,
    title: post.title,
    content: post.content,
    company: post.company,
    description: post.description,
    image: post.image,
    attachments: post.attachments,
  };

  if (post.type === PostType.RECRUITMENT) {
    return {
      ...base,
      position: (post as RecruitmentPost).position,
      workLocation: (post as RecruitmentPost).workLocation,
      expectedSalary: (post as RecruitmentPost).expectedSalary,
      recruitmentStartDate: (post as RecruitmentPost).recruitmentStartDate,
      recruitmentEndDate: (post as RecruitmentPost).recruitmentEndDate,
    };
  }
  return base;
};

export const mapValuesToRequestBody = (
  values: FormValues,
  {
    imageAssetId,
    attachmentsAssetIds,
  }: { imageAssetId?: string; attachmentsAssetIds?: string[] },
): NewPost => {
  const base = {
    ...values,
    image: imageAssetId,
    attachments: attachmentsAssetIds,
  };
  if (values.type === PostType.RECRUITMENT) {
    return {
      ...base,
      position: values.position,
      expectedSalary: values.expectedSalary,
      workLocation: values.workLocation,
      recruitmentStartDate: datetimeToISO(values.recruitmentStartDate),
      recruitmentEndDate: datetimeToISO(values.recruitmentEndDate),
    } as NewRecruitmentPost;
  }
  return base as NewPost;
};
