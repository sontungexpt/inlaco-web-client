const PostEndpoint = {
  GENERAL: "/v1/posts",
  CREATE_POST: "/v1/posts",
  UPDATE_POST: (id) => `/v1/posts/${id}`,
  GET_POSTS: "/v1/posts",
  GET_POST_BY_ID: (id) => `/v1/posts/${id}`,

  CHANGE_REGISTRATION_RECRUIMENT_POST_STATUS: (id) =>
    `/v1/recruitments/registration-status/${id}`,

  CANDIDATE_GENERAL: "/v1/applications",
  GET_CANDIDATE_BY_ID: (id) => `/v1/applications/${id}`,
  REVIEW_CANDIDATE: (id) => `/v1/admin/applications/${id}/review`,
  APPLY_CANDIDATE: (postID) => `/v1/applications/recruitment/${postID}`,

  CANDIDATE_APPLICATION: "/v1/candidates/profile/me",
  GET_ALL_CANDIDATES: "/v1/applications",
};

export default PostEndpoint;
