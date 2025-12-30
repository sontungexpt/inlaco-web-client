import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewContracts,
  fetchUniqueContract,
} from "@/services/contractServices";

export function useContracts({ page = 0, size = 12, signed, type }) {
  return useQuery({
    queryKey: ["contracts", page, size, signed, type],
    queryFn: async () => fetchCrewContracts({ page, size, signed, type }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

export function useContract(id) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: async () => fetchUniqueContract(id),
    stableTime: 1000 * 60 * 4, // cache 4 min
  });
}
