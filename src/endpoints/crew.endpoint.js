const CrewEndpoint = {
  GENERAL: "/v1/sailors",
  GET_BY_ID: (id) => `/v1/sailors/${id}`,
  GET_ALL_CREWS: "/v1/sailors",
  CURRENT_PROFILE: "/v1/sailors/profile/me",
};

export default CrewEndpoint;
