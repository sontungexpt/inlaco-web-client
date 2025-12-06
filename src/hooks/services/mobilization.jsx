import { useQuery } from "@tanstack/react-query";
import { fetchSpecificMobilization } from "@/services/mobilizationServices";

export const useMobilizationDetail = (mobilizationId, ...params) => {
  return useQuery({
    queryKey: ["mobolization", mobilizationId],
    queryFn: () => fetchSpecificMobilization(mobilizationId),
    enabled: !!mobilizationId,
    ...params,
  });
};
