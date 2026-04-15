import cloudinaryUpload from "@/services/cloudinary.service";
import {
  applyRecruitment,
  changeRegistrationRecruitmentPostStatus,
  fetchCandidates,
  fetchPosts,
  fetchUniqueCandidate,
  fetchUniquePost,
  reviewCandidateApplication,
} from "@/services/post.service";
import { FetchPostsParams, Post, PostType } from "@/types/api/post.api";
import { ApplyRecruitmentRequest } from "@/types/api/recruitment.api";
import { PageParams } from "@/types/api/shared/base.api";
import {
  useMutation,
  useQueryClient,
  useQuery,
  UseMutationOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "react-router";

export const PostQueryKey = {
  ALL: ["posts"],
  LIST: ({ page, pageSize, filter, sort }: FetchPostsParams) => [
    ...PostQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
    sort,
  ],

  DETAIL: (id: string) => [...PostQueryKey.ALL, "detail", id],

  ALL_CANDIDATES: ["candidates"],

  CANDIDATES: ({ page, pageSize, sort, filter }) => [
    ...PostQueryKey.ALL_CANDIDATES,
    "list",
    page,
    pageSize,
    sort,
    filter,
  ],

  CANDIDATE_DETAIL: (id) => [...PostQueryKey.ALL_CANDIDATES, "detail", id],
};

export const usePost = (id?: string) => {
  return useQuery<Post, AxiosError<ErrorResponse>>({
    enabled: !!id,
    queryKey: PostQueryKey.DETAIL(id as string),
    queryFn: () => fetchUniquePost(id as string),
  });
};

export const usePosts = ({
  page,
  pageSize = 20,
  sort,
  filter,
}: FetchPostsParams) => {
  return useQuery({
    queryKey: PostQueryKey.LIST({ page, pageSize, filter, sort }),
    queryFn: () => fetchPosts({ page, pageSize, filter, sort }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecruitmentPosts = ({
  page,
  pageSize = 10,
  sort,
  filter,
}: FetchPostsParams) => {
  return usePosts({
    page,
    pageSize,
    filter: {
      ...filter,
      type: "RECRUITMENT",
    },
    sort,
  });
};

export const useCandidates = ({ page, pageSize = 20, sort = null, filter }) => {
  return useQuery({
    queryKey: PostQueryKey.CANDIDATES({ page, pageSize, sort, filter }),
    queryFn: () =>
      fetchCandidates({
        page,
        pageSize,
        sort,
        filter,
      }),
    staleTime: 1000 * 60,
  });
};

export const useCandidate = (candidateId?: string) => {
  return useQuery({
    queryKey: PostQueryKey.CANDIDATE_DETAIL(candidateId),
    enabled: !!candidateId,
    queryFn: () => fetchUniqueCandidate(candidateId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useToggleRecruitmentPostStatus = ({ onSuccess, ...options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, active }) =>
      changeRegistrationRecruitmentPostStatus(id, active),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: PostQueryKey.ALL,
      });
      onSuccess?.(...args);
    },
  });
};

export const useReviewCandidate = ({
  candidateId,
  onSuccess,
  ...options
} = {}) => {
  const queryClient = useQueryClient();

  const fn =
    (candidateId &&
      ((status) => reviewCandidateApplication(candidateId, status))) ||
    (({ id, status }) => reviewCandidateApplication(id, status));

  return useMutation({
    ...options,
    mutationFn: fn,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: PostQueryKey.CANDIDATE_DETAIL(variables.id),
      });
      onSuccess?.(data, variables, context);
    },
  });
};

export function useApplyRecruitment(
  options: UseMutationOptions<
    any, // TData (đổi nếu API trả data)
    Error, // TError
    { postId: string; payload: ApplyRecruitmentRequest }
  > = {},
) {
  return useMutation({
    ...options,
    mutationFn: async ({ postId, payload, ...rest }) => {
      const upload = await cloudinaryUpload(payload.cvFile, "RESUME");
      return applyRecruitment(postId, payload, upload.assetId);
    },
  });
}
