import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewContracts,
  fetchUniqueContract,
} from "@/services/contractServices";

export function useContracts({ page = 0, pageSize = 12, signed, type }) {
  return useQuery({
    queryKey: ["contracts", page, pageSize, signed, type],
    queryFn: async () => fetchCrewContracts({ page, pageSize, signed, type }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

export function useContract(id) {
  return useQuery({
    queryKey: ["contract", id],
    enabled: !!id,
    queryFn: async () => fetchUniqueContract(id),
    stableTime: 1000 * 60 * 4, // cache 4 min
  });
}
