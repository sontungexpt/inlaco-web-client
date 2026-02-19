const ContractEndpoint = {
  GET_ALL_CONTRACTS: "/v1/contracts",
  GET_CONTRACT_BY_ID: (id) => `/v1/contracts/${id}`,
  GET_CONTRACT_BY_APPLICATION_ID: (id) => `/v1/contracts/applications/${id}`,
  CREATE_LABOR_CONTRACT: (id) => `/v1/contracts/labors/${id}`,
  CREATE_SUPPLY_CONTRACT: (id) => `/v1/contracts/supplies/${id}`,
  UPDATE_CONTRACT: (id) => `/v1/contracts/${id}`,
  ACTIVE: (id) => `/v1/contracts/active/${id}`,

  GENERAL: "/v1/contracts",
  LABOR_GENERAL: "/v1/contracts/labors",
  SUPPLY_GENERAL: "/v1/contracts/supplies",
};

export default ContractEndpoint;
