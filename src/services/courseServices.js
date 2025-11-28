import { privateRequest } from "@utils/request";
import CourseEndpoint from "../endpoints/CourseEndpoint";

export const fetchCourses = async ({
  nonExpired = true,
  page = 1,
  size = 20,
  sort = null,
}) => {
  try {
    const response = await privateRequest.get(CourseEndpoint.GET_ALL_COURSES, {
      params: {
        nonExpired,
        sort,
        page,
        size,
      },
    });
    return response.data;
  } catch (err) {
    return err.response;
  }
};

export const createCourse = async (payload) => {
  try {
    const res = await privateRequest.post(
      CourseEndpoint.CREATE_COURSE,
      payload,
    );
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export const fetchCourseDetail = async (courseId) => {
  try {
    const res = await privateRequest.get(
      CourseEndpoint.GET_COURSE_DETAIL(courseId),
    );
    return res.data;
  } catch (err) {
    return err.response;
  }
};
