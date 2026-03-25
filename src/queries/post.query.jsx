import {
  changeRegistrationRecruitmentPostStatus,
  fetchCandidates,
  fetchPosts,
  fetchUniqueCandidate,
  fetchUniquePost,
} from "@/services/post.service";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export const PostQueryKey = {
  ALL: ["posts"],

  LIST: ({ page, pageSize, filter, sort }) => [
    ...PostQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
    sort,
  ],

  DETAIL: (id) => [...PostQueryKey.ALL, "detail", id],

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

export const usePost = (id) => {
  return useQuery({
    queryKey: PostQueryKey.DETAIL(id),
    queryFn: () => fetchUniquePost(id),
    enabled: !!id,
    retry: 1,
  });
};

export const usePosts = ({ page, pageSize = 20, sort = null, filter }) => {
  return useQuery({
    queryKey: PostQueryKey.LIST({ page, pageSize, filter, sort }),
    queryFn: () => fetchPosts({ page, pageSize, filter, sort }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecruitmentPosts = ({
  page,
  pageSize = 10,
  sort = null,
  filter,
}) => {
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

export const useCandidate = (candidateId) => {
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
