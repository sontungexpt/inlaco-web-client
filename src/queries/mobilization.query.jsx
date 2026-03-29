import { useQuery } from "@tanstack/react-query";
import {
  fetchMobilizations,
  fetchSpecificMobilization,
} from "@/services/mobilizationServices";

export const MobilizationQueryKey = {
  ALL: ["mobilizations"],
  LIST: ({ page, pageSize, filter }) => [
    ...MobilizationQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id) => [...MobilizationQueryKey.ALL, "detail", id],
};

export const useMobilizations = (
  { page, pageSize, filter },
  { ...options },
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

export const useMobilization = (mobilizationId, ...params) => {
  return useQuery({
    queryKey: MobilizationQueryKey.DETAIL(mobilizationId),
    queryFn: () => fetchSpecificMobilization(mobilizationId),
    enabled: !!mobilizationId,
    ...params,
  });
};
