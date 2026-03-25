import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContractVersions,
  fetchContracts,
  fetchUniqueContract,
  fetchUniqueContractByApplicationId,
  activeContract,
  createLaborContract,
  createSupplyContract,
  editContract,
} from "@/services/contract.service";

// ----- Contract Query Key -----
export const ContractQueryKey = {
  ALL: ["contracts"],
  LIST: ({ page, pageSize, filter }) => [
    ...ContractQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id) => [...ContractQueryKey.ALL, "detail", id],
  APPLICATION: (applicationId) => [
    ...ContractQueryKey.ALL,
    "application-contract",
    applicationId,
  ],
  OLD_VERSIONS: (contractID) => [
    ...ContractQueryKey.ALL,
    "old-versions",
    contractID,
  ],
};

// ----- List of contracts -----
export function useContracts({ page = 0, pageSize = 12, filter }) {
  return useQuery({
    queryKey: ContractQueryKey.LIST({ page, pageSize, filter }),
    queryFn: () => fetchContracts({ page, pageSize, filter }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

// ----- Single contract -----
export function useContract(id, version = null, options = {}) {
  return useQuery({
    queryKey: ContractQueryKey.DETAIL(id),
    queryFn: () => fetchUniqueContract(id, version),
    enabled: !!id,
    staleTime: 1000 * 60 * 4,
    ...options,
  });
}

/**
 * Custom hook to fetch contract versions.
 *
 * @param {string} contractID - The ID of the contract to fetch versions for.
 * @param {object} options - Additional options for the query.
 * @returns {object} - The query object containing data, error, loading state, etc.
 */
export const useContractOldVersions = (contractID, options = {}) => {
  return useQuery({
    ...options,
    queryKey: ContractQueryKey.OLD_VERSIONS(contractID),
    queryFn: () => getContractVersions(contractID),
    enabled: !!contractID, // Only fetch if contractID is provided
  });
};

// ----- Contract by application -----
export function useApplicationContract(applicationId, props = {}) {
  return useQuery({
    queryKey: ContractQueryKey.APPLICATION(applicationId),
    queryFn: () => fetchUniqueContractByApplicationId(applicationId),
    enabled: !!applicationId,
    staleTime: 1000 * 60 * 4,
    ...props,
  });
}

export const useActiveContract = ({ onSuccess, onError, ...options }) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (contractID) => activeContract(contractID),
    onSuccess: (data, contractID, context) => {
      // invalidate detail + list
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(data, contractID, context);
    },
  });
};

export const useCreateLaborContract = ({ onSuccess, ...options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ candidateId, contract, contractFileAssetId }) =>
      createLaborContract(candidateId, contract, contractFileAssetId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(data, variables, context);
    },
  });
};

export const useCreateSupplyContract = ({ onSuccess, ...options }) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({
      supplyRequestId,
      contract,
      contractFileAssetId,
      shipImageAssetId,
    }) =>
      createSupplyContract(
        supplyRequestId,
        contract,
        contractFileAssetId,
        shipImageAssetId,
      ),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(data, variables, context);
    },
  });
};

export const useEditContract = ({ onSuccess, ...options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, newDatas, type }) => editContract(id, newDatas, type),
    onSuccess: (data, variables, context) => {
      // invalidate detail + list
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(data, variables, context);
    },
  });
};
