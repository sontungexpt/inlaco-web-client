const MobilizationEndpoint = {
  GET_ALL_MOBILIZATIONS: "/v1/schedules",
  GET_BY_ID: (id) => `/v1/schedules/${id}`,
  CREATE_MOBILIZATION: "/v1/schedules",
  CURRENT_MOBILIZATION: "/v1/schedules/sailors",
  EXPORT_EXCEL: (id) => `/v1/schedules/${id}/export`,
};

export default MobilizationEndpoint;
