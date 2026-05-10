const CrewProfileEndpoint = {
  GET_BY_ID: (id) => `/v1/crew-profiles/${id}`,
  GET_ALL_CREWS: "/v1/crew-profiles",
  CURRENT_PROFILE: "/v1/crew-profiles/me",
  UPDATE_BY_ID: (id) => `/v1/crew-profiles/${id}`,
};

export default CrewProfileEndpoint;
