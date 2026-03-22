import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCrewContracts,
  fetchUniqueContract,
  fetchUniqueContractByApplicationId,
  activeContract,
  createLaborContract,
  createSupplyContract,
  editContract,
} from "@/services/contractServices";

// ----- Contract Query Key -----
export const ContractQueryKey = {
  ALL: ["contracts"],
  LIST: ({ page, pageSize, signed, type }) => [
    ...ContractQueryKey.ALL,
    "list",
    page,
    pageSize,
    signed,
    type,
  ],
  DETAIL: (id) => [...ContractQueryKey.ALL, "detail", id],
  APPLICATION: (applicationId) => [
    ...ContractQueryKey.ALL,
    "application-contract",
    applicationId,
  ],
};

// ----- List of contracts -----
export function useContracts({ page = 0, pageSize = 12, signed, type }) {
  return useQuery({
    queryKey: ContractQueryKey.LIST({ page, pageSize, signed, type }),
    queryFn: () => fetchCrewContracts({ page, pageSize, signed, type }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

// ----- Single contract -----
export function useContract(id, props = {}) {
  return useQuery({
    queryKey: ContractQueryKey.DETAIL(id),
    queryFn: () => fetchUniqueContract(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 4,
    ...props,
  });
}

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
