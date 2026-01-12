import { useQuery } from "@tanstack/react-query";
import { fetchCrewMembers } from "@/services/crewServices";
import { stableFilterKey } from "@/utils/filter";

export function useCrewMembers({ page = 0, size = 12, filter }) {
  return useQuery({
    queryKey: ["crew-members", page, size].concat(stableFilterKey(filter)),
    queryFn: async () => fetchCrewMembers({ page, size, filter }),
    staleTime: 1000 * 30, // cache 30s
  });
}
