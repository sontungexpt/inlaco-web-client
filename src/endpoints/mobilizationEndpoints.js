const MobilizationEndpoints = {
  GENERAL: "/v1/schedules",
  GET_BY_ID: (id) => `/v1/schedules/${id}`,
  CURRENT_MOBILIZATION: "/v1/schedules/sailors",
};

export default MobilizationEndpoints;
