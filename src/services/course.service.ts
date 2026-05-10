import { privateRequest } from "@utils/request";
import CourseEndpoint from "@/endpoints/course.endpoint";
import {
  CourseDetail,
  CourseResponse,
  FetchCoursesParams,
  NewCourse,
} from "@/types/api/course.api";
import { PageableResponse } from "@/types/api/shared/base.api";

export const fetchCourses = async ({
  nonExpired = true,
  page = 0,
  pageSize = 20,
  sort,
}: FetchCoursesParams) => {
  const response = await privateRequest.get<PageableResponse<CourseResponse>>(
    CourseEndpoint.GET_ALL_COURSES,
    {
      params: {
        nonExpired,
        sort,
        page,
        size: pageSize,
      },
    },
  );
  return response.data;
};

export const createCourse = async (payload: NewCourse) => {
  const res = await privateRequest.post<CourseDetail>(
    CourseEndpoint.CREATE_COURSE,
    payload,
    {
      params: {},
    },
  );
  return res.data;
};

export const fetchCourseDetail = async (courseId: string) => {
  const res = await privateRequest.get(
    CourseEndpoint.GET_COURSE_DETAIL(courseId),
  );
  return res.data;
};

export const enrollCourse = async (courseId: string) => {
  const res = await privateRequest.post(CourseEndpoint.ENROLL_COURSE(courseId));
  return res.data;
};

export const cancelCourse = async (courseId: string) => {
  const res = await privateRequest.post(CourseEndpoint.CANCLE_COURSE(courseId));
  return res.data;
};
