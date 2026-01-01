import { fetchSupplyRequests } from "@/services/supplyReqServices";
import { useQuery } from "@tanstack/react-query";

export const useSupplyRequests = ({ page = 0, size = 20, status }) => {
  return useQuery({
    queryKey: ["supply-requests", page, size, status],
    queryFn: () => fetchSupplyRequests({ page, size, status }),
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
};
