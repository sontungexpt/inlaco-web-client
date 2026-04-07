import { privateRequest } from "@/utils/request";
import { flattenFilter } from "@/utils/filter";
import ContractEndpoint from "@/endpoints/contract.endpoint";
import {
  BaseContract,
  ContractType,
  CrewSupplyContract,
  FetchContractParams,
  LaborContract,
  NewContractBase,
  NewCrewSupplyContract,
  NewLaborContract,
} from "@/types/api/contract.api";

export const activeContract = async (contractId: string) => {
  const response = await privateRequest.post(
    ContractEndpoint.ACTIVE(contractId),
  );
  return response.data;
};

export const fetchContracts = async ({
  page,
  pageSize,
  filter,
}: FetchContractParams) => {
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

export const fetchUniqueContract = async (
  contractId: string,
  version?: number,
) => {
  const response = await privateRequest.get<BaseContract>(
    ContractEndpoint.GET_CONTRACT_BY_ID(contractId),
    {
      params: {
        version: version,
      },
    },
  );
  return response.data;
};

export const fetchLaborContractByApplicationId = async (
  applicationId: string,
) => {
  const response = await privateRequest.get<LaborContract>(
    ContractEndpoint.GET_CONTRACT_BY_APPLICATION_ID(applicationId),
  );
  return response.data;
};

export const createLaborContract = async (
  candidateId: string,
  contract: NewLaborContract,
) => {
  const response = await privateRequest.post<LaborContract>(
    ContractEndpoint.CREATE_LABOR_CONTRACT(candidateId),
    {
      ...contract,
      type: "LABOR_CONTRACT",
    },
  );
  return response.data;
};

export const createSupplyContract = async (
  supplyRequestId: string,
  contract: NewCrewSupplyContract,
  contractFileAssetId: string,
  shipImageAssetId: string,
) => {
  const response = await privateRequest.post<CrewSupplyContract>(
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

export const editContract = async <T extends NewContractBase>(
  contractId: string,
  newDatas: T,
  type: ContractType = "LABOR_CONTRACT",
) => {
  const response = await privateRequest.patch<BaseContract>(
    ContractEndpoint.UPDATE_CONTRACT(contractId),
    {
      ...newDatas,
      type: type,
    },
  );
  return response.data;
};

export const getContractVersions = async (contractId: string) => {
  const response = await privateRequest.get<BaseContract[]>(
    ContractEndpoint.GET_CONTRACT_OLD_VERSIONS(contractId),
  );
  return response.data;
};
