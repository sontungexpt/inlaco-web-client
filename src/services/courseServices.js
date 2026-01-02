import { privateRequest } from "@utils/request";
import CourseEndpoint from "../endpoints/CourseEndpoint";

export const fetchCourses = async ({
  nonExpired = true,
  page = 1,
  size = 20,
  sort = null,
}) => {
  const response = await privateRequest.get(CourseEndpoint.GET_ALL_COURSES, {
    params: {
      nonExpired,
      sort,
      page,
      size,
    },
  });
  return response.data;
};

export const createCourse = async (payload) => {
  const res = await privateRequest.post(CourseEndpoint.CREATE_COURSE, payload);
  return res.data;
};

export const fetchCourseDetail = async (courseId) => {
  const res = await privateRequest.get(
    CourseEndpoint.GET_COURSE_DETAIL(courseId),
  );
  return res.data;
};
