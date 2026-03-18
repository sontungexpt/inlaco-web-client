import { useQuery } from "@tanstack/react-query";
import { fetchContractTemplates } from "@/services/contractTemplateServices";

// ----- Contract Template Query Key -----
export const ContractTemplateQueryKey = {
  ALL: ["contract-templates"],
  LIST: ({ page, pageSize, sort }) => [
    ...ContractTemplateQueryKey.ALL,
    page,
    pageSize,
    sort,
  ],
};

// ----- List of contract templates -----
export function useContractTemplates({ page = 0, pageSize = 12, sort } = {}) {
  return useQuery({
    queryKey: ContractTemplateQueryKey.LIST({ page, pageSize, sort }),
    queryFn: () => fetchContractTemplates({ page, pageSize, sort }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}
