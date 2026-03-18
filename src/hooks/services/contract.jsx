import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCrewContracts,
  fetchUniqueContract,
  fetchUniqueContractByApplicationId,
} from "@/services/contractServices";

// ----- Contract Query Key -----
export const ContractQueryKey = {
  ALL: ["contracts"],
  LIST: ({ page, pageSize, signed, type }) => [
    ...ContractQueryKey.ALL,
    page,
    pageSize,
    signed,
    type,
  ],
  DETAIL: (id) => ["contract", id],
  APPLICATION: (applicationId) => ["application-contract", applicationId],
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
