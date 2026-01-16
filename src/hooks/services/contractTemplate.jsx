import { useQuery } from "@tanstack/react-query";
import { fetchContractTemplates } from "@/services/contractTemplateServices";

export function useContractTemplates({ page = 0, pageSize = 12, sort }) {
  return useQuery({
    queryKey: ["contract-templates", page, pageSize, sort],
    queryFn: () => fetchContractTemplates({ page, pageSize, sort }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}
