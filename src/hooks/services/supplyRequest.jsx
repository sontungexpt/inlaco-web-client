import {
  fetchSupplyRequests,
  fetchUniqueSupplyRequest,
} from "@/services/supplyReqServices";
import { useQuery } from "@tanstack/react-query";

export const useSupplyRequests = ({ page = 0, pageSize = 20, filter }) => {
  return useQuery({
    queryKey: ["supply-requests", page, pageSize, filter],
    queryFn: () => fetchSupplyRequests({ page, pageSize, filter }),
    staleTime: 1000 * 60 * 5, // cache 5 min
    keepPreviousData: true,
  });
};

export const useSupplyRequest = (id, params) => {
  return useQuery({
    queryKey: ["supply-request", id],
    queryFn: () => fetchUniqueSupplyRequest(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // cache 5 min
    ...params,
  });
};
