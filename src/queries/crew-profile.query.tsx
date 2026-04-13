import { useQuery } from "@tanstack/react-query";
import {
  fetchCrewProfiles,
  fetchMyCrewProfile,
  fetchSpecificCrewProfile,
} from "@/services/crew.service";
import {
  CrewProfileFetchParams,
  CrewProfileFilterCriteria,
} from "@/types/api/crew-profile";

export const CrewQueryKey = {
  ALL: ["crews"],

  LIST: ({ page, pageSize, filter }: CrewProfileFetchParams) => [
    ...CrewQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],

  DETAIL: (id: string) => [...CrewQueryKey.ALL, "detail", id],
} as const;

export function useCrewProfiles({
  page = 0,
  pageSize = 12,
  filter,
}: CrewProfileFetchParams) {
  return useQuery({
    queryKey: CrewQueryKey.LIST({ page, pageSize, filter }),
    queryFn: () => fetchCrewProfiles({ page, pageSize, filter }),
    staleTime: 1000 * 60,
  });
}

export function useCrewProfile(id = "me") {
  return useQuery({
    queryKey: CrewQueryKey.DETAIL(id),
    queryFn: () =>
      id === "me" ? fetchMyCrewProfile() : fetchSpecificCrewProfile(id),
    staleTime: 1000 * 30, // cache 30s
    enabled: !!id,
  });
}
