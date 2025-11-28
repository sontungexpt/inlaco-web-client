const PostEndpoint = {
  GENERAL: "/v1/posts",
  CREATE_POST: "/v1/posts",
  GET_POSTS: "/v1/posts/web",
  CANDIDATE_GENERAL: "/v1/candidates",
  CANDIDATE_APPLY: (postID) => `/v1/candidates/recruitment/${postID}`,
  CANDIDATE_APPLICATION: "/v1/candidates/profile/me",
  GET_ALL_CANDIDATES: "/v1/candidates/web",
  REVIEW_CANDIDATE: "/v1/candidates/review",
};

export default PostEndpoint;
