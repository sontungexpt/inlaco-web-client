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

export const usePosts = (page, pageSize = 20, type = "NEWS", sort = null) => {
  return useQuery({
    queryKey: ["posts", page, pageSize, type, sort],
    queryFn: () => fetchPosts({ page, pageSize, type, sort }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};

export const useRecruitmentPosts = (page, size = 10, sort = null) => {
  return usePosts(page, size, "RECRUITMENT", sort); // type = RECRUITMENT, sort = date
};

export const useCandidates = ({
  status,
  recruitmentPostId,
  page,
  pageSize = 20,
  sort = null,
}) => {
  return useQuery({
    queryKey: ["candidates", status, recruitmentPostId, page, pageSize, sort],
    queryFn: () =>
      fetchCandidates({
        page,
        pageSize,
        status,
        sort,
        recruitmentPostId,
      }),
    enabled: !!status,
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
