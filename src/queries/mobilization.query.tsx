import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchMobilizations,
  fetchSpecificMobilization,
} from "@/services/mobilization.service";
import {
  FetchMobilizationSchedulesParams,
  MobilizationSchedule,
} from "@/types/api/mobilization.api";
import { PageableResponse } from "@/types/api/shared/base.api";

export const MobilizationQueryKey = {
  ALL: ["mobilizations"],
  LIST: ({ page, pageSize, filter }: FetchMobilizationSchedulesParams) => [
    ...MobilizationQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id: string) => [...MobilizationQueryKey.ALL, "detail", id],
};

export const useMobilizations = (
  { page, pageSize, filter }: FetchMobilizationSchedulesParams,
  options?: UseQueryOptions<PageableResponse<MobilizationSchedule>>,
) => {
  return useQuery({
    ...options,
    queryKey: MobilizationQueryKey.LIST({ page, pageSize, filter }),
    queryFn: () =>
      fetchMobilizations({
        page,
        pageSize,
        filter,
      }),
  });
};

export const useMobilization = (
  mobilizationId?: string,
  options?: UseQueryOptions<MobilizationSchedule>,
) => {
  return useQuery({
    ...options,
    enabled: !!mobilizationId,
    queryKey: MobilizationQueryKey.DETAIL(mobilizationId as string),
    queryFn: () => fetchSpecificMobilization(mobilizationId as string),
  });
};
