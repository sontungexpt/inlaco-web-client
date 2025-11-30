const PostEndpoint = {
  GENERAL: "/v1/posts",
  CREATE_POST: "/v1/posts",
  UPDATE_POST: (id) => `/v1/posts/${id}`,
  GET_POSTS: "/v1/posts/web",
  GET_POST_BY_ID: (id) => `/v1/posts/${id}`,

  CHANGE_REGISTRATION_RECRUIMENT_POST_STATUS: (id) =>
    `/v1/recruitments/registration-status/${id}`,

  CANDIDATE_GENERAL: "/v1/candidates",
  CANDIDATE_APPLY: (postID) => `/v1/candidates/recruitment/${postID}`,
  CANDIDATE_APPLICATION: "/v1/candidates/profile/me",
  GET_ALL_CANDIDATES: "/v1/candidates/web",
  REVIEW_CANDIDATE: "/v1/candidates/review",
};

export default PostEndpoint;
