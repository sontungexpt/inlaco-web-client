const ContractTemplateEndpoint = {
  GET_ALL_TEMPLATES: "/v1/contract-templates",
  UPLOAD_TEMPLATE: "/v1/contract-templates",
  REMOVE_TEMPLATE: (id) => `/v1/contract-templates/${id}`,
};

export default ContractTemplateEndpoint;
