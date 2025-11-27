const CourseEndpoint = {
  GET_ALL_COURSES: "/v1/courses",
  SEARCH_COURSES: "/v1/courses/search",
  GET_COURSE_DETAIL: (id) => `/v1/courses/${id}`,

  CREATE_COURSE: "/v1/courses",
  CANCLE_COURSE: (id) => `/v1/courses/force_cancel/${id}`,
  CANCEL_REGISTRATION: (id) => `/v1/courses/registration/cancellation/${id}`,

  ENROLL_COURSE: (id) => `/v1/courses/registration${id}`,

  MARK_COURSE_COMPLETED: (courseId, userId) =>
    `/v1/courses/${courseId}/completation/${userId}`,

  UPDATE_COURSE: (id) => `/v1/courses/${id}`,
  DELETE_COURSE: (id) => `/v1/courses/${id}`,
};

export default CourseEndpoint;
