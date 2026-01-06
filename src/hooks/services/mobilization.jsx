import { useQuery } from "@tanstack/react-query";
import {
  fetchMobilizations,
  fetchSpecificMobilization,
} from "@/services/mobilizationServices";

export const useMobilization = (mobilizationId, ...params) => {
  return useQuery({
    queryKey: ["mobolization", mobilizationId],
    queryFn: () => fetchSpecificMobilization(mobilizationId),
    enabled: !!mobilizationId,
    ...params,
  });
};

export const useMobilizations = ({ page, pageSize, status }) => {
  return useQuery({
    queryKey: ["mobolizations", page, pageSize, status],
    queryFn: () =>
      fetchMobilizations({
        page,
        pageSize,
        status,
      }),
  });
};
