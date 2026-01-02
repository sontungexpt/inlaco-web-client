const SupplyRequestEndpoint = {
  GET_SUPPLY_REQUESTS: "/v1/crew-rental-requests",
  GET_UNIQUE_SUPPLY_REQUEST: (id) => `/v1/crew-rental-requests/${id}`,
  CREATE_SUPPLY_REQUEST: "/v1/crew-rental-requests",
  REVIEW_SUPPLY_REQUEST: (id) => `/v1/crew-rental-requests/${id}/review`,
};

export default SupplyRequestEndpoint;
