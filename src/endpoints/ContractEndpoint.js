const ContractEndpoints = {
  GET_ALL_CONTRACTS: "/v1/contracts",
  GET_CONTRACT_BY_ID: (id) => `/v1/contracts/${id}`,
  GENERAL: "/v1/contracts",
  LABOR_GENERAL: "/v1/contracts/labors",
  SUPPLY_GENERAL: "/v1/contracts/supplies",
  ACTIVE: "/v1/contracts/active",
};

export default ContractEndpoints;
