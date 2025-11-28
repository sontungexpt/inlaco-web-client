import { fetchPosts } from "@/services/postServices";
import { useQuery } from "@tanstack/react-query";

export const usePosts = (page = 0, size = 20, type = "NEWS", sort = null) => {
  return useQuery({
    queryKey: ["posts", page, size, type, sort],
    queryFn: () => fetchPosts({ page, size, type, sort }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};
