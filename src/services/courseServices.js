import { privateRequest } from "@utils/request";
import CourseEndpoint from "../endpoints/CourseEndpoint";

export const fetchCourses = async ({
  nonExpired = true,
  page = 0,
  pageSize = 20,
  sort = null,
}) => {
  const response = await privateRequest.get(CourseEndpoint.GET_ALL_COURSES, {
    params: {
      nonExpired,
      sort,
      page,
      size: pageSize,
    },
  });
  return response.data;
};

export const createCourse = async (payload, wallpaperAssetId, logoAssetId) => {
  const res = await privateRequest.post(CourseEndpoint.CREATE_COURSE, payload, {
    params: {
      wallpaperAssetId,
      logoAssetId,
    },
  });
  return res.data;
};

export const fetchCourseDetail = async (courseId) => {
  const res = await privateRequest.get(
    CourseEndpoint.GET_COURSE_DETAIL(courseId),
  );
  return res.data;
};

export const enrollCourse = async (courseId) => {
  const res = await privateRequest.post(CourseEndpoint.ENROLL_COURSE(courseId));
  return res.data;
};
