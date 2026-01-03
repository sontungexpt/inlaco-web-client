const ContractEndpoint = {
  GET_ALL_CONTRACTS: "/v1/contracts",
  GET_CONTRACT_BY_ID: (id) => `/v1/contracts/${id}`,
  GENERAL: "/v1/contracts",
  CREATE_LABOR_CONTRACT: (id) => `/v1/contracts/labors/${id}`,
  LABOR_GENERAL: "/v1/contracts/labors",
  SUPPLY_GENERAL: "/v1/contracts/supplies",
  CREATE_SUPPLY_CONTRACT: (id) => `/v1/contracts/supplies/${id}`,
  ACTIVE: (id) => `/v1/contracts/active/${id}`,
};

export default ContractEndpoint;
