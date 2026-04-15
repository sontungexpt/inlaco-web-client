import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  fetchCourses,
  fetchCourseDetail,
  createCourse,
  enrollCourse,
} from "@/services/course.service";
import {
  CourseDetail,
  FetchCoursesParams,
  NewCourse,
} from "@/types/api/course.api";

export const CourseQueryKey = {
  ALL: ["courses"],
  LIST: ({ page, pageSize, nonExpired, sort }: FetchCoursesParams) => [
    ...CourseQueryKey.ALL,
    "list",
    page,
    pageSize,
    nonExpired,
    sort,
  ],
  DETAIL: (id?: string) => [...CourseQueryKey.ALL, "detail", id],
};

// ----- Queries -----
export const useCourses = ({
  page = 0,
  pageSize = 20,
  nonExpired = true,
  sort,
}: FetchCoursesParams = {}) => {
  return useQuery({
    queryKey: CourseQueryKey.LIST({ page, pageSize, nonExpired, sort }),
    queryFn: () => fetchCourses({ nonExpired, page, pageSize, sort }),
    staleTime: 1000 * 60 * 5, // cache 5 phút
  });
};

export const useCourse = (id?: string) => {
  return useQuery({
    queryKey: CourseQueryKey.DETAIL(id as string),
    queryFn: () => fetchCourseDetail(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ----- Mutations -----
export const useCreateCourse = (
  options?: UseMutationOptions<CourseDetail, Error, NewCourse>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (payload: NewCourse) => createCourse(payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: CourseQueryKey.ALL });
      options?.onSuccess?.(...args);
    },
  });
};

export const useEnrollCourse = (
  options: UseMutationOptions<string, Error, unknown>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: enrollCourse,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: CourseQueryKey.ALL });
      options?.onSuccess?.(...args);
    },
  });
};
