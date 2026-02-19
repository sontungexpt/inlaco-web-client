import {
  fetchCandidates,
  fetchPosts,
  fetchUniqueCandidate,
  fetchUniquePost,
} from "@/services/postServices";
import { useQuery } from "@tanstack/react-query";

export const usePost = (id) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchUniquePost(id),
    enabled: !!id,
    retry: 1,
  });
};

export const usePosts = ({ page, pageSize = 20, sort = null, filter }) => {
  return useQuery({
    queryKey: ["posts", page, pageSize, filter, sort],
    queryFn: () => fetchPosts({ page, pageSize, filter, sort }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
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
    queryKey: ["candidates", page, pageSize, sort, filter],
    queryFn: () =>
      fetchCandidates({
        page,
        pageSize,
        sort,
        filter,
      }),
    staleTime: 1000 * 60, // cache 1 phút
  });
};

export const useCandidate = (candidateId) => {
  return useQuery({
    queryKey: ["candidate-profile", candidateId],
    enabled: !!candidateId,
    queryFn: () => fetchUniqueCandidate(candidateId),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
