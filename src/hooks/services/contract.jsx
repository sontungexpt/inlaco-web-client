import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewContracts,
  fetchUniqueContract,
  fetchUniqueContractByApplicationId,
} from "@/services/contractServices";

export function useContracts({ page = 0, pageSize = 12, signed, type }) {
  return useQuery({
    queryKey: ["contracts", page, pageSize, signed, type],
    queryFn: () => fetchCrewContracts({ page, pageSize, signed, type }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

export function useContract(id, props) {
  return useQuery({
    enabled: !!id,
    stableTime: 1000 * 60 * 4, // cache 4 min
    ...props,
    queryKey: ["contract", id],
    queryFn: () => fetchUniqueContract(id),
  });
}

export function useApplicationContract(applictionId, props) {
  return useQuery({
    enabled: !!applictionId,
    stableTime: 1000 * 60 * 4, // cache 4 min
    ...props,
    queryKey: ["application-contract", applictionId],
    queryFn: () => fetchUniqueContractByApplicationId(applictionId),
  });
}
