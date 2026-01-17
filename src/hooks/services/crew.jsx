import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewMembers,
  fetchMyCrewProfile,
  fetchSpecificCrewProfile,
} from "@/services/crewServices";
import { stableFilterKey } from "@/utils/filter";

export function useCrewMembers({ page = 0, size = 12, filter }) {
  return useQuery({
    queryKey: ["crew-members", page, size].concat(stableFilterKey(filter)),
    queryFn: () => fetchCrewMembers({ page, size, filter }),
    staleTime: 1000 * 30, // cache 30s
  });
}

export function useCrewProfile(id = "me") {
  return useQuery({
    queryKey: ["crew-profile", id],
    queryFn: () =>
      id === "me" ? fetchMyCrewProfile() : fetchSpecificCrewProfile(id),
    staleTime: 1000 * 30, // cache 30s
    enabled: !!id,
  });
}
