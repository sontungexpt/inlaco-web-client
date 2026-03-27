import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCourses,
  fetchCourseDetail,
  createCourse,
  enrollCourse,
} from "@/services/course.service";

export const CourseQueryKey = {
  ALL: ["courses"],
  LIST: ({ page, pageSize, nonExpired, sort }) => [
    ...CourseQueryKey.ALL,
    "list",
    page,
    pageSize,
    nonExpired,
    sort,
  ],
  DETAIL: (id) => [...CourseQueryKey.ALL, "detail", id],
};

// ----- Queries -----
export const useCourses = ({
  page = 0,
  pageSize = 20,
  nonExpired = true,
  sort = null,
} = {}) => {
  return useQuery({
    queryKey: CourseQueryKey.LIST({ page, pageSize, nonExpired, sort }),
    queryFn: () => fetchCourses({ nonExpired, page, pageSize, sort }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: CourseQueryKey.DETAIL(id),
    queryFn: () => fetchCourseDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ----- Mutations -----
export const useCreateCourse = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ payload }) => createCourse(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CourseQueryKey.ALL });
      options?.onSuccess?.(data, variables, context);
    },
  });
};

export const useEnrollCourse = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: enrollCourse,
    onSuccess: (data, courseId, context) => {
      queryClient.invalidateQueries({ queryKey: CourseQueryKey.ALL });
      options?.onSuccess?.(data, courseId, context);
    },
  });
};
