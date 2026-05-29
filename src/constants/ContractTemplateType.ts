export const ContractTemplateType = {
  SUPPLY_CONTRACT: "SUPPLY_CONTRACT",
  LABOR_CONTRACT: "LABOR_CONTRACT",
};

export type ContractTemplateEnumType =
  (typeof ContractTemplateType)[keyof typeof ContractTemplateType];

export default ContractTemplateType;
