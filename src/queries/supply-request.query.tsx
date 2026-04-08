import {
  fetchSupplyRequests,
  fetchUniqueSupplyRequest,
} from "@/services/supply-request.service";
import { ErrorResponse } from "@/types/api/shared/base.api";
import { FetchSupplyRequestParams } from "@/types/api/supply-request.api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const SupplyRequestQueryKey = {
  ALL: ["supply-requests"],
  LIST: ({ page, pageSize, filter }: FetchSupplyRequestParams) => [
    ...SupplyRequestQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id: string) => [...SupplyRequestQueryKey.ALL, "detail", id],
};

export const useSupplyRequests = ({
  page = 0,
  pageSize = 20,
  filter,
}: FetchSupplyRequestParams) => {
  return useQuery({
    queryKey: SupplyRequestQueryKey.LIST({ page, pageSize, filter }),
    queryFn: () => fetchSupplyRequests({ page, pageSize, filter }),
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};

export const useSupplyRequest = (
  id: string,
  params: UseQueryOptions<unknown, AxiosError<ErrorResponse>>,
) => {
  return useQuery({
    staleTime: 1000 * 60 * 5, // cache 5 min
    ...params,
    queryKey: SupplyRequestQueryKey.DETAIL(id),
    queryFn: () => fetchUniqueSupplyRequest(id),
    enabled: !!id,
  });
};
