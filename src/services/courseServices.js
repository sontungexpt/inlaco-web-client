import { publicRequest } from "@utils/request";
import CourseEndpoint from "../endpoints/CourseEndpoint";

export const getAllCoursesAPI = async (page, size) => {
  try {
    const response = await publicRequest.get(CourseEndpoint.GET_ALL_COURSES, {
      params: {
        page,
        size,
      },
    });
    return response;
  } catch (err) {
    return err.response;
  }
};
