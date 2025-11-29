import {
  fetchCandidates,
  fetchPosts,
  fetchUniquePost,
} from "@/services/postServices";
import { useQuery } from "@tanstack/react-query";

export const usePost = (id) => {
  const result = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchUniquePost(id),
    enabled: !!id,
  });
  const post = result.data;
  return {
    post,
    ...result,
  };
};

export const usePosts = (page, size = 20, type = "NEWS", sort = null) => {
  return useQuery({
    queryKey: ["posts", page, size, type, sort],
    queryFn: () => fetchPosts({ page, size, type, sort }),
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
  sizePerPage = 20,
  sort = null,
}) => {
  return useQuery({
    queryKey: [
      "candidates",
      status,
      recruitmentPostId,
      page,
      sizePerPage,
      sort,
    ],
    queryFn: () =>
      fetchCandidates({
        page,
        size: sizePerPage,
        status,
        sort,
        recruitmentPostId,
      }),
    enabled: !!status,
    staleTime: 1000 * 60, // cache 1 phút
  });
};
