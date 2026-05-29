import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchMobilizations,
  fetchSpecificMobilization,
  exportMobilizationExcel,
  fetchMyMobilizations,
} from "@/services/mobilization.service";
import {
  FetchMobilizationSchedulesParams,
  MobilizationSchedule,
} from "@/types/api/mobilization.api";
import { PageableResponse } from "@/types/api/shared/base.api";

export const MobilizationQueryKey = {
  ALL: ["mobilizations"],
  LIST: ({ page, pageSize, sort, filter }: FetchMobilizationSchedulesParams) =>
    [
      ...MobilizationQueryKey.ALL,
      "list",
      page,
      pageSize,
      sort,
      filter,
    ] as const,
  DETAIL: (id: string) => [...MobilizationQueryKey.ALL, "detail", id] as const,
};

export const useMobilizations = (
  { page, pageSize, sort, filter }: FetchMobilizationSchedulesParams,
  options?: Omit<
    UseQueryOptions<PageableResponse<MobilizationSchedule>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: MobilizationQueryKey.LIST({ page, pageSize, filter, sort }),
    queryFn: () =>
      fetchMobilizations({
        page,
        sort,
        pageSize,
        filter,
      }),
  });
};

export const useMyMobilizations = (
  { page, pageSize, sort, filter }: FetchMobilizationSchedulesParams,
  options?: Omit<
    UseQueryOptions<PageableResponse<MobilizationSchedule>>,
    "queryFn" | "queryKey"
  >,
) => {
  return useQuery({
    ...options,
    queryKey: MobilizationQueryKey.LIST({ page, pageSize, sort, filter }),
    queryFn: () =>
      fetchMyMobilizations({
        page,
        sort,
        pageSize,
        filter,
      }),
  });
};

export const useMobilizationDetail = (
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

export const useExportMobilizationExcel = () => {
  return useMutation({
    mutationFn: (id: string) => exportMobilizationExcel(id),
  });
};
