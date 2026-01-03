import { fetchCourseDetail, fetchCourses } from "@/services/courseServices";
import { useQuery } from "@tanstack/react-query";

export const useCourse = (id) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchCourseDetail(id),
    enabled: !!id,
  });
};

export const useCourses = (
  page,
  pageSize = 20,
  nonExpired = true,
  sort = null,
) => {
  return useQuery({
    queryKey: ["courses", page, pageSize, nonExpired, sort],
    queryFn: () =>
      fetchCourses({
        nonExpired,
        page,
        pageSize,
        sort,
      }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};
