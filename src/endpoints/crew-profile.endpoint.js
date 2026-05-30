const CrewProfileEndpoint = {
  GET_BY_ID: (id) => `/v1/crew-profiles/${id}`,
  GET_ALL_CREWS: "/v1/crew-profiles",
  GET_ALL_MY_MOBILIZED_CREWS: "/v1/crew-profiles/my-mobilized",
  CURRENT_PROFILE: "/v1/crew-profiles/me",
  UPDATE_BY_ID: (id) => `/v1/crew-profiles/${id}`,
};

export default CrewProfileEndpoint;
