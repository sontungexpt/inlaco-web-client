import { privateRequest } from "@/utils/request";
import { flattenFilter } from "@/utils/filter";
import ContractEndpoint from "@/endpoints/contract.endpoint";
import ContractType from "@/constants/ContractTemplateType";

export const activeContract = async (contractID) => {
  const response = await privateRequest.post(
    ContractEndpoint.ACTIVE(contractID),
  );
  return response.data;
};

export const fetchContracts = async ({ page, pageSize, filter }) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_ALL_CONTRACTS,
    {
      params: {
        page,
        size: pageSize,
        ...flattenFilter(filter),
      },
    },
  );
  return response.data;
};

export const fetchUniqueContract = async (contractID, version) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_CONTRACT_BY_ID(contractID),
    {
      params: {
        version: version,
      },
    },
  );
  return response.data;
};

export const fetchUniqueContractByApplicationId = async (applicationId) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_CONTRACT_BY_APPLICATION_ID(applicationId),
  );
  return response.data;
};

export const createLaborContract = async ({ candidateId, contract }) => {
  const response = await privateRequest.post(
    ContractEndpoint.CREATE_LABOR_CONTRACT(candidateId),
    {
      ...contract,
      type: "LABOR_CONTRACT",
    },
    {
      params: {},
    },
  );
  return response.data;
};

export const createSupplyContract = async (
  supplyRequestId,
  contract,
  contractFileAssetId,
  shipImageAssetId,
) => {
  const response = await privateRequest.post(
    ContractEndpoint.CREATE_SUPPLY_CONTRACT(supplyRequestId),
    { ...contract, type: "SUPPLY_CONTRACT" },
    {
      params: {
        contractFileAssetId,
        shipImageAssetId,
      },
    },
  );
  return response.data;
};

export const editContract = async (
  id,
  newDatas,
  type = ContractType.LABOR_CONTRACT,
) => {
  const response = await privateRequest.patch(
    ContractEndpoint.UPDATE_CONTRACT(id),
    {
      ...newDatas,
      type: type,
    },
    {
      params: {},
    },
  );
  return response.data;
};

export const getContractVersions = async (contractID) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_CONTRACT_OLD_VERSIONS(contractID),
  );
  return response.data;
};
