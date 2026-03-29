import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewMembers,
  fetchMyCrewProfile,
  fetchSpecificCrewProfile,
} from "@/services/crew.service";

export const CrewQueryKey = {
  ALL: ["crews"],

  MEMBERS: {
    ALL: [...CrewQueryKey.ALL, "members"],
    LIST: ({ page, size, filter }) => [
      ...CrewQueryKey.MEMBERS.ALL,
      page,
      size,
      filter,
    ],
  },

  PROFILE: {
    ALL: [...CrewQueryKey.ALL, "profiles"],
    DETAIL: (id) => [...CrewQueryKey.PROFILE.ALL, id],
  },
};

export function useCrewMembers({ page = 0, size = 12, filter }) {
  return useQuery({
    queryKey: CrewQueryKey.MEMBERS.LIST({ page, size, filter }),
    queryFn: () => fetchCrewMembers({ page, size, filter }),
    staleTime: 1000 * 30, // cache 30s
  });
}

export function useCrewProfile(id = "me") {
  return useQuery({
    queryKey: CrewQueryKey.PROFILE.DETAIL(id),
    queryFn: () =>
      id === "me" ? fetchMyCrewProfile() : fetchSpecificCrewProfile(id),
    staleTime: 1000 * 30, // cache 30s
    enabled: !!id,
  });
}
