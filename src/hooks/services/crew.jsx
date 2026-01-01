import { useQuery } from "@tanstack/react-query";
import { fetchCrewMembers } from "@/services/crewServices";

export function useCrewMembers({ page = 0, size = 12, official }) {
  return useQuery({
    queryKey: ["crew-members", official],
    queryFn: async () => fetchCrewMembers({ page, size, official }),
    staleTime: 1000 * 30, // cache 30s
  });
}
